# YouTube Better — Frontend

A React + Vite single-page application for the YouTube Better project. Provides an authenticated interface for ingesting YouTube videos, chatting with video transcripts via RAG, generating AI-powered notes, and exporting them as Markdown or PDF.

## Features

- **Supabase Authentication**: Sign in with Email, Google, or GitHub via Supabase Auth.
- **Video Ingestion**: Paste a YouTube URL to ingest a video's transcript into the RAG pipeline.
- **Grounded Chat**: Ask questions about the video and receive cited, context-aware answers powered by OpenAI.
- **AI Notes Generation**: Generate comprehensive notes on any topic from the video transcript.
- **Model Selection**: Choose between OpenAI models (e.g. `gpt-5.4-mini`, `gpt-5-mini`) from the UI.
- **Notes Management**: View, copy, download (Markdown & PDF), and browse previously saved notes.
- **Persistent State**: Zustand store with localStorage persistence for chat history, notes, and model selection.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| State | Zustand (persisted) |
| Styling | Tailwind CSS |
| HTTP | Axios |
| Auth | Supabase JS SDK |
| Markdown | react-markdown |
| PDF Export | html2pdf.js |
| Icons | Lucide React |
| Notifications | react-hot-toast |

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment variables**:
   Create a `.env` file:

   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
   ```

3. **Supabase Auth Setup**:
   Enable Google, GitHub, and Email auth providers in your Supabase dashboard. Add your callback URLs in Supabase Auth settings:

   ```text
   http://localhost:5173/app
   ```

4. **Start development server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Project Structure

```text
src/
  api/
    client.js         Axios instance & endpoint functions
  components/
    AuthProvider.jsx   Supabase session listener
    ChatInterface.jsx  Grounded Q&A chat panel
    ModelSelector.jsx  OpenAI model dropdown
    NotesDisplay.jsx   Notes generation, saved notes, and export
  pages/
    AuthPage.jsx       Login / signup page
  store/
    useStore.js        Main Zustand store (video, chat, notes, model)
    useAuthStore.js    Auth state (user, session, tokens)
  App.jsx             Root layout & routing
  main.jsx            Entry point
```

## Authentication Flow

The frontend attaches the current Supabase access token to all backend requests:

```text
Authorization: Bearer <access_token>
```

The backend verifies this JWT and extracts the user ID for all protected endpoints.
