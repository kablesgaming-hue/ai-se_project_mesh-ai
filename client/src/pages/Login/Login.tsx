import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import type { SubmitEvent } from "react";
import AuthField from "../../components/AuthField/AuthField";
import useFormWithValidation from "../../hooks/useFormWithValidation";

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "auth-form__tab auth-form__tab_active" : "auth-form__tab";
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, errors, isValid, handleChange, handleBlur } = useFormWithValidation({ email: "", password: "" });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    setStatus("");
    setIsSubmitting(true);
    try {
      const res = await loginUser(values.email, values.password);
      if (!res.data) throw new Error(res.error?.message || "Login failed");
      login(res.data.token, res.data.user);
      navigate("/knowledge");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-page__header">
        <NavLink to="/" className="auth-page__brand"><span>Mesh AI</span><img src="/favicon.png" alt="MeshAI logo" /></NavLink>
      </header>
      <main className="auth-page__main">
        <section className="auth-form" aria-labelledby="login-title">
          <h1 className="auth-form__title" id="login-title">Welcome back</h1>
          <p className="auth-form__subtitle">Log in to your Mesh AI account</p>
          <nav className="auth-form__tabs" aria-label="Account access">
            <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
            <NavLink to="/register" className={getNavLinkClass}>Register</NavLink>
          </nav>
          <form noValidate onSubmit={handleSubmit} className="auth-form__fields">
            <AuthField id="login-email" label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={handleChange} onBlur={handleBlur} />
            <AuthField id="login-password" label="Password" name="password" type="password" value={values.password} error={errors.password} minLength={8} onChange={handleChange} onBlur={handleBlur} />
            <p className="auth-form__status" role="status" aria-live="polite">{status}</p>
            <button className="auth-form__submit" type="submit" disabled={!isValid || isSubmitting}>Log in</button>
          </form>
        </section>
      </main>
    </div>
  );
}
