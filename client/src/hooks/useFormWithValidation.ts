import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type FormValues = Record<string, string>;

export default function useFormWithValidation(initialValues: FormValues) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    const form = event.currentTarget.form;
    const message = event.currentTarget.validationMessage;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: message }));
    setIsValid(form?.checkValidity() ?? false);
  }

  function handleBlur(event: ChangeEvent<HTMLInputElement>) {
    const { name, validationMessage } = event.currentTarget;
    setErrors((previous) => ({
      ...previous,
      [name]: validationMessage,
    }));
  }

  function resetForm(event?: FormEvent<HTMLFormElement>) {
    setValues(initialValues);
    setErrors({});
    setIsValid(false);
    event?.currentTarget.reset();
  }

  return { values, errors, isValid, handleChange, handleBlur, resetForm };
}
