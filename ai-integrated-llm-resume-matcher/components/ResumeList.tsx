"use client";

import { useState } from "react";

export default function UploadResume() {

const [loading, setLoading] = useState(false);

async function upload(e: any) {

setLoading(true);

const formData = new FormData();

formData.append("file", e.target.files[0]);

await fetch("/api/resumes/upload", {

method: "POST",

body: formData

});

setLoading(false);

alert("Uploaded");

}

return (

<div>

<h3>Upload Resume</h3>

<input type="file" onChange={upload} />

{loading && <p>Processing...</p>}

</div>

);

}