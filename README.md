# Notake

**Notake** is a modern note-taking web app built with **React Router Framework Mode** (formerly Remix JS) in **TypeScript**. It features AI-powered autocompletion using **Ollama Llama3.2**, integrated seamlessly within a rich text editor powered by **tiptap**.

---

## Features

- **User Authentication**  
  Signup and login system for secure access to your notes.

- **Organized Note Management**  
  - Sidebar with recent notes and folders  
  - Create, edit, and delete folders to organize notes  
  - Store notes inside folders for better organization

- **Rich Note Editor**  
  - Create new notes with title, date, and folder assignment  
  - Text editor built with tiptap supporting rich formatting  
  - AI autocompletion powered by Ollama Llama3.2 to suggest next 4-5 words based on user input  

- **AI Autocompletion Prompt**  
  ```ts
  const SYSTEM_PROMPT = `User will give you a text, you have to predict next 4-5 words (like autocomplete)
  Output of your response should be a suggestion string containing 4-5 words as a sentence
  Responses should be based on the context of user prompt, don't give random suggestions analyze the prompt and 
  then give response based on that
  
  If user prompt is random text and you don't have any predictions just output empty string.
  Give the response as a string.
  Example:
  user: I am
  assistant: a good student and`
- **Intuitive UI & Navigation** 
  - Left sidebar navigation with NavLinks
  - NavLinks show states: active, pending with pulse animation to indicate background loading
  - Smooth user experience with clear visual feedback on interactions

## Tech Stack
  - React Router Framework Mode (Remix JS) with TypeScript
  - tiptap rich text editor
  - Ollama Llama3.2 for AI autocompletion
  - MongoDB as the database

## Getting Started
  1. Clone the repo
  2. Install dependencies with npm install or yarn
  3. Setup Ollama Llama3.2 API and environment variables (example in .env-example file)
  4. Configure MongoDB and Ollama connection in environment variables
  4. Run the development server with npm run dev or yarn dev

## License
- MIT License

#### Built with ❤️ using modern React Router Framework Mode and AI technologies.