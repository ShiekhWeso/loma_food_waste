if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = "loma_food_waste";
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL || "http://localhost:3000";

const dbPath = path.join(__dirname, "db.json");
let mongoClient;
let mongoCollection;
let memoryDB = { users: [], meals: [], orders: [] };

if (fs.existsSync(dbPath)) {
  try {
    memoryDB = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    console.log("✅ Seeded in-memory database from db.json");
  } catch (err) {
    console.error("❌ Failed to parse db.json on startup:", err.message);
  }
}

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const PAYMOB_HMAC = process.env.PAYMOB_HMAC;
const PAYMOB_API_BASE_URL = process.env.PAYMOB_API_BASE_URL || "https://accept.paymob.com";

const isPaymobConfigured =
  PAYMOB_API_KEY &&
  !PAYMOB_API_KEY.includes("your_") &&
  PAYMOB_INTEGRATION_ID &&
  !String(PAYMOB_INTEGRATION_ID).includes("your_") &&
  PAYMOB_IFRAME_ID &&
  !String(PAYMOB_IFRAME_ID).includes("your_") &&
  PAYMOB_HMAC &&
  !PAYMOB_HMAC.includes("your_");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ── DB helpers (MongoDB-backed, synchronous in-memory cache) ──────────────────
function readDB() {
  return memoryDB;
}

function writeDB(data) {
  memoryDB = data;
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    console.log("💾 Persisted changes to db.json");
  } catch (err) {
    console.error("❌ Failed to write to db.json:", err.message);
  }
  if (mongoCollection) {
    mongoCollection
      .updateOne({ _id: "main" }, { $set: { ...data } }, { upsert: true })
      .catch((err) => console.error("Mongo write error:", err));
  }
}

async function connectMongo() {
  if (!MONGO_URI) {
    console.error("MONGO_URI is not set! Falling back to in-memory only (data will NOT persist).");
    return;
  }
  try {
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db(MONGO_DB_NAME);
    mongoCollection = db.collection("app_data");

    const existing = await mongoCollection.findOne({ _id: "main" });
    if (existing) {
      memoryDB = {
        users: existing.users || [],
        meals: existing.meals || [],
        orders: existing.orders || []
      };
    } else {
      await mongoCollection.insertOne({ _id: "main", users: [], meals: [], orders: [] });
    }
    console.log("✅ Connected to MongoDB Atlas, data loaded.");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
}

// ── 1. AUTH ───────────────────────────────────────────────────────────────────

app.post("/api/auth/signup", (req, res) => {
  const { email, password, name, role, locationAddress, locationCoords } = req.body;
  if (!email || !password || !name || !role)
    return res.status(400).json({ message: "Missing required fields" });

  const db = readDB();
  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(400).json({ message: "User with this email already exists" });

  const newUser = {
    id: "u_" + Date.now(), email, password, name, role,
    locationAddress: locationAddress || "Cairo, Maadi",
    locationCoords: locationCoords || { lat: 30.0444, lng: 31.2357 },
    favorites: []
  };
  db.users.push(newUser);
  writeDB(db);
  const { password: _, ...safe } = newUser;
  res.status(201).json(safe);
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  const db = readDB();
  const user = db.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  if (user && !user.favorites) {
    user.favorites = [];
    writeDB(db);
  }

  const { password: _, ...safe } = user;
  res.json(safe);
});

app.post("/api/auth/google", async (req, res) => {
  let { email, name, picture, role, access_token, isMock } = req.body;
  if (!email || !name || !role)
    return res.status(400).json({ message: "Missing required profile fields" });

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (googleClientId && googleClientId !== "your_google_client_id.apps.googleusercontent.com" && access_token && !isMock) {
    try {
      const verifyRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (verifyRes.ok) {
        const p = await verifyRes.json();
        email = p.email; name = p.name;
        if (p.picture) picture = p.picture;
      } else {
        return res.status(401).json({ message: "Google token verification failed" });
      }
    } catch (err) {
      console.error("Error verifying Google token:", err);
    }
  }

  const db = readDB();
  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: "u_" + Date.now(), email: email.toLowerCase(), name, role,
      password: "google_oauth_" + crypto.randomBytes(8).toString("hex"),
      picture: picture || "",
      locationAddress: "Cairo, Maadi",
      locationCoords: { lat: 30.0444, lng: 31.2357 },
      favorites: []
    };
    db.users.push(user);
    writeDB(db);
  } else {
    if (user.role !== role)
      return res.status(400).json({ message: `This email is already registered as a ${user.role}.` });
    let updated = false;
    if (picture && user.picture !== picture) { user.picture = picture; updated = true; }
    if (!user.favorites) { user.favorites = []; updated = true; }
    if (updated) writeDB(db);
  }

  const { password: _, ...safe } = user;
  res.json(safe);
});

