"use client";
import { useEffect, useState } from "react";

type Resume = {
  _id: string;
  fileName: string;
};

export default function ResumeList({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => res.json())
      .then(setResumes);
  }, []);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">Select Resume</h2>
      <select
        className="border p-2 w-full"
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">-- Select Resume --</option>
        {resumes.map((resume) => (
          <option key={resume._id} value={resume._id}>
            {resume.fileName}
          </option>
        ))}
      </select>
    </div>
  );
}