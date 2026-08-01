import { Component, Suspense, lazy, useEffect, useState } from "react";

const SCENE_URL = "https://prod.spline.design/BedHsbQnoGzxGCVf/scene.splinecode";

/*
 * The Spline runtime is the heaviest thing on the page, so it is split into its
 * own chunk and pulled in after the form is interactive. If the chunk cannot be
 * fetched, the module resolves to a component that renders nothing and the CSS
 * backdrop in layout.css stays visible.
 */
const Spline = lazy(() =>
  import("@splinetool/react-spline").catch(() => ({ default: () => null }))
);

/* Keeps a runtime failure inside the 3D scene from taking down the login form. */
class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function watchReducedMotion(onChange) {
  if (typeof window.matchMedia !== "function") {
    return undefined;
  }

  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handle = () => onChange(query.matches);

  handle();

  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", handle);
    return () => query.removeEventListener("change", handle);
  }

  /* Safari below 14 only implements the deprecated listener API. */
  query.addListener(handle);
  return () => query.removeListener(handle);
}

function SceneBackground() {
  const [showScene, setShowScene] = useState(false);

  useEffect(() => watchReducedMotion((reduced) => setShowScene(!reduced)), []);

  return (
    <div className="page__backdrop" aria-hidden="true">
      {showScene && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <Spline scene={SCENE_URL} />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}

export default SceneBackground;
