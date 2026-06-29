const mongoose = require("mongoose");

let dbAvailable = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      dbAvailable = false;
      console.warn("MONGO_URI not set; using file-based task storage.");
      return false;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000
    });
    dbAvailable = true;
    console.log("MongoDB Connected");
    return true;
  } catch (error) {
    dbAvailable = false;
    console.warn("MongoDB connection failed, falling back to file-based task storage:", error.message);
    return false;
  }
};

const isDbAvailable = () => dbAvailable || mongoose.connection.readyState === 1;

module.exports = { connectDB, isDbAvailable };