app.post("/api/users/:userId/favorites", (req, res) => {
  const { userId } = req.params;
  const { mealId } = req.body;
  if (!mealId) return res.status(400).json({ message: "Missing mealId" });

  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ message: "User not found" });

  const user = db.users[userIndex];
  if (!user.favorites) {
    user.favorites = [];
  }

  const idToToggle = Number(mealId) || mealId;
  const idx = user.favorites.indexOf(idToToggle);
  if (idx > -1) {
    user.favorites.splice(idx, 1);
  } else {
    user.favorites.push(idToToggle);
  }

  db.users[userIndex] = user;
  writeDB(db);

  const { password: _, ...safe } = user;
  res.json(safe);
});

// ── 2. MEALS ──────────────────────────────────────────────────────────────────

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function checkAndCleanExpiredMeals(db) {
  const now = new Date();
  let updated = false;
  db.meals.forEach(m => {
    if (m.expiresAt) {
      const expDate = new Date(m.expiresAt);
      if (expDate <= now && m.qty > 0) {
        m.qty = 0;
        m.status = "Expired";
        m.statusColor = "#ba1a1a";
        m.statusBg = "#ffdad6";
        m.hidden = true;
        updated = true;
      }
    }
  });
  if (updated) writeDB(db);
}

app.get("/api/meals", (req, res) => {
  const { lat, lng } = req.query;
  const db = readDB();
  checkAndCleanExpiredMeals(db);
  let meals = db.meals;

  if (lat && lng) {
    const clientLat = parseFloat(lat), clientLng = parseFloat(lng);
    meals = meals.map(meal => {
      const restaurant = db.users.find(u => u.name === meal.restaurant && u.role === "restaurant");
      if (restaurant?.locationCoords) {
        const dist = calculateDistance(clientLat, clientLng, restaurant.locationCoords.lat, restaurant.locationCoords.lng);
        return { ...meal, distance: dist.toFixed(1) + " mi" };
      }
      return meal;
    });
  }
  res.json(meals);
});

app.post("/api/meals", (req, res) => {
  const { name, restaurant, img, originalPrice, rescuePrice, qty, category, expiresIn, description } = req.body;
  if (!name || !originalPrice || !rescuePrice || qty === undefined || !category)
    return res.status(400).json({ message: "Missing meal fields" });

  const db = readDB();
  const discount = Math.round(((originalPrice - rescuePrice) / originalPrice) * 100);
  const newMeal = {
    id: Date.now(), name,
    restaurant: restaurant || "The Conscious Kitchen",
    img: img || "https://lh3.googleusercontent.com/aida-public/AB6AXuBr10C-q-bWwjvAm_0LX8OU5HCDl2UsL6v5VHjsGn-mLkX1-M42jH9wy-pdFnc_R7Ft7CfWURCsH9nF2PfgK8r3ZK2UVhy2pl9WDujDhobljAjdwD0lg0mlGUx0_lA3-RGzz4fIQ5wPLdA0KgF659L3sr5Lj9Lqx80jgeSb45XDD30WE6gRHDMEhHCmb4JlXwZD0fsgQCk7o2UlCfhtCBd5JQRvezZ8eQ17F91gLYyh9coQkmEkarO_d-QAOwqLsjRXmitcof3JckU",
    status: qty <= 2 ? "Expiring Soon" : "Active",
    statusColor: qty <= 2 ? "#b06000" : "#1b6d24",
    statusBg: qty <= 2 ? "#ffdcc2" : "#a3f69c",
    originalPrice: parseFloat(originalPrice),
    rescuePrice: parseFloat(rescuePrice),
    discount,
    expiresIn: expiresIn || "2 hrs",
    qty: parseInt(qty),
    category,
    distance: "0.4 mi",
    description: description || "Delicious surplus meal rescued from today's batch."
  };
  db.meals.unshift(newMeal);
  writeDB(db);
  res.status(201).json(newMeal);
});

