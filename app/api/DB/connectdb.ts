import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGOOSE_URI) {
    return console.log("MONGOOSE_URI not defined");
  }
  try {
    await mongoose.connect(process.env.MONGOOSE_URI);
    console.log("DB Connected Successfully !");
  } catch (error: any) {
    console.log(error.message);
    process.exit(1);
  }
};
