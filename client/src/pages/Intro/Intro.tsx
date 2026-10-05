import { useNavigate } from "react-router-dom";
import "./Intro.css";

import dataIcon from "../../assets/iconn.png";
import organizeIcon from "../../assets/Icon (1).png";
import knowledgeIcon from "../../assets/Icon (2).png";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <section className="intro">
      <div className="intro__card">
        <div className="intro__heading">
          <h1 className="intro__title">Welcome to Mesh AI</h1>
          <img className="intro__logo" src="/favicon.png" alt="Mesh AI logo" />
        </div>

        <div className="intro__cards">
          <article className="intro__onboarding-card">
            <img className="intro__icon" src={dataIcon} alt="Document icon" />

            <div className="intro__card-copy">
              <h2>Bring all your documents into one secure AI workspace</h2>
            </div>
          </article>

          <article className="intro__onboarding-card">
            <img
              className="intro__icon"
              src={organizeIcon}
              alt="Organization icon"
            />

            <div className="intro__card-copy">
              <h2>Organize and manage the documents that power your AI</h2>
            </div>
          </article>

          <article className="intro__onboarding-card">
            <img
              className="intro__icon"
              src={knowledgeIcon}
              alt="Knowledge base icon"
            />

            <div className="intro__card-copy">
              <h2>
                Your knowledge base, accessible through a simple chat interface
              </h2>
            </div>
          </article>
        </div>

        <div className="intro__container">
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
        </div>
      </div>
    </section>
  );
}
