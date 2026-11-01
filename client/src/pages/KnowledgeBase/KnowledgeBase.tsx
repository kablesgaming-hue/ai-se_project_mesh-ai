import { useEffect, useState } from "react";
import UploadArea from "../../components/UploadArea/UploadArea";
import deleteIcon from "../../assets/delete-icon.png";
import { getDocuments, uploadDocument } from "../../utils/api";
import type { KnowledgeDoc } from "../../utils/api";
import "./KnowledgeBase.css";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res.data || []);
      } catch {
        setError("Failed to load documents.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleFileSelect = async (file: File) => {
    if (isUploading) return;
    setIsUploading(true);
    setError(null);
    try {
      const res = await uploadDocument(file);
      if (res.data) {
        setDocuments((currentDocuments) => [res.data!, ...currentDocuments]);
      } else {
        setError(res.error?.message || "Document upload failed.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Document upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments((currentDocuments) =>
      currentDocuments.filter((doc) => doc._id !== documentId),
    );
  };

  return (
    <div className="knowledge-base">
      <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>

      <section className="knowledge-base__content">
        <div className="knowledge-base__document-upload">
          <div className="knowledge-base__upload-instructions">
            <p className="knowledge-base__upload-label">
              Upload documents (PDF)
            </p>

            <UploadArea onFileSelect={handleFileSelect} isUploading={isUploading} />
          </div>

          {isLoading && (
            <p className="knowledge-base__status">Loading documents...</p>
          )}

          {!isLoading && error && (
            <p className="knowledge-base__status knowledge-base__status_error">
              {error}
            </p>
          )}

          {!isLoading && !error && documents.length === 0 && (
            <p className="knowledge-base__status">No documents yet.</p>
          )}

          {!isLoading && !error && documents.length > 0 && (
            <div className="knowledge-base__documents">
              {documents.map((doc) => (
                <div className="knowledge-base__document" key={doc._id}>
                  <span>{doc.title}</span>

                  <button
                    className="knowledge-base__delete-button"
                    type="button"
                    aria-label={`Delete ${doc.title}`}
                    onClick={() => handleDeleteDocument(doc._id)}
                  >
                    <img src={deleteIcon} alt={`Delete ${doc.title}`} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
