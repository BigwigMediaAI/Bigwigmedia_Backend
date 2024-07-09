const openAI=require("openai")
require("dotenv").config()

const OPENAI=new openAI()


async function Seopodcast(prompt,topic, guest, background, interests, tone,language){
    const completion=await OPENAI.chat.completions.create({
        messages:[
            {
                role:"system",
                content:`Generate podcast questions and answers based in ${language} language on the following details:
        
                Topic: ${topic}
                Guest: ${guest}
                Background: ${background}
                Specific Interests: ${interests}
                Tone: ${tone}
                
                Please ensure that there are 10 questions and answers for the podcast.
            `,
            },
            {
                role:"user",
                content:prompt
            }
        ],
        model:"gpt-4o"

    })
    // return completion.choices[0].message.content.replace(/(\|\r\n|\n|\r)/gm, "");
    const generatedText = completion.choices[0].message.content;
       
    // console.log(gene)
    // Split the generated text into individual questions and answers
    const qaPairs = [];
    let currentQuestion = "";
    let currentAnswer = "";

    generatedText.split(/(?:Q(?:uestion)?|A(?:nswer)?)\s*\d+:?/).slice(1).forEach((part, index) => {
        if (index % 2 === 0) {
            currentQuestion = part.trim();
        } else {
            currentAnswer = part.trim();
            qaPairs.push({ question: `Question: ${currentQuestion}`, answer: `Answer: ${currentAnswer}` });
        }
    });

    return { qaPairs };
    
    
}

module.exports=Seopodcast