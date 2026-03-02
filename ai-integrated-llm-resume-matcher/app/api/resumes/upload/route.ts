import { NextRequest, NextResponse } from "next/server";
import { getMongoClient, getDbName } from "@/lib/mongo";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const parsed = await pdfParse(buffer);
    const extractedText = parsed.text;

    if (!extractedText) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db(getDbName());

    const result = await db.collection("resumes").insertOne({
      fileName: file.name,
      text: extractedText,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Resume uploaded successfully",
      resumeId: result.insertedId,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}