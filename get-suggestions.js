import ollama from 'ollama'

async function getSuggestion(userPrompt) {
    
    return response.message.content
}

const USER_PROMPT = `I am a student studying in an engineering college. I request the professor for`
console.log(await getSuggestion(USER_PROMPT))