app.put("/api/meals/:id", (req, res) => {
  const mealId = parseInt(req.params.id);
  const db = readDB();
  const index = db.meals.findIndex(m => m.id === mealId);
  if (index === -1) return res.status(404).json({ message: "Meal not found" });

  const updatedMeal = { ...db.meals[index], ...req.body };
  if (req.body.originalPrice || req.body.rescuePrice) {
    updatedMeal.discount = Math.round(((updatedMeal.originalPrice - updatedMeal.rescuePrice) / updatedMeal.originalPrice) * 100);
  }
  if (updatedMeal.qty !== undefined) {
    updatedMeal.status = updatedMeal.qty <= 2 ? "Expiring Soon" : "Active";
    updatedMeal.statusColor = updatedMeal.qty <= 2 ? "#b06000" : "#1b6d24";
    updatedMeal.statusBg = updatedMeal.qty <= 2 ? "#ffdcc2" : "#a3f69c";
  }
  db.meals[index] = updatedMeal;
  writeDB(db);
  res.json(updatedMeal);
});

// PATCH endpoint for partial updates (e.g., qty from LiveDealsDashboard)
app.patch("/api/meals/:id", (req, res) => {
  const mealId = parseInt(req.params.id);
  const db = readDB();
  const index = db.meals.findIndex(m => m.id === mealId);
  if (index === -1) return res.status(404).json({ message: "Meal not found" });

  db.meals[index] = { ...db.meals[index], ...req.body };
  const m = db.meals[index];
  if (m.qty !== undefined) {
    m.status = m.qty <= 0 ? "Sold Out" : m.qty <= 2 ? "Expiring Soon" : "Active";
    m.statusColor = m.qty <= 0 ? "#ba1a1a" : m.qty <= 2 ? "#b06000" : "#1b6d24";
    m.statusBg = m.qty <= 0 ? "#ffdad6" : m.qty <= 2 ? "#ffdcc2" : "#a3f69c";
  }
  writeDB(db);
  res.json(db.meals[index]);
});

// DELETE all meals for a specific restaurant (Clear All) — must be BEFORE /api/meals/:id
app.delete("/api/meals/restaurant/:restaurantName", (req, res) => {
  const { restaurantName } = req.params;
  const db = readDB();
  const initial = db.meals.length;
  db.meals = db.meals.filter(m => m.restaurant !== decodeURIComponent(restaurantName));
  const deleted = initial - db.meals.length;
  writeDB(db);
  res.json({ message: `Deleted ${deleted} meal(s) successfully`, deleted });
});

app.delete("/api/meals/:id", (req, res) => {
  const mealId = parseInt(req.params.id);
  const db = readDB();
  const initial = db.meals.length;
  db.meals = db.meals.filter(m => m.id !== mealId);
  if (db.meals.length === initial) return res.status(404).json({ message: "Meal not found" });
  writeDB(db);
  res.json({ message: "Meal deleted successfully" });
});


// ── 3. ORDERS ─────────────────────────────────────────────────────────────────

