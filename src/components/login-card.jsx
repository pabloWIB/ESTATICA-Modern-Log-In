import { useState } from "react";
import LoginForm from "./login-form";
import SocialSignIn from "./social-sign-in";

function LoginCard() {
  const [status, setStatus] = useState("");

  return (
    <section className="login-card" aria-labelledby="login-title">
      <h1 className="login-card__title" id="login-title">
        Welcome to WIB
      </h1>
      <h2 className="login-card__subtitle">Login</h2>
      <p className="login-card__note">
        Interface demo. The form validates in the browser, but there is no
        authentication backend behind it.
      </p>

      <LoginForm onStatus={setStatus} />

      <p className="divider">Or continue with</p>

      <SocialSignIn onStatus={setStatus} />

      <div aria-live="polite">
        {status && <p className="status">{status}</p>}
      </div>
    </section>
  );
}

export default LoginCard;
