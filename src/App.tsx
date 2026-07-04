import { useState, useEffect } from "react";
import "./index.css";
import logo from "./logo.svg";
import { Developer } from "./pages/Developer";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { Submit } from "./pages/Submit";

type Page = "home" | "developer" | "terms" | "privacy" | "submit";

function pathToPage(path: string): Page {
  switch (path) {
    case "/developer": return "developer";
    case "/terms": return "terms";
    case "/privacy": return "privacy";
    case "/submit": return "submit";
    default: return "home";
  }
}

function pageToPath(page: Page): string {
  switch (page) {
    case "developer": return "/developer";
    case "terms": return "/terms";
    case "privacy": return "/privacy";
    case "submit": return "/submit";
    default: return "/";
  }
}

function navigate(page: Page) {
  const url = pageToPath(page);
  window.history.pushState({}, "", url);
  window.dispatchEvent(new Event("popstate"));
}

function Nav({ current }: { current: Page }) {
  const links: { label: string; page: Page }[] = [
    { label: "Developer", page: "developer" },
    { label: "Terms", page: "terms" },
    { label: "Privacy", page: "privacy" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#242424]/80 backdrop-blur-sm border-b border-[#fbf0df]/10">
      <button type="button" onClick={() => navigate("home")} className="flex items-center gap-3 text-lg font-bold text-[#fbf0df] no-underline bg-transparent border-0 cursor-pointer">
        <img src={logo} alt="" className="h-8" />
        NavalCode
      </button>
      <div className="flex items-center gap-6 text-sm">
        {links.map(({ label, page }) => (
          <button type="button"
            key={page}
            onClick={() => navigate(page)}
            className={`bg-transparent border-0 cursor-pointer transition-colors no-underline ${
              current === page ? "text-[#fbf0df]" : "text-[#fbf0df]/70 hover:text-[#fbf0df]"
            }`}
          >
            {label}
          </button>
        ))}
        <button type="button"
          onClick={() => navigate("submit")}
          className="px-4 py-2 rounded-lg bg-[#fbf0df] text-[#1a1a1a] font-bold no-underline hover:bg-[#f3d5a3] transition-colors cursor-pointer border-0"
        >
          Submit a robot
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 pt-24 text-center">
      <img src={logo} alt="" className="h-28 mb-8 opacity-80" />
      <h1 className="text-6xl font-bold text-[#fbf0df] mb-4 tracking-tight">
        NavalCode
      </h1>
      <p className="text-xl text-[#fbf0df]/60 max-w-2xl mb-8 leading-relaxed">
        La plateforme où les développeurs confrontent leurs robots intelligents.
        Codez votre stratégie, participez aux événements hebdomadaires,
        et faites gagner votre bot.
      </p>
      <div className="flex items-center gap-4">
        <button type="button"
          onClick={() => navigate("developer")}
          className="px-8 py-3 rounded-xl bg-[#fbf0df] text-[#1a1a1a] font-bold text-lg no-underline hover:bg-[#f3d5a3] transition-all hover:-translate-y-0.5 cursor-pointer border-0"
        >
          Start coding
        </button>
        <button type="button"
          onClick={() => navigate("submit")}
          className="px-8 py-3 rounded-xl border-2 border-[#fbf0df]/30 text-[#fbf0df] font-bold text-lg no-underline hover:border-[#fbf0df]/60 transition-all cursor-pointer bg-transparent"
        >
          Submit my robot
        </button>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Code your robot",
      desc: "Use our SDK to build your AI in TypeScript. Implement the think() and turn() methods to define your strategy.",
    },
    {
      num: "2",
      title: "Join weekly events",
      desc: "A new event runs every weekend. Submit your robot before Friday midnight to participate.",
    },
    {
      num: "3",
      title: "Win and earn",
      desc: "The best robots compete. Winning developers and bettors share the prize pool.",
    },
  ];

  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-[#fbf0df] text-center mb-16">
        How it works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex flex-col items-center text-center p-8 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10"
          >
            <span className="text-4xl font-bold text-[#fbf0df] mb-4">{step.num}</span>
            <h3 className="text-xl font-bold text-[#fbf0df] mb-3">{step.title}</h3>
            <p className="text-[#fbf0df]/60 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RevenueSplit() {
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-[#fbf0df] text-center mb-16">
        Revenue split
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10 text-center">
          <div className="text-5xl font-bold text-[#fbf0df] mb-2">75%</div>
          <div className="text-sm uppercase tracking-widest text-[#fbf0df]/40 mb-3">Bettors</div>
          <p className="text-[#fbf0df]/60 text-sm leading-relaxed">
            Distributed proportionally based on each bettor share of the final pool.
          </p>
        </div>
        <div className="p-8 rounded-2xl bg-[#1a1a1a] border-2 border-[#fbf0df]/20 text-center relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#fbf0df] text-[#1a1a1a] text-xs font-bold uppercase tracking-wider">
            Winner
          </div>
          <div className="text-5xl font-bold text-[#fbf0df] mb-2 mt-2">20%</div>
          <div className="text-sm uppercase tracking-widest text-[#fbf0df]/40 mb-3">Bot developer</div>
          <p className="text-[#fbf0df]/60 text-sm leading-relaxed">
            Reward for the developer of the winning robot.
          </p>
        </div>
        <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#fbf0df]/10 text-center">
          <div className="text-5xl font-bold text-[#fbf0df] mb-2">5%</div>
          <div className="text-sm uppercase tracking-widest text-[#fbf0df]/40 mb-3">Maintenance</div>
          <p className="text-[#fbf0df]/60 text-sm leading-relaxed">
            Platform operating and maintenance fees.
          </p>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-6 py-24 text-center">
      <div className="max-w-3xl mx-auto p-12 rounded-3xl bg-[#1a1a1a] border border-[#fbf0df]/10">
        <h2 className="text-3xl font-bold text-[#fbf0df] mb-4">
          Ready for the challenge?
        </h2>
        <p className="text-[#fbf0df]/60 mb-8 max-w-xl mx-auto leading-relaxed">
          Download the SDK, follow the validation rules, and submit your robot
          for the next weekly event.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button type="button"
            onClick={() => navigate("developer")}
            className="px-8 py-3 rounded-xl bg-[#fbf0df] text-[#1a1a1a] font-bold no-underline hover:bg-[#f3d5a3] transition-all cursor-pointer border-0"
          >
            SDK documentation
          </button>
          <button type="button"
            onClick={() => navigate("submit")}
            className="px-8 py-3 rounded-xl border-2 border-[#fbf0df]/30 text-[#fbf0df] font-bold no-underline hover:border-[#fbf0df]/60 transition-all cursor-pointer bg-transparent"
          >
            Submit
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-8 py-12 border-t border-[#fbf0df]/10 text-center text-sm text-[#fbf0df]/40">
      <div className="flex items-center justify-center gap-6 mb-4">
        <button type="button" onClick={() => navigate("terms")} className="hover:text-[#fbf0df]/60 transition-colors bg-transparent border-0 cursor-pointer">
          Terms of service
        </button>
        <button type="button" onClick={() => navigate("privacy")} className="hover:text-[#fbf0df]/60 transition-colors bg-transparent border-0 cursor-pointer">
          Privacy policy
        </button>
        <button type="button" onClick={() => navigate("developer")} className="hover:text-[#fbf0df]/60 transition-colors bg-transparent border-0 cursor-pointer">
          Developer
        </button>
      </div>
      <p>NavalCode -- AI robot competition</p>
    </footer>
  );
}

export function App() {
  const [page, setPage] = useState<Page>(() => pathToPage(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "developer": return <Developer />;
      case "terms": return <Terms />;
      case "privacy": return <Privacy />;
      case "submit": return <Submit />;
      default:
        return (
          <>
            <Hero />
            <HowItWorks />
            <RevenueSplit />
            <CTA />
          </>
        );
    }
  };

  return (
    <div className="relative z-10">
      <Nav current={page} />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;