app.get("/api/orders", (req, res) => {
  const db = readDB();
  const { customerId, restaurant } = req.query;
  let orders = db.orders;
  if (customerId) orders = orders.filter(o => o.customerId === customerId);
  else if (restaurant) orders = orders.filter(o => o.items.some(i => i.restaurant === restaurant));
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const { customerId, customerName, items, totalAmount, deliveryInfo, paymentMethod } = req.body;
  if (!items?.length || !totalAmount)
    return res.status(400).json({ message: "Missing order details" });

  const db = readDB();
  for (const item of items) {
    const meal = db.meals.find(m => m.id === item.id);
    if (!meal) return res.status(400).json({ message: `Meal ${item.name} not found` });
    if (meal.qty < item.quantity) return res.status(400).json({ message: `Insufficient quantity for ${meal.name}` });
  }
  for (const item of items) {
    const idx = db.meals.findIndex(m => m.id === item.id);
    db.meals[idx].qty -= item.quantity;
    if (db.meals[idx].qty <= 0) { db.meals[idx].qty = 0; db.meals[idx].status = "Sold Out"; db.meals[idx].statusColor = "#ba1a1a"; db.meals[idx].statusBg = "#ffdad6"; }
    else if (db.meals[idx].qty <= 2) { db.meals[idx].status = "Expiring Soon"; db.meals[idx].statusColor = "#b06000"; db.meals[idx].statusBg = "#ffdcc2"; }
  }
  const newOrder = {
    id: "ord_" + Math.floor(100000 + Math.random() * 900000),
    customerId: customerId || "guest",
    customerName: customerName || "Guest User",
    items, totalAmount,
    deliveryInfo: deliveryInfo || { name: customerName, address: "Cairo, Maadi" },
    paymentMethod: paymentMethod || "Credit Card",
    status: "Pending Pickup",
    timestamp: new Date().toISOString()
  };
  db.orders.unshift(newOrder);
  writeDB(db);
  res.status(201).json(newOrder);
});

