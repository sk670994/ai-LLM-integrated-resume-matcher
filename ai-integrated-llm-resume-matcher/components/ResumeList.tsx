"use client";
import { useEffect, useState } from "react";

type ResumeItem = {
  _id: string;
  llm_summary: string;
  llm_skills: string[];
  llm_roles: string[];
  llm_experience_years: number;
  createdAt: string | null;
  resume_text_preview: string;
};

export default function ResumeList() {
  const [items, setItems] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadResumes() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/resumes", { cache: "no-store" });
      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text.slice(0, 120)}`);
      }

      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Failed to load resumes.");
        setItems([]);
      } else if (Array.isArray(json)) {
        setItems(json);
      } else {
        setError("Invalid response format.");
        setItems([]);
      }
    } catch (err) {
      console.error("Load resumes error:", err);
      setError("Failed to fetch resumes.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadResumes();
  }, []);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Uploaded Resumes</h2>
        <button
          onClick={loadResumes}
          className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-blue-500">Loading resumes...</p>}
      {!!error && <p className="text-red-600">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500">No resumes uploaded yet.</p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="border rounded p-3 bg-white">
            <p className="text-sm text-gray-500">ID: {item._id}</p>
            {item.createdAt && (
              <p className="text-sm text-gray-500">
                Uploaded: {new Date(item.createdAt).toLocaleString()}
              </p>
            )}
            <p className="mt-1">
              <span className="font-semibold">Summary:</span>{" "}
              {item.llm_summary || "N/A"}
            </p>
            <p className="mt-1">
              <span className="font-semibold">Skills:</span>{" "}
              {item.llm_skills.length > 0 ? item.llm_skills.join(", ") : "N/A"}
            </p>
            <p className="mt-1">
              <span className="font-semibold">Roles:</span>{" "}
              {item.llm_roles.length > 0 ? item.llm_roles.join(", ") : "N/A"}
            </p>
            <p className="mt-1">
              <span className="font-semibold">Experience (years):</span>{" "}
              {item.llm_experience_years}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-semibold">Text Preview:</span>{" "}
              {item.resume_text_preview || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
