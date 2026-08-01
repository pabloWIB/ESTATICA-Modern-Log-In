import LoginCard from "./components/login-card";
import SceneBackground from "./components/scene-background";
import SiteFooter from "./components/site-footer";

function App() {
  return (
    <div className="page">
      <SceneBackground />
      <main className="page__main">
        <LoginCard />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
