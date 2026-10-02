import { useNavigate } from "react-router-dom";
import "./Intro.css";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <section className="intro">
      <h1>Welcome to Mesh AI</h1>

      <div className="intro__cards">
        <article className="intro__card">
          <div className="intro__icon">📄</div>
          <h2>Bring your data</h2>
          <p>Upload documents and build your knowledge base.</p>
        </article>

        <article className="intro__card">
          <div className="intro__icon">💬</div>
          <h2>Organize and manage</h2>
          <p>Keep your documents organized and ready to use.</p>
        </article>

        <article className="intro__card">
          <div className="intro__icon">✨</div>
          <h2>Make knowledge useful</h2>
          <p>Ask questions and get answers from your documents.</p>
        </article>
      </div>

      <p className="intro__description">
        Start by creating your organization&apos;s Knowledge Base
      </p>

      <button
        className="intro__button"
        type="button"
        onClick={() => navigate("/knowledge")}
      >
        Start
      </button>
    </section>
  );
}