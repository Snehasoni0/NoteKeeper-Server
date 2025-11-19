import mongoose from "mongoose";

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MonoDB");
  } catch (error) {
    console.log("Error while connecting to MongoDB", error.message);
  }
};

export default connectToMongoDb;