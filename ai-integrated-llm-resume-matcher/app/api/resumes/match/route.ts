import clientPromise from "@/lib/mongo";
import { matchResumeWithLLM } from "@/lib/llmService";
import type { ResumeMatchResult } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { jobRequirements } = await req.json();

    if (!jobRequirements || typeof jobRequirements !== "string") {
      return Response.json(
        { error: "jobRequirements is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("resumeMatcher");
    const resumes = await db.collection("resumes").find().toArray();

    const results: Array<ResumeMatchResult & { _id: string }> = [];

    for (const resume of resumes) {
      const resumeData = {
        resume_text: resume.resume_text ?? resume.text ?? "",
        llm_summary: resume.llm_summary ?? "",
        llm_skills: resume.llm_skills ?? [],
        llm_roles: resume.llm_roles ?? [],
        llm_experience_years: resume.llm_experience_years ?? 0,
      };

      const llmResult = await matchResumeWithLLM(jobRequirements, resumeData);

      results.push({
        _id: resume._id.toString(),
        ...llmResult,
      });
    }

    results.sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0));

    return Response.json(results, { status: 200 });
  } catch (error) {
    console.error("Match route error:", error);
    return Response.json({ error: "Failed to match resumes" }, { status: 500 });
  }
}
