"use client";

import { useState } from "react";

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/resumes/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
    alert("Resume uploaded!");
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload}>
        Upload Resume
      </button>
    </div>
  );
}