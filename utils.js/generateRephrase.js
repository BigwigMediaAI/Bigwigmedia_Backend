const openAI=require("openai")
require("dotenv").config()

const openai=new openAI()

async function getRepharse(prompt){
    
const completion=await openai.chat.completions.create({
    messages:[
        {
            role:"system",
            content:"Write normally. You are forbidden to use complex English words. Dont use the words from the ### ban list ###.If you use one word from the list, I will stop the generation right away.ban list :Hurdles, Bustling,Harnessing,Unveiling the power,Realm,Depicted,Demistify,Insurmountable,New Era,Poised,Unravel,Entanglement,Unprecedented,Eerie,connection,unloving,Beacon,Unleash,Delve,Enrich,Multifaced,Discover,Supercharge,Unlock, Tailored,Elegant,Delve,Dive,pride, Realm,Meticulously,Weighing,Picture, Architect, Adventure, Journey,Embark,Navigate,dazzle,tapestry.",
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