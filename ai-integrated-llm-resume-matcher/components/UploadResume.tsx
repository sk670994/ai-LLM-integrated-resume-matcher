"use client";
import { useState } from "react";

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) return setMessage("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Unexpected response: ${text.slice(0, 120)}`);
      }

      const json = await res.json();
      if (res.ok) {
        setMessage(`Upload successful! Resume ID: ${json.id}`);
      } else {
        setMessage(`Upload failed: ${json.error ?? "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload error, check console.");
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept=".pdf,.txt,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Upload Resume
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