app.get("/api/orders/:id", (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

// ── 4. PAYMOB ─────────────────────────────────────────────────────────────────

function verifyPaymobHmac(queryHmac, obj) {
  if (!PAYMOB_HMAC) return false;
  try {
    const concatString = [
      obj.amount_cents, obj.created_at, obj.currency,
      String(obj.error_occured) === "true", String(obj.has_parent_transaction) === "true",
      obj.id, obj.integration_id,
      String(obj.is_3d_secure) === "true", String(obj.is_auth) === "true",
      String(obj.is_capture) === "true", String(obj.is_refunded) === "true",
      String(obj.is_standalone_payment) === "true", String(obj.is_voided) === "true",
      obj.order?.id ?? "", obj.owner, String(obj.pending) === "true",
      obj.source_data?.pan ?? "", obj.source_data?.sub_type ?? "",
      obj.source_data?.type ?? "", String(obj.success) === "true"
    ].join("");
    return crypto.createHmac("sha512", PAYMOB_HMAC).update(concatString).digest("hex") === queryHmac;
  } catch {
    return false;
  }
}

app.post("/api/paymob/initiate-payment", async (req, res) => {
  const { customerId, customerName, items, totalAmount, deliveryInfo } = req.body;
  if (!items?.length || !totalAmount)
    return res.status(400).json({ message: "Missing order details" });

  const db = readDB();
  for (const item of items) {
    const meal = db.meals.find(m => m.id === item.id);
    if (!meal) return res.status(400).json({ message: `Meal ${item.name} not found` });
    if (meal.qty < item.quantity) return res.status(400).json({ message: `Insufficient quantity for ${meal.name}` });
  }

  const orderId = "ord_" + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    id: orderId, customerId: customerId || "guest",
    customerName: customerName || "Guest User",
    items, totalAmount,
    deliveryInfo: deliveryInfo || { name: customerName, address: "Cairo, Maadi" },
    paymentMethod: "Paymob Card",
    status: "Pending Payment",
    timestamp: new Date().toISOString()
  };
  db.orders.unshift(newOrder);
  writeDB(db);

  if (!isPaymobConfigured) {
    console.log("Paymob not configured — running Mock Sandbox mode.");
    return res.status(200).json({
      mock: true, orderId,
      paymentUrl: `${CLIENT_URL}/?mock_payment=true&orderId=${orderId}&amount=${totalAmount}`
    });
  }

  try {
    let baseUrl = PAYMOB_API_BASE_URL;
    let apiKey = PAYMOB_API_KEY;

    let authRes = await fetch(`${baseUrl}/api/auth/tokens`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey })
    });

    if (!authRes.ok) {
      const altUrl = baseUrl.includes("accept-alpha") ? "https://accept.paymob.com" : "https://accept-alpha.paymob.com";
      authRes = await fetch(`${altUrl}/api/auth/tokens`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey })
      });
      if (authRes.ok) baseUrl = altUrl;
      else if (apiKey?.startsWith("ZXk")) {
        const decoded = Buffer.from(apiKey, "base64").toString("utf8");
        authRes = await fetch(`${baseUrl}/api/auth/tokens`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: decoded })
        });
        if (authRes.ok) apiKey = decoded;
        else {
          authRes = await fetch(`${altUrl}/api/auth/tokens`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_key: decoded })
          });
          if (authRes.ok) { apiKey = decoded; baseUrl = altUrl; }
        }
      }
    }

    if (!authRes.ok) throw new Error(`Paymob Auth failed: ${await authRes.text()}`);
    const { token } = await authRes.json();

    const orderRes = await fetch(`${baseUrl}/api/ecommerce/orders`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token, delivery_needed: "false",
        amount_cents: Math.round(totalAmount * 100), currency: "EGP",
        items: items.map(i => ({ name: i.name, amount_cents: Math.round(i.rescuePrice * 100), quantity: i.quantity }))
      })
    });
    if (!orderRes.ok) throw new Error(`Paymob Order Registration failed: ${await orderRes.text()}`);
    const { id: paymobOrderId } = await orderRes.json();

    const db2 = readDB();
    const oi = db2.orders.findIndex(o => o.id === orderId);
    if (oi !== -1) { db2.orders[oi].paymobOrderId = paymobOrderId; writeDB(db2); }

    const firstName = deliveryInfo?.name?.trim().split(" ")[0] || "Guest";
    const lastName = deliveryInfo?.name?.trim().split(" ").slice(1).join(" ") || "User";

    // Sanitize phone number to match strict Paymob format (+201xxxxxxxxx)
    let rawPhone = deliveryInfo?.phone || "";
    let cleanPhone = rawPhone.replace(/[^\d+]/g, ""); // Keep only digits and +
    if (cleanPhone) {
      if (!cleanPhone.startsWith("+")) {
        if (cleanPhone.startsWith("0")) {
          cleanPhone = "+2" + cleanPhone;
        } else if (cleanPhone.startsWith("20")) {
          cleanPhone = "+" + cleanPhone;
        } else {
          cleanPhone = "+20" + cleanPhone;
        }
      }
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      cleanPhone = "+201000000000";
    }

    const keyRes = await fetch(`${baseUrl}/api/acceptance/payment_keys`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token, amount_cents: Math.round(totalAmount * 100),
        expiration: 3600, order_id: paymobOrderId,
        billing_data: {
          apartment: "NA", email: deliveryInfo?.email || "guest@example.com",
          floor: "NA", first_name: firstName,
          street: deliveryInfo?.address || "Maadi", building: "NA",
          phone_number: cleanPhone,
          shipping_method: "PKG", postal_code: "NA", city: "Cairo",
          country: "EG", last_name: lastName, state: "NA"
        },
        currency: "EGP", integration_id: parseInt(PAYMOB_INTEGRATION_ID),
        lock_order_to_card: false,
        // CRITICAL: Redirect URL after 3DS bank authentication
        // Without this, the iframe will get stuck in loading after bank verification
        redirect_url: CLIENT_URL
      })
    });
    if (!keyRes.ok) throw new Error(`Paymob Payment Key failed: ${await keyRes.text()}`);
    const { token: paymentKey } = await keyRes.json();

    res.status(200).json({
      mock: false, orderId, paymobOrderId,
      paymentUrl: `${baseUrl}/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`
    });
  } catch (error) {
    console.error("Paymob error:", error);
    res.status(500).json({ message: "Failed to initiate payment", error: error.message });
  }
});

