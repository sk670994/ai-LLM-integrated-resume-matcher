"use client";

import { useState } from "react";

export default function UploadResume() {

const [loading, setLoading] = useState(false);

async function upload(
e: React.ChangeEvent<HTMLInputElement>
) {

if (!e.target.files?.[0]) return;

setLoading(true);

const formData = new FormData();

formData.append("file", e.target.files[0]);

await fetch("/api/resumes/upload", {

method: "POST",

body: formData

});

setLoading(false);

alert("Resume Uploaded");

}

return (

<div>

<h2 className="text-xl font-semibold mb-4">

Upload Resume

</h2>

<input

type="file"

onChange={upload}

className="border p-2 rounded w-full"

/>

{loading && (

<p className="text-blue-500 mt-2">

Processing resume...

</p>

)}

</div>

);

}