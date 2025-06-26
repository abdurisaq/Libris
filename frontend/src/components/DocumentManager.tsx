import { useEffect, useState } from "react";
import { listDocuments, uploadDocument } from "../api/documents";
import type { Document } from "../types/document";


function DocumentManager() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [docContent, setDocContent] = useState<string | null>(null);

  useEffect(() => {
    listDocuments().then(setDocs).catch(console.error);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      await uploadDocument(e.target.files[0]);
      setDocs(await listDocuments());
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSelectDoc = async (doc: { id: number; name: string; path: string; size: number }) => {
    setSelectedDoc(doc.name);
    setDocContent(null);
    try {
      const res = await fetch(`http://localhost:8000/api/documents/${encodeURIComponent(doc.name)}`);
      if (res.ok) {
        setDocContent(await res.text());
      } else {
        setDocContent("Could not fetch document content.");
      }
    } catch {
      setDocContent("Error loading document.");
    }
  };

  const handleQuery = async () => {
    setResponse(null);
    try {
      const res = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, document: selectedDoc }),
      });
      if (res.ok) {
        setResponse(await res.text());
      } else {
        setResponse("Query failed.");
      }
    } catch {
      setResponse("Error sending query.");
    }
  };

  const handleDelete = async (docId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/documents/${docId}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDocs(await listDocuments());
      } else {
        alert("Failed to delete document.");
      }
    } catch {
      alert("Error deleting document.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block font-bold mb-2">Upload Document</label>
        <input type="file" onChange={handleUpload} disabled={uploading} />
        {uploading && <span className="ml-2 text-sm">Uploading...</span>}
      </div>
      <div>
        <label className="block font-bold mb-2">Documents</label>
        <ul className="space-y-1">
          {docs.map((doc) => (
            <li key={doc.id} className="flex justify-between items-center">
              <button
                className={`underline text-blue-600 ${selectedDoc === doc.name ? 'font-bold' : ''}`}
                onClick={() => handleSelectDoc(doc)}
              >
                {doc.name}
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedDoc && (
        <div>
          <div className="font-bold mb-1">Viewing: {selectedDoc}</div>
          <div>{docContent || "Loading..."}</div>
        </div>
      )}
      {response && (
        <div>
          <div className="font-bold mb-1">Response:</div>
          <div>{response}</div>
        </div>
      )}
    </div>
  );
}

export default DocumentManager;
