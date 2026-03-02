// lib/llmService.ts

type MatchResult = {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  summary: string;
};

function extractJson(text: string): string {
  const trimmed = (text || "").trim();
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) {
    return trimmed.slice(first, last + 1);
  }
  return "{}";
}

async function callOllama(prompt: string): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL;

  if (!model) {
    throw new Error("OLLAMA_MODEL is not set");
  }

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: { temperature: 0 },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data?.response || "{}";
}

export async function analyzeResumeWithLLM(prompt: string) {
  const raw = await callOllama(prompt);
  return JSON.parse(extractJson(raw));
}

export async function matchResumeWithLLM(
  resumeText: string,
  jobDescription: string
): Promise<MatchResult> {
  const prompt = `
You are an AI resume matching assistant.
Evaluate how well the resume matches the job description.
Return ONLY valid JSON in this exact shape:
{
  "match_score": number,
  "matching_skills": string[],
  "missing_skills": string[],
  "summary": string
}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;

  try {
    const parsed = await analyzeResumeWithLLM(prompt);
    return {
      match_score: Number(parsed?.match_score) || 0,
      matching_skills: Array.isArray(parsed?.matching_skills)
        ? parsed.matching_skills
        : [],
      missing_skills: Array.isArray(parsed?.missing_skills)
        ? parsed.missing_skills
        : [],
      summary: typeof parsed?.summary === "string" ? parsed.summary : "",
    };
  } catch (error) {
    console.error("LLM match parse error:", error);
    return {
      match_score: 0,
      matching_skills: [],
      missing_skills: [],
      summary: "Matching failed",
    };
  }
}
