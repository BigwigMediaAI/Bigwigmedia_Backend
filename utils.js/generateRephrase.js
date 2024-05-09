const openAI=require("openai")
require("dotenv").config()

const openai=new openAI()

async function getRepharse(prompt){
    
const completion=await openai.chat.completions.create({
    messages:[
        {
            role:"system",
            content:"Rephrase the provided content in a more human-like manner, ensuring it sounds natural and conversational. The goal is to retain the original meaning while expressing it in a way that feels as if a person is speaking. Avoid overly formal language or complex structures",
        },
        {
            role:"user",
            content:prompt
        }
    ],
    model:"gpt-4-turbo"

})
return completion.choices[0].message.content.replace(/(\|\r\n|\n|\r)/gm, "");
}

module.exports=getRepharse