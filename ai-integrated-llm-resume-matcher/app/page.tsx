"use client";

import { useEffect, useState } from "react";

type ResumeItem = {
  _id: string;
  fileName: string;
};

type MatchResult = {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  summary: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    const res = await fetch("/api/resumes");
    const data: ResumeItem[] = await res.json();
    setResumes(Array.isArray(data) ? data : []);

    if (Array.isArray(data) && data.length > 0) {
      setSelectedResume(data[0]._id);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file");

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/resumes/upload", {
      method: "POST",
      body: formData,
    });

    setFile(null);
    fetchResumes();
  };

  const handleMatch = async () => {
    if (!selectedResume || !jobDescription) {
      return alert("Select resume and enter job description");
    }

    const res = await fetch("/api/resumes/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId: selectedResume,
        jobDescription,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || "Match failed");
      setResult(null);
      return;
    }
    setResult(data as MatchResult);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">

        <h1 className="text-2xl font-bold mb-6 text-center">
          LLM Resume Matcher 
        </h1>

        {/* Upload Section */}
        <div className="mb-6">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-3"
          />

          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Upload Resume
          </button>
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <textarea
            placeholder="Enter Job Requirements Here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full border p-3 rounded h-40"
          />
        </div>

        {/* Match Button */}
        <button
          onClick={handleMatch}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Match Resume
        </button>

        {/* Match Result */}
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded border">
            <h2 className="text-xl font-semibold mb-2">
              Match Score: {result.match_score}%
            </h2>

            <p className="mb-2">
              <strong>Summary:</strong> {result.summary}
            </p>

            <div>
              <strong>Matching Skills:</strong>
              <ul className="list-disc ml-6">
                {result.matching_skills?.map((skill: string, i: number) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="mt-2">
              <strong>Missing Skills:</strong>
              <ul className="list-disc ml-6 text-red-500">
                {result.missing_skills?.map((skill: string, i: number) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Uploaded Resumes List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">
            Uploaded Resumes
          </h2>

          {resumes.length === 0 && (
            <p className="text-gray-500">No resumes uploaded yet.</p>
          )}

          <ul className="space-y-2">
            {resumes.map((resume: ResumeItem) => (
              <li
                key={resume._id}
                onClick={() => setSelectedResume(resume._id)}
                className={`p-3 border rounded cursor-pointer ${
                  selectedResume === resume._id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white"
                }`}
              >
                {resume.fileName}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
