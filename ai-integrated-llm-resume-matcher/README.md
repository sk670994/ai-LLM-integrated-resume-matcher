# AI LLM Integrated Resume Matcher (MongoDB + Ollama)

Next.js app for:
- Uploading resumes
- Extracting structured profile data using an LLM
- Matching resumes against job requirements using LLM scoring
- Ranking candidates by `match_score`

## Tech Stack

- Next.js App Router
- MongoDB
- Ollama (default LLM provider)
- Optional OpenAI-compatible provider (Groq/OpenAI)

## Environment Variables (`.env.local`)

```env
MONGO_URI=your_mongodb_connection_string
# or MONGODB_URI=your_mongodb_connection_string

LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=gpt-oss:120b-cloud
```

Optional OpenAI-compatible mode:

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama3-70b-8192
```

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available Routes

- `POST /api/resumes/upload` upload and analyze a resume
- `POST /api/resumes/match` match all resumes against job requirements
- `GET /api/resumes` list uploaded resumes

## Notes

- Supported upload formats: `.txt`, `.pdf`, `.docx`
- If matching returns fallback scores, verify your Ollama model exists:
  - `ollama list`
  - set `OLLAMA_MODEL` to exact installed model name
