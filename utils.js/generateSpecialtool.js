const openAI=require("openai")
require("dotenv").config()

const openai=new openAI()

async function getSpecialtool(prompt){
    
const completion=await openai.chat.completions.create({
    messages:[
        {
            role:"system",
            content:"Convert any thing to hindi language",
        },
        {
            role:"user",
            content:prompt
        }
    ],
    model:"gpt-3.5-turbo-1106"

})
return completion.choices[0].message.content;
}

module.exports=getSpecialtool