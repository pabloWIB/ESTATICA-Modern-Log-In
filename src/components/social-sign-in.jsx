import facebookIcon from "../assets/icons/facebook.svg";
import githubIcon from "../assets/icons/github.svg";
import googleIcon from "../assets/icons/google.svg";

const PROVIDERS = [
  { id: "google", name: "Google", icon: googleIcon },
  { id: "facebook", name: "Facebook", icon: facebookIcon },
  { id: "github", name: "GitHub", icon: githubIcon },
];

function SocialSignIn({ onStatus }) {
  return (
    <ul className="social">
      {PROVIDERS.map((provider) => (
        <li className="social__item" key={provider.id}>
          <button
            className="social__button"
            type="button"
            aria-label={`Continue with ${provider.name}`}
            onClick={() =>
              onStatus(
                `${provider.name} sign-in is not wired up in this demo: no OAuth provider is configured.`
              )
            }
          >
            <img src={provider.icon} alt="" width="24" height="24" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default SocialSignIn;
