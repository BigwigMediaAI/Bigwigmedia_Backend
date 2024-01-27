const generatePrompt = (templete, prompt, tone, useEmoji, useHashTags) => {
    console.log(templete, prompt, tone, useEmoji, useHashTags);
    let test = templete + " based on " + prompt + ". Use " + tone + " tone";
    test += useEmoji ? " and use emojis" : " don't use emojis";
    test += useHashTags ? " and use hashtags" : " don't use hashtags";
    return test;
};

module.exports = generatePrompt;
