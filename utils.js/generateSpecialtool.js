const openAI=require("openai")
require("dotenv").config()

const openai=new openAI()

async function getSpecialtool(prompt,language,outputCount){
    let responses = [];


    for (let i = 0; i < outputCount; i++) {
const completion=await openai.chat.completions.create({
    messages:[
        {
            role:"system",
            content:`You are now the world's best and fastest teacher. Your goal is to teach dumb students complicated concepts in ${language} language, in a very innovative and understanding way.`,
        },
        {
            role:"user",
            content:prompt
        }
    ],
    model:"gpt-4"

})
responses.push(completion.choices[0].message.content) ;
    }
    return responses
}

module.exports=getSpecialtool