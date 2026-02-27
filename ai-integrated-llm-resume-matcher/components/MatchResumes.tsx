"use client";
import { useState } from "react";

type ResumeMatch = {
  _id?: string;
  match_score: number;
  match_summary: string;
};

export default function MatchResumes() {
  const [job, setJob] = useState("");
  const [results, setResults] = useState<ResumeMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function match() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/resumes/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobRequirements: job }),
        cache: "no-store",
      });

      let data: ResumeMatch[] = [];
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          const json = await res.json();
          if (!res.ok) {
            setError(json?.error ?? "Match request failed.");
          } else if (Array.isArray(json)) {
            data = json;
          } else {
            setError("Backend returned invalid response format.");
            console.error("Backend returned non-array:", json);
          }
        } catch (err) {
          setError("Failed to parse server response.");
          console.error("JSON parse error:", err);
        }
      } else {
        const text = await res.text();
        setError("Server returned non-JSON response.");
        console.error("Non-JSON response:", text.slice(0, 120));
      }

      setResults(data);
    } catch (err) {
      setError("Failed to fetch. Check server/Ollama connection and try again.");
      console.error("Match API error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
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
      {!!error && <p className="text-red-600 mt-3">{error}</p>}

      <div className="mt-4 space-y-3">
        {Array.isArray(results) && results.length > 0 ? (
          results.map((r) => (
            <div key={r._id} className="border p-3 rounded bg-gray-50">
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
