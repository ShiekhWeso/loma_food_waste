require("dotenv").config();
const { MongoClient } = require("mongodb");
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("./server/db.json", "utf8"));
const client = new MongoClient(process.env.MONGO_URI);

client.connect().then(async () => {
  const col = client.db("loma_food_waste").collection("app_data");
  await col.updateOne(
    { _id: "main" },
    { $set: { meals: data.meals, users: data.users, orders: data.orders } },
    { upsert: true }
  );
  console.log("Seeded!", data.meals.length, "meals,", data.users.length, "users");
  await client.close();
}).catch(console.error);