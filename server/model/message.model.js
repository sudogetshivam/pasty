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
    isOnce: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        default: null
    }
}, {timestamps: true})

export const Message = mongoose.model('Message', messageSchema)