// Paymob Callback Webhook
app.post("/api/paymob/callback", (req, res) => {
  console.log("Paymob Webhook received");
  const { hmac } = req.query;
  const { obj, type } = req.body;

  if (!obj || type !== "TRANSACTION")
    return res.status(400).json({ message: "Invalid payload type" });

  if (!verifyPaymobHmac(hmac, obj)) {
    console.error("Invalid Paymob HMAC signature!");
    return res.status(401).json({ message: "HMAC verification failed" });
  }

  const paymobOrderId = obj.order?.id;
  const success = String(obj.success) === "true";
  const pending = String(obj.pending) === "true";

  if (!paymobOrderId)
    return res.status(400).json({ message: "Order ID missing" });

  const db = readDB();
  const orderIndex = db.orders.findIndex(o => String(o.paymobOrderId) === String(paymobOrderId));
  if (orderIndex === -1)
    return res.status(404).json({ message: "Order not found" });

  const order = db.orders[orderIndex];

  if (!success && !pending) {
    order.status = "Payment Failed";
    db.orders[orderIndex] = order;
    writeDB(db);
    return res.status(200).json({ message: "Order marked as payment failed" });
  }

  if (success && !pending && order.status === "Pending Payment") {
    let hasStock = true;
    for (const item of order.items) {
      const meal = db.meals.find(m => m.id === item.id);
      if (!meal || meal.qty < item.quantity) { hasStock = false; break; }
    }
    if (hasStock) {
      for (const item of order.items) {
        const idx = db.meals.findIndex(m => m.id === item.id);
        db.meals[idx].qty -= item.quantity;
        if (db.meals[idx].qty <= 0) { db.meals[idx].qty = 0; db.meals[idx].status = "Sold Out"; db.meals[idx].statusColor = "#ba1a1a"; db.meals[idx].statusBg = "#ffdad6"; }
        else if (db.meals[idx].qty <= 2) { db.meals[idx].status = "Expiring Soon"; db.meals[idx].statusColor = "#b06000"; db.meals[idx].statusBg = "#ffdcc2"; }
      }
      order.status = "Pending Pickup";
    } else {
      order.status = "Payment Confirmed - Out of Stock";
    }
    order.paymentDetails = {
      transactionId: obj.id,
      cardPan: obj.source_data?.pan || null,
      cardType: obj.source_data?.sub_type || null,
      paidAt: new Date().toISOString()
    };
    db.orders[orderIndex] = order;
    writeDB(db);
    console.log(`Order ${order.id} paid successfully!`);
  }

  res.status(200).json({ message: "Callback processed successfully" });
});

// Simulate successful payment (Mock Mode)
app.post("/api/paymob/simulate-success", (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: "Missing orderId" });

  const db = readDB();
  const orderIndex = db.orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) return res.status(404).json({ message: "Order not found" });

  const order = db.orders[orderIndex];

  if (order.status === "Pending Payment") {
    let hasStock = true;
    for (const item of order.items) {
      const meal = db.meals.find(m => m.id === item.id);
      if (!meal || meal.qty < item.quantity) { hasStock = false; break; }
    }
    if (hasStock) {
      for (const item of order.items) {
        const idx = db.meals.findIndex(m => m.id === item.id);
        db.meals[idx].qty -= item.quantity;
        if (db.meals[idx].qty <= 0) { db.meals[idx].qty = 0; db.meals[idx].status = "Sold Out"; db.meals[idx].statusColor = "#ba1a1a"; db.meals[idx].statusBg = "#ffdad6"; }
        else if (db.meals[idx].qty <= 2) { db.meals[idx].status = "Expiring Soon"; db.meals[idx].statusColor = "#b06000"; db.meals[idx].statusBg = "#ffdcc2"; }
      }
      order.status = "Pending Pickup";
    } else {
      order.status = "Payment Confirmed - Out of Stock";
    }
    order.paymentDetails = {
      transactionId: "mock_tx_" + Date.now(),
      cardPan: "400000******0010",
      cardType: "visa",
      paidAt: new Date().toISOString()
    };
    db.orders[orderIndex] = order;
    writeDB(db);
  }

  res.status(200).json(db.orders[orderIndex]);
});

