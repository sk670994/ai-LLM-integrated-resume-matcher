"use client";
import { useState } from "react";
import ResumeList from "./ResumeList";

type MatchResult = {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  summary: string;
};

export default function MatchResumes() {
  const [resumeId, setResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);

  async function handleMatch() {
    const res = await fetch("/api/resumes/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, jobDescription }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || "Match failed");
      setResult(null);
      return;
    }
    setResult(data);
  }

  return (
    <div>
      <ResumeList onSelect={setResumeId} />

      <textarea
        className="border p-2 w-full"
        rows={6}
        placeholder="Paste job description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button
        onClick={handleMatch}
        className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
      >
        Match Resume
      </button>

      {result && (
        <div className="mt-4 border p-3 rounded">
          <p>Score: {result.match_score}%</p>
          <p>Matching: {result.matching_skills.join(", ")}</p>
          <p>Missing: {result.missing_skills.join(", ")}</p>
          <p>{result.summary}</p>
        </div>
      )}
    </div>
  );
}
