import mongoose,{Schema} from "mongoose";
const messageSchema = new Schema({
    code:{
        type:Number,
        required:true,
        unique:true
    },
    message:{
        type:String,
        required:true
    },
    createdat:{
        type:Date, 
        // required:true 
    },
    expiresat:{
        type:Date,
    //    required:true 
    }
    
})

export const Message=mongoose.model('Message',mongoose.Schema(messageSchema))