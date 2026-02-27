// lib/mongo.ts
import { MongoClient } from "mongodb";

// Replace with your MongoDB Atlas connection string
const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("Please define the MONGO_URI environment variable inside .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Ensure a singleton client across hot reloads in development
if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    // @ts-ignore
    global._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each deployment
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;