// ── 5. GROQ AI PROXY (Bypasses browser CORS) ──────────────────────────────────
app.post("/api/groq", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ message: "Missing messages array" });

  const apiKey =
    process.env.REACT_APP_GROQ_API_KEY ||
    process.env.GROQ_API_KEY;

  if (!apiKey) return res.status(500).json({ message: "Groq API key not configured on server" });

  // Try multiple models in order — first available wins
  const MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "llama3-8b-8192",
    "mixtral-8x7b-32768",
    "gemma2-9b-it"
  ];

  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`[Groq] Trying model: ${model}`);
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 700,
          temperature: 0.7
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`[Groq] ✅ Success with model: ${model}`);
        return res.json(data);
      }

      const errCode = data?.error?.code || "";
      const errMsg  = data?.error?.message || "Unknown error";
      console.error(`[Groq] ❌ Model ${model} failed (${response.status}): ${errMsg}`);
      lastError = { status: response.status, message: errMsg, code: errCode, data };

      // Only skip to next model if it's a model-specific error
      const skipToNext = errCode === "model_not_found" ||
        errCode === "model_not_active" ||
        response.status === 404 ||
        /not found|not active|deprecated/i.test(errMsg);

      if (!skipToNext) {
        // Auth error or rate limit — break out and use fallback
        break;
      }
    } catch (networkErr) {
      console.error(`[Groq] Network error for ${model}:`, networkErr.message);
      lastError = { status: 503, message: networkErr.message };
    }
  }

  // All models failed - return fallback response instead of error
  console.error("[Groq] All models exhausted. Using fallback response.", lastError);
  
  const lastUserMessage = messages.slice().reverse().find(m => m.role === "user")?.content || "";
  let fallbackReply = "أنا مساعد Lo'ma. للأسف هناك ضغط على خوادم الذكاء الاصطناعي، لكنني هنا لمساعدتك! يمكنك تصفح الوجبات المتاحة في السوق، أو التحقق من سلة مشترياتك.";
  if (lastUserMessage.match(/كيف|شغال|عمل/i)) fallbackReply = "نقوم بإنقاذ الطعام الفائض من المطاعم بأسعار مخفضة! تصفح السوق الآن.";
  if (lastUserMessage.match(/وجبات|أكل|طعام/i)) fallbackReply = "لدينا العديد من الوجبات بأسعار مخفضة! تفضل بزيارة السوق للاطلاع عليها.";
  if (lastUserMessage.match(/دفع|شراء|سلة/i)) fallbackReply = "يمكنك الدفع عبر البطاقة. افتح سلة مشترياتك لإتمام الطلب.";
  if (lastUserMessage.match(/حساب|طلب|سجل/i)) fallbackReply = "يمكنك مراجعة طلباتك السابقة من خلال ملفك الشخصي.";
  
  if (!lastUserMessage.match(/[\u0600-\u06FF]/)) {
      fallbackReply = "I am the Lo'ma assistant. Our AI servers are experiencing high traffic, but I can still help! You can browse meals in the marketplace, or check your cart.";
      if (lastUserMessage.match(/how|work/i)) fallbackReply = "We rescue surplus food at discounted prices. Browse the marketplace now!";
      if (lastUserMessage.match(/meal|food/i)) fallbackReply = "We have many discounted meals! Visit the marketplace to see them.";
      if (lastUserMessage.match(/pay|checkout|cart/i)) fallbackReply = "You can pay via card. Open your cart to checkout.";
      if (lastUserMessage.match(/account|order|history/i)) fallbackReply = "You can view your past orders in your profile.";
  }

  return res.json({
    choices: [
      {
        message: {
          content: fallbackReply
        }
      }
    ]
  });
});

// ── Boot ──────────────────────────────────────────────────────────────────────
connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`✅  Lo'ma server running on port ${PORT}`);
    console.log(`   Groq proxy: POST http://localhost:${PORT}/api/groq`);
  });
});