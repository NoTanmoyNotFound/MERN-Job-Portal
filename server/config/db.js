 import mongoose from "mongoose";

// Function to connect to the database
 const connectDB = async() => {
    // mongoose.connection.on('Connected', () => console.log("Databse Connected"))
    // await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}/job-portal`)
    } catch (error) {
        console.log("Error connection to MongoDB: ",error.message)
        process.exit(1) // 1 is failure, 0 status code is susccess
    }

}
export default connectDB
