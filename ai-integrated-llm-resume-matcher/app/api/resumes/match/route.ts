import { NextRequest, NextResponse } from "next/server";
import { getMongoClient, getDbName } from "@/lib/mongo";
import { matchResumeWithLLM } from "@/lib/llmService";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { resumeId, jobDescription } = await req.json();

    if (!resumeId || !jobDescription) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(getDbName());

    const resume = await db.collection("resumes").findOne({
      _id: new ObjectId(resumeId),
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const finalResult = await matchResumeWithLLM(resume.text || "", jobDescription);

    await db.collection("matches").insertOne({
      resumeId: resume._id,
      jobDescription,
      result: finalResult,
      createdAt: new Date(),
    });

    return NextResponse.json(finalResult, { status: 200 });

  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Match failed" },
      { status: 500 }
    );
  }
}
