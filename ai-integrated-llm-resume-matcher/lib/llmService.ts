import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({

model: "gemini-2.5-flash-lite",

});

export async function analyzeResumeWithLLM(resumeText: string) {

const prompt = `

Extract structured info from resume.

Return JSON:

{
"summary":"",
"skills":[],
"roles":[],
"experience_years":0
}

Resume:
${resumeText}

`;

const result = await model.generateContent(prompt);

const text = result.response.text();

return JSON.parse(text);

}



export async function matchResumeWithLLM(

jobRequirements: string,

resumeData: string

) {

const prompt = `

Evaluate resume match.

Job Requirements:
${jobRequirements}

Resume:
${resumeData}

Return JSON:

{
"match_score":0,
"matched_skills":[],
"missing_skills":[],
"match_summary":""
}

`;

const result = await model.generateContent(prompt);

const text = result.response.text();

return JSON.parse(text);

}