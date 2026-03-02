import { NextResponse } from "next/server";
import { getMongoClient, getDbName } from "@/lib/mongo";

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db(getDbName());

    const resumes = await db
      .collection("resumes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(resumes);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
