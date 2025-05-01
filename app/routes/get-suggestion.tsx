import { data, useLocation } from "react-router";
import type { Route } from "./+types/get-suggestion";
import { getRandomInteger } from "~/utils/utils";
import ollama from 'ollama'

const SYSTEM_PROMPT = `User will give you a text, you have to predict next 4-5 words (like autocomplete)
    Output of your response should be a suggestion string containing 4-5 words as a sentence
    Responses should be based on the context of user prompt, don't give random suggestions analyze the prompt and then give response based on that
    
    If user prompt is random text and you don't have any predictions just output empty string.
    Give the response as a string.
    Example:
    user: I am
    assistant: a good student and
    `

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  
  const userPrompt = url.searchParams.get('content')

  const response = await ollama.chat({
    model: 'llama3.2',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ]
  })


  const suggestion = response.message.content

  console.log(suggestion)
  return data({ suggestion }, { status: 200 })
}