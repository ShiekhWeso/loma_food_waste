require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, "db.json");

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const PAYMOB_HMAC = process.env.PAYMOB_HMAC;
const PAYMOB_API_BASE_URL = process.env.PAYMOB_API_BASE_URL || "https://accept.paymob.com";

const isPaymobConfigured = 
  PAYMOB_API_KEY && 
  PAYMOB_API_KEY !== "your_paymob_api_key" &&
  PAYMOB_INTEGRATION_ID &&
  PAYMOB_INTEGRATION_ID !== "your_card_integration_id" &&
  PAYMOB_IFRAME_ID &&
  PAYMOB_IFRAME_ID !== "your_iframe_id" &&
  PAYMOB_HMAC &&
  PAYMOB_HMAC !== "your_hmac_secret";

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Helper function to read from DB
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { users: [], meals: [], orders: [] };
  }
}

// Helper function to write to DB
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// Ensure database file exists on startup
if (!fs.existsSync(DB_PATH)) {
  writeDB({ users: [], meals: [], orders: [] });
}

// --- API ROUTES ---

// 1. AUTHENTICATION

// Signup Endpoint
app.post("/api/auth/signup", (req, res) => {
  const { email, password, name, contactName, role, locationAddress, locationCoords } = req.body;
  
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const db = readDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return res.status(400).json({ message: "User with this email already exists" });
  }

  const newUser = {
    id: "u_" + Date.now(),
    email,
    password, // In a real production app, encrypt this with bcrypt!
    name,
    contactName: contactName || "",
    role,
    locationAddress: locationAddress || "Cairo, Maadi",
    locationCoords: locationCoords || { lat: 30.0444, lng: 31.2357 }
  };

  db.users.push(newUser);
  writeDB(db);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// Login Endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  const db = readDB();
  const user = db.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Google Sign-in/up Endpoint
app.post("/api/auth/google", async (req, res) => {
  let { email, name, picture, role, access_token, isMock } = req.body;

  if (!email || !name || !role) {
    return res.status(400).json({ message: "Missing required profile fields" });
  }

  // Security Verification (only if client ID is set, and it's not a mock request)
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (googleClientId && googleClientId !== "your_google_client_id.apps.googleusercontent.com" && access_token && !isMock) {
    try {
      // Call Google API to verify token
      const verifyRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (verifyRes.ok) {
        const verifiedProfile = await verifyRes.json();
        email = verifiedProfile.email;
        name = verifiedProfile.name;
        if (verifiedProfile.picture) {
          picture = verifiedProfile.picture;
        }
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
    // Register new user
    user = {
      id: "u_" + Date.now(),
      email: email.toLowerCase(),
      name: name,
      role: role,
      password: "google_oauth_" + crypto.randomBytes(8).toString("hex"),
      picture: picture || "",
      locationAddress: "Cairo, Maadi",
      locationCoords: { lat: 30.0444, lng: 31.2357 }
    };
    db.users.push(user);
    writeDB(db);
  } else {
    // Existing user: check role
    if (user.role !== role) {
      return res.status(400).json({
        message: `This email is already registered as a ${user.role}. Please log in with the correct role.`
      });
    }
    // Update picture if it changed
    if (picture && user.picture !== picture) {
      user.picture = picture;
      writeDB(db);
    }
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// 2. MEALS / DEALS CRUD

// Haversine formula to calculate distance in miles
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get all meals
app.get("/api/meals", (req, res) => {
  const { lat, lng } = req.query;
  const db = readDB();
  
  let meals = db.meals;

  if (lat && lng) {
    const clientLat = parseFloat(lat);
    const clientLng = parseFloat(lng);

    meals = meals.map(meal => {
      // Find coordinates of this meal's restaurant
      const restaurant = db.users.find(
        u => u.name === meal.restaurant && u.role === "restaurant"
      );

      if (restaurant && restaurant.locationCoords) {
        const dist = calculateDistance(
          clientLat,
          clientLng,
          restaurant.locationCoords.lat,
          restaurant.locationCoords.lng
        );
        return {
          ...meal,
          distance: dist.toFixed(1) + " mi"
        };
      }
      return meal;
    });
  }

  res.json(meals);
});

// Create a new meal (Partner/Restaurant)
app.post("/api/meals", (req, res) => {
  const { name, restaurant, img, originalPrice, rescuePrice, qty, category, expiresIn, description } = req.body;

  if (!name || !originalPrice || !rescuePrice || qty === undefined || !category) {
    return res.status(400).json({ message: "Missing meal fields" });
  }

  const db = readDB();
  const discount = Math.round(((originalPrice - rescuePrice) / originalPrice) * 100);

  const newMeal = {
    id: Date.now(),
    name,
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

// Edit meal
app.put("/api/meals/:id", (req, res) => {
  const mealId = parseInt(req.params.id);
  const db = readDB();
  const index = db.meals.findIndex(m => m.id === mealId);

  if (index === -1) {
    return res.status(404).json({ message: "Meal not found" });
  }

  const updatedMeal = { ...db.meals[index], ...req.body };
  
  // Re-calculate discount if prices changed
  if (req.body.originalPrice || req.body.rescuePrice) {
    updatedMeal.discount = Math.round(
      ((updatedMeal.originalPrice - updatedMeal.rescuePrice) / updatedMeal.originalPrice) * 100
    );
  }

  // Update status based on qty
  if (updatedMeal.qty !== undefined) {
    updatedMeal.status = updatedMeal.qty <= 2 ? "Expiring Soon" : "Active";
    updatedMeal.statusColor = updatedMeal.qty <= 2 ? "#b06000" : "#1b6d24";
    updatedMeal.statusBg = updatedMeal.qty <= 2 ? "#ffdcc2" : "#a3f69c";
  }

  db.meals[index] = updatedMeal;
  writeDB(db);

  res.json(updatedMeal);
});

// Delete meal
app.delete("/api/meals/:id", (req, res) => {
  const mealId = parseInt(req.params.id);
  const db = readDB();
  const initialLength = db.meals.length;
  
  db.meals = db.meals.filter(m => m.id !== mealId);
  
  if (db.meals.length === initialLength) {
    return res.status(404).json({ message: "Meal not found" });
  }

  writeDB(db);
  res.json({ message: "Meal deleted successfully" });
});

// 3. ORDERS API

// Get order history
app.get("/api/orders", (req, res) => {
  const db = readDB();
  const { customerId, restaurant } = req.query;

  let filteredOrders = db.orders;

  if (customerId) {
    filteredOrders = filteredOrders.filter(o => o.customerId === customerId);
  } else if (restaurant) {
    filteredOrders = filteredOrders.filter(o => o.items.some(i => i.restaurant === restaurant));
  }

  res.json(filteredOrders);
});

// Place order & decrement quantity
app.post("/api/orders", (req, res) => {
  const { customerId, customerName, items, totalAmount, deliveryInfo, paymentMethod } = req.body;

  if (!items || !items.length || !totalAmount) {
    return res.status(400).json({ message: "Missing order details" });
  }

  const db = readDB();

  // Validate quantities and decrement meals
  for (const item of items) {
    const meal = db.meals.find(m => m.id === item.id);
    if (!meal) {
      return res.status(400).json({ message: `Meal ${item.name} not found` });
    }
    if (meal.qty < item.quantity) {
      return res.status(400).json({ message: `Insufficient quantity for ${meal.name}` });
    }
  }

  // Decrement quantities
  for (const item of items) {
    const mealIndex = db.meals.findIndex(m => m.id === item.id);
    db.meals[mealIndex].qty -= item.quantity;
    
    // Automatically flag zero quantity meals or update indicators
    if (db.meals[mealIndex].qty <= 0) {
      // Keep it in inventory but with qty 0 or remove it. Let's keep it with qty 0.
      db.meals[mealIndex].qty = 0;
      db.meals[mealIndex].status = "Sold Out";
      db.meals[mealIndex].statusColor = "#ba1a1a";
      db.meals[mealIndex].statusBg = "#ffdad6";
    } else if (db.meals[mealIndex].qty <= 2) {
      db.meals[mealIndex].status = "Expiring Soon";
      db.meals[mealIndex].statusColor = "#b06000";
      db.meals[mealIndex].statusBg = "#ffdcc2";
    }
  }

  // Create new order
  const newOrder = {
    id: "ord_" + Math.floor(100000 + Math.random() * 900000),
    customerId: customerId || "guest",
    customerName: customerName || "Guest User",
    items,
    totalAmount,
    deliveryInfo: deliveryInfo || { name: customerName, address: "Cairo, Maadi" },
    paymentMethod: paymentMethod || "Credit Card",
    status: "Pending Pickup",
    timestamp: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  writeDB(db);

  res.status(201).json(newOrder);
});

// Get order by ID
app.get("/api/orders/:id", (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(order);
});

// Helper to verify Paymob HMAC signature
function verifyPaymobHmac(queryHmac, obj) {
  if (!PAYMOB_HMAC) return false;
  
  try {
    const amount_cents = obj.amount_cents;
    const created_at = obj.created_at;
    const currency = obj.currency;
    const error_occured = String(obj.error_occured) === "true";
    const has_parent_transaction = String(obj.has_parent_transaction) === "true";
    const id = obj.id;
    const integration_id = obj.integration_id;
    const is_3d_secure = String(obj.is_3d_secure) === "true";
    const is_auth = String(obj.is_auth) === "true";
    const is_capture = String(obj.is_capture) === "true";
    const is_voided = String(obj.is_voided) === "true";
    const is_refunded = String(obj.is_refunded) === "true";
    const is_standalone_payment = String(obj.is_standalone_payment) === "true";
    const order_id = obj.order ? obj.order.id : "";
    const owner = obj.owner;
    const pending = String(obj.pending) === "true";
    const source_data_pan = obj.source_data ? obj.source_data.pan : "";
    const source_data_sub_type = obj.source_data ? obj.source_data.sub_type : "";
    const source_data_type = obj.source_data ? obj.source_data.type : "";
    const success = String(obj.success) === "true";

    const concatString = [
      amount_cents,
      created_at,
      currency,
      error_occured,
      has_parent_transaction,
      id,
      integration_id,
      is_3d_secure,
      is_auth,
      is_capture,
      is_voided,
      is_refunded,
      is_standalone_payment,
      order_id,
      owner,
      pending,
      source_data_pan,
      source_data_sub_type,
      source_data_type,
      success
    ].join("");

    const calculatedHmac = crypto
      .createHmac("sha512", PAYMOB_HMAC)
      .update(concatString)
      .digest("hex");

    return calculatedHmac === queryHmac;
  } catch (error) {
    console.error("Error calculating Paymob HMAC:", error);
    return false;
  }
}

// Initiate Paymob payment session
app.post("/api/paymob/initiate-payment", async (req, res) => {
  const { customerId, customerName, items, totalAmount, deliveryInfo } = req.body;

  if (!items || !items.length || !totalAmount) {
    return res.status(400).json({ message: "Missing order details" });
  }

  const db = readDB();

  // Validate quantities first
  for (const item of items) {
    const meal = db.meals.find(m => m.id === item.id);
    if (!meal) {
      return res.status(400).json({ message: `Meal ${item.name} not found` });
    }
    if (meal.qty < item.quantity) {
      return res.status(400).json({ message: `Insufficient quantity for ${meal.name}` });
    }
  }

  // Create a pending order in our database
  const orderId = "ord_" + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    id: orderId,
    customerId: customerId || "guest",
    customerName: customerName || "Guest User",
    items,
    totalAmount,
    deliveryInfo: deliveryInfo || { name: customerName, address: "Cairo, Maadi" },
    paymentMethod: "Paymob Card",
    status: "Pending Payment",
    timestamp: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  writeDB(db);

  if (!isPaymobConfigured) {
    console.log("Paymob credentials not fully configured. Running in Mock Sandbox mode.");
    const mockPaymentUrl = `http://localhost:3000/?mock_payment=true&orderId=${orderId}&amount=${totalAmount}`;
    return res.status(200).json({
      mock: true,
      orderId: orderId,
      paymentUrl: mockPaymentUrl
    });
  }

  try {
    let baseUrl = PAYMOB_API_BASE_URL;
    let apiKey = PAYMOB_API_KEY;

    // 1. Authentication Token
    let authRes = await fetch(`${baseUrl}/api/auth/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey })
    });
    
    // Fallback logic for mock/real environment discrepancies
    if (!authRes.ok) {
      const altUrl = baseUrl.includes("accept-alpha.paymob.com")
        ? "https://accept.paymob.com"
        : "https://accept-alpha.paymob.com";
        
      console.log(`Auth failed. Retrying with alternative URL: ${altUrl}...`);
      authRes = await fetch(`${altUrl}/api/auth/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey })
      });
      
      if (authRes.ok) {
        baseUrl = altUrl;
      } else if (apiKey && apiKey.startsWith("ZXk")) {
        console.log("Auth failed. Retrying with decoded JWT API key...");
        try {
          const decodedKey = Buffer.from(apiKey, "base64").toString("utf8");
          
          authRes = await fetch(`${baseUrl}/api/auth/tokens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_key: decodedKey })
          });
          
          if (authRes.ok) {
            apiKey = decodedKey;
          } else {
            authRes = await fetch(`${altUrl}/api/auth/tokens`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ api_key: decodedKey })
            });
            if (authRes.ok) {
              apiKey = decodedKey;
              baseUrl = altUrl;
            }
          }
        } catch (e) {
          console.error("Failed to decode and retry:", e);
        }
      }
    }

    if (!authRes.ok) {
      const errText = await authRes.text();
      throw new Error(`Paymob Auth failed: ${errText}`);
    }
    const authData = await authRes.json();
    const token = authData.token;

    // 2. Order Registration
    const orderRes = await fetch(`${baseUrl}/api/ecommerce/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: "false",
        amount_cents: Math.round(totalAmount * 100),
        currency: "EGP",
        items: items.map(i => ({
          name: i.name,
          amount_cents: Math.round(i.rescuePrice * 100),
          quantity: i.quantity
        }))
      })
    });

    if (!orderRes.ok) {
      const errText = await orderRes.text();
      throw new Error(`Paymob Order Registration failed: ${errText}`);
    }
    const paymobOrder = await orderRes.json();
    const paymobOrderId = paymobOrder.id;

    // Save Paymob Order ID to our local order object
    const updatedDb = readDB();
    const orderIndex = updatedDb.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      updatedDb.orders[orderIndex].paymobOrderId = paymobOrderId;
      writeDB(updatedDb);
    }

    // 3. Payment Key Request
    const firstName = deliveryInfo.name ? deliveryInfo.name.split(" ")[0] : "Guest";
    const lastName = deliveryInfo.name && deliveryInfo.name.split(" ").length > 1 
      ? deliveryInfo.name.split(" ").slice(1).join(" ") 
      : "User";

    const keyRes = await fetch(`${baseUrl}/api/acceptance/payment_keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        amount_cents: Math.round(totalAmount * 100),
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: {
          apartment: "NA",
          email: deliveryInfo.email || "guest@example.com",
          floor: "NA",
          first_name: firstName,
          street: deliveryInfo.address || "Maadi",
          building: "NA",
          phone_number: deliveryInfo.phone || "+201000000000",
          shipping_method: "PKG",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          last_name: lastName,
          state: "NA"
        },
        currency: "EGP",
        integration_id: parseInt(PAYMOB_INTEGRATION_ID),
        lock_order_to_card: false
      })
    });

    if (!keyRes.ok) {
      const errText = await keyRes.text();
      throw new Error(`Paymob Payment Key generation failed: ${errText}`);
    }
    const keyData = await keyRes.json();
    const paymentKey = keyData.token;

    const paymentUrl = `${baseUrl}/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    
    res.status(200).json({
      mock: false,
      orderId: orderId,
      paymobOrderId: paymobOrderId,
      paymentUrl: paymentUrl
    });

  } catch (error) {
    console.error("Paymob payment initiation error:", error);
    res.status(500).json({ message: "Failed to initiate payment with Paymob", error: error.message });
  }
});

// Paymob Callback Webhook
app.post("/api/paymob/callback", (req, res) => {
  console.log("Paymob Webhook received");
  const { hmac } = req.query;
  const { obj, type } = req.body;

  if (!obj || type !== "TRANSACTION") {
    return res.status(400).json({ message: "Invalid payload type" });
  }

  // Verify HMAC signature
  const isValid = verifyPaymobHmac(hmac, obj);
  if (!isValid) {
    console.error("Invalid Paymob HMAC signature!");
    return res.status(401).json({ message: "HMAC signature verification failed" });
  }

  const paymobOrderId = obj.order ? obj.order.id : null;
  const success = String(obj.success) === "true";
  const pending = String(obj.pending) === "true";

  if (!paymobOrderId) {
    return res.status(400).json({ message: "Order ID missing in transaction" });
  }

  const db = readDB();
  const orderIndex = db.orders.findIndex(o => o.paymobOrderId === paymobOrderId);

  if (orderIndex === -1) {
    console.error(`Order for Paymob Order ID ${paymobOrderId} not found in database.`);
    return res.status(404).json({ message: "Order not found" });
  }

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
      if (!meal || meal.qty < item.quantity) {
        hasStock = false;
        break;
      }
    }

    if (hasStock) {
      for (const item of order.items) {
        const mealIndex = db.meals.findIndex(m => m.id === item.id);
        db.meals[mealIndex].qty -= item.quantity;
        
        if (db.meals[mealIndex].qty <= 0) {
          db.meals[mealIndex].qty = 0;
          db.meals[mealIndex].status = "Sold Out";
          db.meals[mealIndex].statusColor = "#ba1a1a";
          db.meals[mealIndex].statusBg = "#ffdad6";
        } else if (db.meals[mealIndex].qty <= 2) {
          db.meals[mealIndex].status = "Expiring Soon";
          db.meals[mealIndex].statusColor = "#b06000";
          db.meals[mealIndex].statusBg = "#ffdcc2";
        }
      }
      order.status = "Pending Pickup";
    } else {
      order.status = "Payment Confirmed - Out of Stock";
    }

    order.paymentDetails = {
      transactionId: obj.id,
      cardPan: obj.source_data ? obj.source_data.pan : null,
      cardType: obj.source_data ? obj.source_data.sub_type : null,
      paidAt: new Date().toISOString()
    };

    db.orders[orderIndex] = order;
    writeDB(db);
    console.log(`Order ${order.id} paid successfully!`);
  }

  res.status(200).json({ message: "Callback processed successfully" });
});

// Simulate successful payment for Mock Mode
app.post("/api/paymob/simulate-success", (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ message: "Missing orderId" });
  }

  const db = readDB();
  const orderIndex = db.orders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ message: "Order not found" });
  }

  const order = db.orders[orderIndex];

  if (order.status === "Pending Payment") {
    let hasStock = true;
    for (const item of order.items) {
      const meal = db.meals.find(m => m.id === item.id);
      if (!meal || meal.qty < item.quantity) {
        hasStock = false;
        break;
      }
    }

    if (hasStock) {
      for (const item of order.items) {
        const mealIndex = db.meals.findIndex(m => m.id === item.id);
        db.meals[mealIndex].qty -= item.quantity;
        
        if (db.meals[mealIndex].qty <= 0) {
          db.meals[mealIndex].qty = 0;
          db.meals[mealIndex].status = "Sold Out";
          db.meals[mealIndex].statusColor = "#ba1a1a";
          db.meals[mealIndex].statusBg = "#ffdad6";
        } else if (db.meals[mealIndex].qty <= 2) {
          db.meals[mealIndex].status = "Expiring Soon";
          db.meals[mealIndex].statusColor = "#b06000";
          db.meals[mealIndex].statusBg = "#ffdcc2";
        }
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

// Boot server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
