import UploadResume from "@/components/UploadResume";
import MatchResumes from "@/components/MatchResumes";
import ResumeList from "@/components/ResumeList";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">LLM Resume Matcher (MongoDB)</h1>
      <UploadResume />
      <MatchResumes />
      <ResumeList />
    </main>
  );
}
