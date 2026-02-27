import OpenAI from "openai";

export type LLMAnalysisResult = {
  llm_summary: string;
  llm_skills: string[];
  llm_roles: string[];
  llm_experience_years: number;
};

export type ResumeMatchResult = {
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  match_summary: string;
};

type ChatMessage = { role: "system" | "user"; content: string };

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return "{}";
}

async function runWithOllama(messages: ChatMessage[]): Promise<string> {
  const model = process.env.OLLAMA_MODEL || "llama3.1";
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages,
      options: { temperature: 0 },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data?.message?.content ?? "{}";
}

async function runWithOpenAICompatible(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "No LLM credentials found. Use OLLAMA_BASE_URL/OLLAMA_MODEL for Ollama, or set GROQ_API_KEY."
    );
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || "https://api.groq.com/openai/v1",
  });

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "llama3-70b-8192",
    temperature: 0,
    messages,
  });

  return response.choices[0]?.message?.content || "{}";
}

async function callLLM(messages: ChatMessage[]): Promise<string> {
  if ((process.env.LLM_PROVIDER || "ollama").toLowerCase() === "ollama") {
    return runWithOllama(messages);
  }
  return runWithOpenAICompatible(messages);
}

export async function analyzeResumeWithLLM(
  resumeText: string
): Promise<LLMAnalysisResult> {
  try {
    const content = await callLLM([
      {
        role: "system",
        content:
          "You are an AI Resume Analyzer. Extract resume details and return only valid JSON.",
      },
      {
        role: "user",
        content: `Return ONLY JSON with this shape:
{
  "llm_summary": string,
  "llm_skills": string[],
  "llm_roles": string[],
  "llm_experience_years": number
}

Resume:
${resumeText}`,
      },
    ]);

    return JSON.parse(extractJson(content));
  } catch (error) {
    console.error("LLM Analyze Error:", error);
    return {
      llm_summary: "",
      llm_skills: [],
      llm_roles: [],
      llm_experience_years: 0,
    };
  }
}

export async function matchResumeWithLLM(
  jobRequirements: string,
  resumeData: unknown
): Promise<ResumeMatchResult> {
  try {
    const content = await callLLM([
      {
        role: "system",
        content:
          "You are an AI resume matching assistant. Evaluate how well a resume matches job requirements and return only valid JSON.",
      },
      {
        role: "user",
        content: `Job Requirements:
${jobRequirements}

Resume:
${JSON.stringify(resumeData)}

Return JSON only:
{
  "match_score": number,
  "matched_skills": string[],
  "missing_skills": string[],
  "match_summary": string
}`,
      },
    ]);

    return JSON.parse(extractJson(content));
  } catch (error) {
    console.error("LLM Match Error:", error);
    return {
      match_score: 0,
      matched_skills: [],
      missing_skills: [],
      match_summary: "Error matching resume",
    };
  }
}
