import { sendMessage,retrieveMessage } from "../controller/message.controller.js";
import express from 'express'

const router = express.Router()
router.post('/send-message',sendMessage)
router.post('/retrieve-message',retrieveMessage)

export default router