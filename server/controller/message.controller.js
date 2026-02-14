import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js"
import { Message } from "../model/message.model.js";
import 'dotenv/config'

const codeGenerator =  function(){
    const code=Math.floor(1000 + Math.random()*10000)
    return code;
}

const sendMessage = asyncHandler(async(req,res)=>{
    const {message} = req.body
    if(!message){
        throw new apiError(501,"Please Enter your Message")
    }
    const code = codeGenerator();
    const ifCodeExists =await Message.findOne({code})
    while(ifCodeExists){
        code = codeGenerator();
        ifCodeExists = await Message.findOne({code});
    }

    const msg = await Message.create({
        code,
        message
    })
    // const successInSaving = await msg.save();
    // if(!successInSaving){
    //     throw new apiError(402,"Something went wrong while saving. Try Again")
    // }
    const createdMessage = await Message.findById(msg._id).select("-password");
    if (!createdMessage){
        throw new apiError(404,"Something went wrong while uploading Message. Try Again")
    }
    return res.status(201).json(
        new apiResponse(201,createdMessage,`Your created Message code is:${code}`)
    )


      
})

const retrieveMessage = asyncHandler(async(req,res)=>{
    const {code} = req.body;
    console.log(`This is code ${code}`)
    if(!code){
        throw new apiError(501,"Please provide a 4-digit Code")
    }
    const getCode =await Message.findOne({code});
    if(!getCode){
        throw new apiError(502,"Code doesn't match")
    }
    console.log("I am here")
    const retrived=await Message.findById(getCode._id).select("-code");
    if(!retrived){
        throw new apiError(407,"Something Went wrong while fetching your message. Please try again")
    }
    return res.status(200).json(
        new apiResponse(204,null,`${retrived.message}`)
    )
})

const deleteMessage = asyncHandler(async(req,res)=>{
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Code is required",
      });
    }

    const deleted = await Message.findOneAndDelete({ code: code });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }    
})

export {retrieveMessage,sendMessage,deleteMessage}