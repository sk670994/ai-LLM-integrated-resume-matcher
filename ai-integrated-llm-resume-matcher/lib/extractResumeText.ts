export async function extractResumeText(file: File): Promise<string> {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith(".txt")) {
    return (await file.text()).trim();
  }

  if (lowerName.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({
      buffer: Buffer.from(arrayBuffer),
    });

    return result.value.trim();
  }

  if (lowerName.endsWith(".pdf")) {
    const pdf = (await import("pdf-parse")).default;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await pdf(buffer);

    if (!result.text?.trim()) {
      throw new Error("PDF text extraction returned empty content");
    }

    return result.text.trim();
  }

  throw new Error("Unsupported file type.");
}