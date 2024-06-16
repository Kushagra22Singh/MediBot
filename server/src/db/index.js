import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      "MongoDB connected successfully: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("MongoDB connection failed ", error);
    process.exit(1);
  }
};

export { dbConnect };
