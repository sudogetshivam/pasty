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
      expiresAt: {
    type: Date,
    default: null
  }
    
},[{timestamps:true}])

export const Message=mongoose.model('Message',mongoose.Schema(messageSchema))