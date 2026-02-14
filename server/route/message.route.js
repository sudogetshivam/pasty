import { sendMessage,retrieveMessage,deleteMessage } from "../controller/message.controller.js";
import express from 'express'

const router = express.Router()
router.post('/send-message',sendMessage)
router.post('/retrieve-message',retrieveMessage)
router.post('/delete-message',deleteMessage)

export default router