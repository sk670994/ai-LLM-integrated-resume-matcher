import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeWithLLM, type LLMAnalysisResult } from "@/lib/llmService";
import clientPromise from "@/lib/mongo";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get("file") as File;

    if (!resumeFile)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const resumeText = await resumeFile.text();

    // Analyze resume with Gemini LLM
    const llmResult: LLMAnalysisResult = await analyzeResumeWithLLM(resumeText);

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db("resumeMatcher");
    const resumesCollection = db.collection("resumes");

    const inserted = await resumesCollection.insertOne({
      resume_text: resumeText,
      llm_summary: llmResult.llm_summary,
      llm_skills: llmResult.llm_skills,
      llm_roles: llmResult.llm_roles,
      llm_experience_years: llmResult.llm_experience_years,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Resume uploaded and analyzed successfully",
      id: inserted.insertedId,
      llmResult,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 });
  }
}
