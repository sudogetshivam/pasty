#!/usr/bin/env node
const axios = require("axios");

const BASE_URL = "https://pasty-api.onrender.com/api/auth";

const args = process.argv.slice(2)
const command = args[0]

async function run(){
    if(command === "save"){
        const message = args.slice(1).join(" ");
        if(!message){
            console.error("Error:")
            console.log("Please provide a message")
            return;
        }

        try{
            const res = await axios.post(`${BASE_URL}/send-message`,{
                message: message,
            });
            console.log(res.data.data.code)
        }catch(error){
            console.error("Error in retrieving message")
        }
    }
    else if(command === "get"){
        const code = args[1];
        if(!code){
            console.log("Please provide a right code");
            return;
        }

        try {

            const res = await axios.post(`${BASE_URL}/retrieve-message`,{
                code:code
            }
            );
            console.log(res.data.data?.message || res.data.message)
            
        } catch (error) {
            console.log("Error in retrieving in message")
            
        }
    }
    else{
    console.log("Pasty CLI - Global Clipboard Tool");
    console.log("Usage:");
    console.log("  pasty save <message>");
    console.log("  pasty get <code>");
    }
}

run();


