import { NavLink } from "react-router-dom";
import type { SubmitEvent } from "react";
import AuthField from "../../components/AuthField/AuthField";
import useFormWithValidation from "../../hooks/useFormWithValidation";

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "auth-form__tab auth-form__tab_active" : "auth-form__tab";
}

export default function Login() {
  const { values, errors, isValid, handleChange, handleBlur } = useFormWithValidation({ email: "", password: "" });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    // Lesson 2 only: API integration is added in the next lesson.
    console.log("Login form values:", values);
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
            <p className="auth-form__status" role="status" aria-live="polite"></p>
            <button className="auth-form__submit" type="submit" disabled={!isValid}>Log in</button>
          </form>
        </section>
      </main>
    </div>
  );
}
