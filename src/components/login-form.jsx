import { useState } from "react";
import PasswordField from "./password-field";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD_LENGTH = 8;

const NO_BACKEND_MESSAGE =
  "Both fields passed validation. This is an interface demo with no " +
  "authentication backend, so nothing was sent and no account was created.";

function validate({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Enter a valid email address, in the form name@domain.com.";
  }

  if (!password) {
    errors.password = "Enter your password.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters. This one has ${password.length}.`;
  }

  return errors;
}

function LoginForm({ onStatus }) {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [validateOnChange, setValidateOnChange] = useState(false);

  const handleChange = (event) => {
    const next = { ...values, [event.target.name]: event.target.value };
    setValues(next);

    if (validateOnChange) {
      setErrors(validate(next));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setValidateOnChange(true);

    const firstInvalid = Object.keys(nextErrors)[0];

    if (firstInvalid) {
      onStatus("");
      const field = document.getElementById(firstInvalid);

      if (field) {
        field.focus();
      }

      return;
    }

    onStatus(NO_BACKEND_MESSAGE);
  };

  return (
    <form className="login-card__form" onSubmit={handleSubmit} noValidate>
      <div className={errors.email ? "field field--invalid" : "field"}>
        <label className="field__label" htmlFor="email">
          Email
        </label>
        <div className="field__control">
          <input
            className="field__input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </div>
        {errors.email && (
          <p className="field__error" id="email-error">
            {errors.email}
          </p>
        )}
      </div>

      <PasswordField
        id="password"
        label="Password"
        value={values.password}
        error={errors.password}
        onChange={handleChange}
      />

      <button className="button button--primary" type="submit">
        Sign in
      </button>
    </form>
  );
}

export default LoginForm;
