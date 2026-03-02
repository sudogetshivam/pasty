import { pipeline, env } from '@xenova/transformers';

// Default settings
env.allowRemoteModels = true;

async function runAI() {
    console.log("🚀 Loading the Qwen Brain from Cache...");
    
    try {
        const generator = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat');

        console.log("\n✅ AI AWAKE & READY!\n");

        // Chat model ka special format
        const prompt = "<|im_start|>user\n.Write a c++ program to solve House in the robber 2 of dynamic programming.<|im_end|>\n<|im_start|>assistant\n";
        
        const output = await generator(prompt, {
            max_new_tokens: 150, // 50 tokens kam the code ke liye, isliye 150 kar diya
            temperature: 0.3, // Code accuracy ke liye temperature low
        });

        console.log("🤖 AI Output:\n");
        
        // Asli code yahan se extract hoga, raw object ko hide karke
        const fullText = output[0].generated_text;
        const cleanAnswer = fullText.split('<|im_start|>assistant\n')[1]; 
        
        console.log(cleanAnswer || fullText);

    } catch (error) {
        console.log("\n❌ Error:", error.message);
    }
}

runAI();