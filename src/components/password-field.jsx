import { useState } from "react";
import { ReactComponent as EyeIcon } from "../assets/icons/eye.svg";
import { ReactComponent as EyeOffIcon } from "../assets/icons/eye-off.svg";

function PasswordField({ id, label, value, error, onChange }) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div className={error ? "field field--invalid" : "field"}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control">
        <input
          className="field__input"
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          value={value}
          onChange={onChange}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          className="field__toggle"
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error && (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}

export default PasswordField;
