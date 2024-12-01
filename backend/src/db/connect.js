import mongoose from "mongoose";


const connect = async () => {
  try {
    console.log("Attempting to connect to database.....");
    await mongoose.connect("mongodb+srv://taskmanager:manager1234@cluster0.1euwf.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0",{});
    console.log("Connected to database.....");
  } catch (error) {
    console.log("Failed to connect to database.....", error.message);
    process.exit(1);
  }
};

export default connect;
