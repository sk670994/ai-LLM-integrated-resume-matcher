import { supabase } from "@/lib/supabase";

import { analyzeResumeWithLLM } from "@/lib/llmService";

export async function POST(req: Request) {

const formData = await req.formData();

const file = formData.get("file") as File;

const text = await file.text();

const structured = await analyzeResumeWithLLM(text);

const { data } = await supabase

.from("resumes")

.insert({

resume_text: text,

llm_summary: structured.summary,

llm_skills: structured.skills,

llm_roles: structured.roles,

llm_experience_years: structured.experience_years

})

.select()

.single();

return Response.json(data);

}