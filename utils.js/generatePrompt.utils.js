const generatePrompt = (templete, prompt, tone, useEmoji, useHashTags) => {
    console.log(templete, prompt, tone, useEmoji, useHashTags);
    let test = templete + " based on following prompt.\n" + prompt;
    let config = {
        tone: tone,
        useEmoji: useEmoji,
        useHashTags: useHashTags,
    };
    test += "\n\nconfiguration: ";
    test += JSON.stringify(config, null, 2);

    if(!useEmoji) {
        test += "\n\nno emojis";
    }
    if(!useHashTags) {
        test += "\n\nno hashtags";
    }
    // test += ". Use " + tone + " tone";
    // test += useEmoji ? " and use emojis" : " don't use emojis";
    // test += useHashTags ? " and use hashtags" : " don't use hashtags";
    return test;
};

module.exports = generatePrompt;
