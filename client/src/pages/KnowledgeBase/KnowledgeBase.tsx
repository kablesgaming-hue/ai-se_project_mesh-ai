import { useEffect, useState } from "react";
import UploadArea from "../../components/UploadArea/UploadArea";
import { getDocuments } from "../../utils/api";
import type { KnowledgeDoc } from "../../utils/api";
import "./KnowledgeBase.css";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res.data ?? []);
      } catch {
        setError("Failed to load documents.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleFileSelect = (file: File) => {
    const newDoc: KnowledgeDoc = {
      _id: Date.now().toString(),
      title: file.name,
      fileName: file.name,
      userId: "local",
      createdAt: new Date().toISOString(),
    };

    setDocuments((currentDocuments) => [newDoc, ...currentDocuments]);
  };

  return (
    <div className="knowledge-base">
      <h1>Manage Your Knowledge Base</h1>

      <section className="knowledge-base__content">
        <p>Upload documents (PDF)</p>

        <UploadArea onFileSelect={handleFileSelect} />

        {!isLoading && !error && documents.length > 0 && (
          <div className="knowledge-base__documents">
            {documents.map((doc) => (
              <div className="knowledge-base__document" key={doc._id}>
                <span>{doc.fileName}</span>

                <button
                  className="knowledge-base__delete-button"
                  type="button"
                  aria-label={`Delete ${doc.fileName}`}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="knowledge-base__save-button" type="button">
          Save
        </button>
      </section>
    </div>
  );
}
