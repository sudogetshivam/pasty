#!/usr/bin/env node
const axios = require("axios");

const BASE_URL = "http://localhost:8000/api/auth";

const args = process.argv.slice(2)
const command = args[0]

async function run() {
    if (command === "save") {
        const message = args.slice(1).join(" ");
        if (!message) {
            console.error("Error:")
            console.log("Please provide a message")
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}/send-message`, {
                message: message,
                isOnce: false,
            });
            console.log(res.data.data.code)
        } catch (error) {
            console.error("Error in retrieving message")
        }
    }

    else if (command === "saveat") {
        const message = args.slice(1);
        if (message.length < 2) {
            console.error("Error:")
            console.log("Please provide a  message")
            return;
        }
        try {
            const code = message[0];
            const msg = args.slice(2).join(" ")
            const res = await axios.post(`${BASE_URL}/send-message`, {
                message: msg,
                mycode: code,
                isOnce: false
            });
            console.log(res.data.data.code)
        } catch (error) {
            console.error("Error in saving message")
        }
    }
    else if (command === "saveonce") {
        const message = args.slice(1).join(" ");
        if (!message) {
            console.error("Error:")
            console.log("Please provide a  message")
            return;
        }
        try {
            const res = await axios.post(`${BASE_URL}/send-message`, {
                message: message,
                isOnce: true
            })
            console.log(res.data.data.code)
        } catch (error) {
            console.error("Error in retrieving message")
        }
    }
    else if (command === "get") {
        const code = args[1];
        if (!code) {
            console.log("Please provide a right code");
            return;
        }

        try {

            const res = await axios.post(`${BASE_URL}/retrieve-message`, {
                code: code
            }
            );
            console.log(res.data.data?.message || res.data.message)

        } catch (error) {
            console.log("Error in retrieving in message")

        }
    }
    else if (command === "ai") {
        const prompt = args.slice(1).join(' ');

        if (!prompt) {
            console.error("Prompt is missing")
            return;
        }
        console.log("Running...")
        try {
            const { default: ora } = await import('ora')
            const spinner = ora('running...').start()

            const { pipeline, env } = await import('@xenova/transformers');


            env.allowLocalModels = true;

            const generator = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat', {
                dtype: 'q4'
            })

            spinner.text = "thinking..."

            const systemInstruction = `You are Pasty AI, an Elite professional technical assistant. 

Rules:
1. Coding: Expert in ML, Cryptography, DSA, Compilers, and Full-stack. Provide only clean, efficient code.
2. Engineering Math: Solve complex problems step-by-step. Use LaTeX for math.
3. CS Topics: Accurate answers for DSA, OS, and DBMS.
4. Daily Tasks: Provide direct, practical steps for daily life queries.
5. Constraints: No filler words. Be concise. Use Markdown formatting.`;

            const fullPrompt = `<|im_start|>system\n${systemInstruction}<|im_end|>\n<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n`;
            const output = await generator(fullPrompt, {
                do_sample: false,
                max_new_tokens: 512,
                repetition_penalty: 1.1, // Isse zyada bada jawab nahi dega (tokens bachenge)
                // temperature: 0.7,    // Thodi creativity ke liye
                // top_p: 0.9,          // Accuracy maintain karne ke liye
            });

            const fullText = output[0].generated_text;
            const assistantMarker = '<|im_start|>assistant\n';
            let cleanAnswer;
            if (fullText.includes(assistantMarker)) {
                cleanAnswer = fullText.split(assistantMarker)[1].replace('<|im_end|>', '').trim();
            } else {
                // Fallback: strip the prompt from the beginning of the output
                cleanAnswer = fullText.replace(fullPrompt, '').replace('<|im_end|>', '').trim();
            }
            spinner.succeed("Done")
            console.log("==================================================");
            console.log(cleanAnswer.trim());
            console.log("==================================================\n");

            process.exit(0);

        } catch (error) {
            console.error("Fatal Error: Could not wake up the AI.");
            console.error("Reason:", error?.message || error);
            console.error(error?.stack);
            process.exit(1);


        }
    }
    else {
        console.log("Pasty CLI - Global Clipboard Tool");
        console.log("Usage:");
        console.log("  pasty save <message>");
        console.log("  pasty get <code>");
    }
}

run();


