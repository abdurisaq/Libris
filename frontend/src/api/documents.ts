import { apiFetch } from "./client";
import type { Document } from "../types/document";



export async function listDocuments(): Promise<Document[]> {
  const response = (await apiFetch("/api/documents/")) as Document[];
  console.log("Response from listDocuments API:", response);
  return response;
}

export async function uploadDocument(file: File): Promise<void> {
  const form = new FormData();
  form.append("file", file);

  await apiFetch("/api/documents/upload/", {
    method: "POST",
    body: form,
  });
}