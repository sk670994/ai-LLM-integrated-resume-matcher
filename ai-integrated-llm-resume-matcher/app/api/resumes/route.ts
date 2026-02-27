import clientPromise from "@/lib/mongo";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("resumeMatcher");
    const resumes = await db
      .collection("resumes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const payload = resumes.map((resume) => ({
      _id: resume._id.toString(),
      llm_summary: resume.llm_summary ?? "",
      llm_skills: resume.llm_skills ?? [],
      llm_roles: resume.llm_roles ?? [],
      llm_experience_years: resume.llm_experience_years ?? 0,
      createdAt: resume.createdAt ?? null,
      resume_text_preview: (resume.resume_text ?? resume.text ?? "").slice(0, 220),
    }));

    return Response.json(payload, { status: 200 });
  } catch (error) {
    console.error("List resumes error:", error);
    return Response.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}
