import UploadResume from "@/components/UploadResume";
import MatchResumes from "@/components/MatchResumes";

export default function Home() {

return (

<div className="min-h-screen bg-gray-100 p-6">

<div className="max-w-4xl mx-auto">

<h1 className="text-3xl font-bold text-center mb-6">

AI Resume Matcher

</h1>

<div className="grid gap-6">

<div className="bg-white p-6 rounded-lg shadow">

<UploadResume />

</div>

<div className="bg-white p-6 rounded-lg shadow">

<MatchResumes />

</div>

</div>

</div>

</div>

);

}