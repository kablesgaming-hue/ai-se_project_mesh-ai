type Props = {
  id: string;
  label: string;
  name: string;
  type: "text" | "email" | "password";
  value: string;
  error?: string;
  minLength?: number;
  maxLength?: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.ChangeEventHandler<HTMLInputElement>;
};

export default function AuthField({ id, label, name, type, value, error, minLength, maxLength, onChange, onBlur }: Props) {
  return (
    <div className="auth-form__field">
      <label className="auth-form__label" htmlFor={id}>{label}</label>
      <input
        className={`auth-form__input${error ? " auth-form__input_invalid" : ""}`}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={name === "password" ? "current-password" : name === "name" ? "name" : "email"}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        required
      />
      <span className="auth-form__error" id={`${id}-error`} role={error ? "alert" : undefined}>{error ?? ""}</span>
    </div>
  );
}
