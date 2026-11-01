import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../utils/api";
import type { SubmitEvent } from "react";
import AuthField from "../../components/AuthField/AuthField";
import useFormWithValidation from "../../hooks/useFormWithValidation";

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "auth-form__tab auth-form__tab_active" : "auth-form__tab";
}

export default function Register() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, errors, isValid, handleChange, handleBlur } = useFormWithValidation({ name: "", email: "", password: "" });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    setStatus("");
    setIsSubmitting(true);
    try {
      const res = await registerUser(values.name, values.email, values.password);
      if (!res.success) throw new Error(res.error?.message || "Registration failed");
      navigate("/login");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Registration failed");
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
        <section className="auth-form" aria-labelledby="register-title">
          <h1 className="auth-form__title" id="register-title">Create your account</h1>
          <p className="auth-form__subtitle">Start organizing your knowledge with Mesh AI</p>
          <nav className="auth-form__tabs" aria-label="Account access">
            <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
            <NavLink to="/register" className={getNavLinkClass}>Register</NavLink>
          </nav>
          <form noValidate onSubmit={handleSubmit} className="auth-form__fields">
            <AuthField id="register-name" label="Name" name="name" type="text" value={values.name} error={errors.name} minLength={2} maxLength={40} onChange={handleChange} onBlur={handleBlur} />
            <AuthField id="register-email" label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={handleChange} onBlur={handleBlur} />
            <AuthField id="register-password" label="Password" name="password" type="password" value={values.password} error={errors.password} minLength={8} onChange={handleChange} onBlur={handleBlur} />
            <p className="auth-form__status" role="status" aria-live="polite">{status}</p>
            <button className="auth-form__submit" type="submit" disabled={!isValid || isSubmitting}>Create account</button>
          </form>
        </section>
      </main>
    </div>
  );
}
