"use client";
import { useState } from "react";

type ResumeMatch = {
  id: string;
  match_score: number;
  match_summary: string;
};

export default function MatchResumes() {
  const [job, setJob] = useState("");
  const [results, setResults] = useState<ResumeMatch[]>([]);
  const [loading, setLoading] = useState(false);

  async function match() {
    setLoading(true);

    try {
      const res = await fetch("/api/resumes/match", {
        method: "POST",
        body: JSON.stringify({ jobRequirements: job }),
      });

      let data: ResumeMatch[] = [];

      try {
        const json = await res.json();
        // Ensure data is array
        if (Array.isArray(json)) {
          data = json;
        } else {
          console.error("Backend returned non-array:", json);
        }
      } catch (err) {
        console.error("JSON parse error:", err);
      }

      setResults(data);
    } catch (err) {
      console.error("Match API error:", err);
      setResults([]);
    }

    setLoading(false);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Match Resumes</h2>

      <textarea
        placeholder="Enter Job Requirements"
        className="border p-3 rounded w-full mb-3"
        rows={4}
        onChange={(e) => setJob(e.target.value)}
      />

      <button
        onClick={match}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Match
      </button>

      {loading && <p className="text-blue-500 mt-3">Matching resumes...</p>}

      <div className="mt-4 space-y-3">
        {Array.isArray(results) && results.length > 0 ? (
          results.map((r) => (
            <div key={r.id} className="border p-3 rounded bg-gray-50">
              <p className="font-bold">Score: {r.match_score}</p>
              <p className="text-sm text-gray-600">{r.match_summary}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No resumes matched yet.</p>
        )}
      </div>
    </div>
  );
}