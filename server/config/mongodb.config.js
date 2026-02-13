import mongoose from "mongoose";
import 'dotenv/config'

const connectDB = async() =>{
   try {
    console.log("Connecting to:", process.env.MONGODB_URI);
     const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
     console.log("MONGODB connection sucessfull with Hostname",connectionInstance.connection.host)
   } catch (error) {
    console.error("MONGODB connection failed",error)      
   }
   /* mongodb uses wildcard dns, if you typed aything at place of "auth", it will still
   recognise your database */     
}    

export default connectDB;