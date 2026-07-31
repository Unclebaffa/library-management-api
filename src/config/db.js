import mongoose from 'mongoose';

/**
 * Asynchronous MongoDB connection wrapper using Mongoose.
 * Logs host & database name upon success, and gracefully exits on error.
 */
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `[Database] MongoDB connected successfully | Host: ${connectionInstance.connection.host} | DB: ${connectionInstance.connection.name}`
    );
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failure: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
