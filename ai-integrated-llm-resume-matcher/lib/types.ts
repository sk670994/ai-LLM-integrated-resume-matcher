// lib/types.ts
export type LLMResult = {
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

export type ResumeDocument = LLMResult & {
  _id?: string;
  resume_text: string;
};