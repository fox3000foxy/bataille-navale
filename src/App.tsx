import { useState, useEffect, useRef } from "react";
import "./index.css";
import logo from "./logo.svg";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { Developer } from "./pages/Developer";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { Submit } from "./pages/Submit";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

type Page = "home" | "developer" | "terms" | "privacy" | "submit" | "login" | "register";

function pathToPage(path: string): Page {
  switch (path) {
    case "/developer": return "developer";
    case "/terms": return "terms";
    case "/privacy": return "privacy";
    case "/submit": return "submit";
    case "/login": return "login";
    case "/register": return "register";
    default: return "home";
  }
}

function pageToPath(page: Page): string {
  switch (page) {
    case "developer": return "/developer";
    case "terms": return "/terms";
    case "privacy": return "/privacy";
    case "submit": return "/submit";
    case "login": return "/login";
    case "register": return "/register";
    default: return "/";
  }
}

function navigate(page: Page) {
  const url = pageToPath(page);
  window.history.pushState({}, "", url);
  window.dispatchEvent(new Event("popstate"));
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) { return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setVisible(true); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function Nav({ current, onNavigate }: { current: Page; onNavigate: (page: Page) => void }) {
  const { user, loading, logout } = useAuth();
  const links: { label: string; page: Page }[] = [
    { label: "Developer", page: "developer" },
    { label: "Terms", page: "terms" },
    { label: "Privacy", page: "privacy" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0d0d14]/80 backdrop-blur-xl border-b border-[#fbf0df]/5">
      <button type="button" onClick={() => onNavigate("home")} className="flex items-center gap-3 text-lg font-bold text-[#fbf0df] no-underline bg-transparent border-0 cursor-pointer">
        <img src={logo} alt="" className="h-8" />
        NavalCode
      </button>
      <div className="flex items-center gap-8 text-sm">
        {links.map(({ label, page }) => (
          <button type="button"
            key={page}
            onClick={() => onNavigate(page)}
            className={`relative bg-transparent border-0 cursor-pointer transition-colors no-underline pb-1 ${
              current === page
                ? "text-[#fbf0df] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#00d4ff] after:to-[#7c3aed] after:rounded-full"
                : "text-[#fbf0df]/60 hover:text-[#fbf0df]"
            }`}
          >
            {label}
          </button>
        ))}
        {loading ? null : user ? (
          <div className="flex items-center gap-4">
            <span className="text-[#fbf0df]/80">{user.username}</span>
            <button type="button" onClick={() => { logout().then(() => onNavigate("home")).catch(() => {}); }}
              className="text-[#fbf0df]/50 hover:text-[#fbf0df] bg-transparent border-0 cursor-pointer transition-colors"
            >
              Déconnexion
            </button>
            <button type="button" onClick={() => onNavigate("submit")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-semibold no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary"
            >
              Submit a robot
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onNavigate("login")}
              className="text-[#fbf0df]/70 hover:text-[#fbf0df] bg-transparent border-0 cursor-pointer transition-colors"
            >
              Connexion
            </button>
            <button type="button" onClick={() => onNavigate("register")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-semibold no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary"
            >
              S'inscrire
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-24 text-center overflow-hidden">
      <div className="glow-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <img src={logo} alt="" className="h-32 mb-8 opacity-90 animate-[float_6s_ease-in-out_infinite]" />
      <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-tight text-gradient">
        NavalCode
      </h1>
      <p className="text-xl text-[#fbf0df]/60 max-w-2xl mb-10 leading-relaxed">
        La plateforme où les développeurs confrontent leurs robots intelligents.
        Codez votre stratégie, participez aux événements hebdomadaires,
        et faites gagner votre bot.
      </p>
      <div className="flex items-center gap-4">
        <button type="button"
          onClick={() => onNavigate("developer")}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-lg no-underline hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all hover:-translate-y-0.5 cursor-pointer border-0 btn-primary"
        >
          Start coding
        </button>
        <button type="button"
          onClick={() => onNavigate("submit")}
          className="px-8 py-3 rounded-xl border border-[#fbf0df]/20 text-[#fbf0df] font-bold text-lg no-underline hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-all cursor-pointer bg-transparent"
        >
          Submit my robot
        </button>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: "42+", label: "Bots soumis" },
    { value: "128+", label: "Développeurs" },
    { value: "16", label: "Compétitions" },
    { value: "2500", label: "Prix distribués" },
  ];

  return (
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.label} className="text-center p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
            <div className="text-3xl md:text-4xl font-bold text-[#00d4ff] mb-1">{item.value}</div>
            <div className="text-sm text-[#fbf0df]/40 uppercase tracking-wider">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: "🛡️", title: "Exécution sandboxée", desc: "Chaque robot tourne dans un environnement isolé. Aucun import externe, aucun accès système." },
    { icon: "📦", title: "SDK TypeScript", desc: "Un SDK complet avec les classes Board, Strategy, Brain. Étendez Brain et implémentez votre stratégie." },
    { icon: "🏆", title: "Compétitions hebdomadaires", desc: "Nouveaux événements chaque weekend. Soumettez votre robot avant le vendredi minuit UTC." },
    { icon: "🤖", title: "Bots de référence", desc: "Trois robots de référence fournis : Random, SmartBot et StrategicBot." },
    { icon: "💰", title: "Système de paris", desc: "Pariez sur vos robots favoris. 75% reversé aux parieurs, 20% au développeur gagnant." },
    { icon: "📊", title: "Fair-play garanti", desc: "Validation automatique (tsc -b, biome check). Des règles claires pour tous." },
  ];

  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <h2 className="section-title"><span>Pourquoi NavalCode ?</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <RevealSection key={item.title}>
            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover h-full">
              <span className="text-2xl block mb-3">{item.icon}</span>
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">{item.title}</h3>
              <p className="text-[#fbf0df]/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </RevealSection>
        ))}
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
      <h2 className="section-title"><span>How it works</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <RevealSection key={step.num}>
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
              <span className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#7c3aed]/20 border border-[#00d4ff]/20 text-xl font-bold text-[#00d4ff] mb-5">
                {step.num}
              </span>
              <h3 className="text-xl font-bold text-[#fbf0df] mb-3">{step.title}</h3>
              <p className="text-[#fbf0df]/50 leading-relaxed text-sm">{step.desc}</p>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

function RevenueSplit() {
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <h2 className="section-title"><span>Revenue split</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RevealSection>
          <div className="p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 text-center card-hover">
            <div className="text-5xl font-bold text-[#00d4ff] mb-2">75%</div>
            <div className="text-sm uppercase tracking-widest text-[#fbf0df]/30 mb-3">Bettors</div>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed">Distributed proportionally based on each bettor share of the final pool.</p>
          </div>
        </RevealSection>
        <RevealSection>
          <div className="p-8 rounded-2xl bg-[#16161f] border-2 border-[#00d4ff]/20 text-center relative animate-[pulse-glow_3s_ease-in-out_infinite]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white text-xs font-bold uppercase tracking-wider">Winner</div>
            <div className="text-5xl font-bold text-[#fbf0df] mb-2 mt-2">20%</div>
            <div className="text-sm uppercase tracking-widest text-[#fbf0df]/30 mb-3">Bot developer</div>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed">Reward for the developer of the winning robot.</p>
          </div>
        </RevealSection>
        <RevealSection>
          <div className="p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 text-center card-hover">
            <div className="text-5xl font-bold text-[#00d4ff] mb-2">5%</div>
            <div className="text-sm uppercase tracking-widest text-[#fbf0df]/30 mb-3">Maintenance</div>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed">Platform operating and maintenance fees.</p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    { q: "Comment soumettre un robot ?", a: "Développez votre robot en étendant la classe Brain, validez-le avec tsc -b et biome check, puis soumettez votre fichier .ts via le formulaire de soumission avant le vendredi minuit UTC." },
    { q: "Quels sont les prérequis techniques ?", a: "Un seul fichier .ts, sans imports externes. Le code doit passer tsc -b et biome check sans erreur." },
    { q: "Comment fonctionnent les paris ?", a: "Pariez sur les robots participants avant le début de l'événement. 75% pour les parieurs, 20% pour le développeur gagnant, 5% pour la plateforme." },
    { q: "Quand ont lieu les événements ?", a: "Les soumissions sont ouvertes du lundi au vendredi. Les événements se déroulent chaque weekend." },
    { q: "Mon code est-il protégé ?", a: "Oui. Seuls les robots du top 3 peuvent être rendus publics après l'événement, sauf opposition de votre part." },
    { q: "Puis-je soumettre plusieurs robots ?", a: "Oui, mais un seul robot par développeur est autorisé par événement." },
  ];

  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <h2 className="section-title"><span>Questions fréquentes</span></h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.q} className="rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 overflow-hidden">
            <button type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left bg-transparent border-0 cursor-pointer text-[#fbf0df] font-semibold text-sm hover:bg-[#1a1a28] transition-colors"
            >
              {item.q}
              <span className={`text-[#00d4ff] transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}>▼</span>
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${openIndex === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
              <p className="px-6 pb-4 text-[#fbf0df]/50 text-sm leading-relaxed">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <section className="px-6 py-24 text-center">
      <RevealSection>
        <div className="max-w-3xl mx-auto p-12 md:p-16 rounded-3xl bg-[#16161f] border border-[#fbf0df]/5 relative overflow-hidden">
          <div className="glow-orb -top-40 -right-40 opacity-70" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#fbf0df] mb-4 relative">Ready for the challenge?</h2>
          <p className="text-[#fbf0df]/50 mb-10 max-w-xl mx-auto leading-relaxed relative">
            Download the SDK, follow the validation rules, and submit your robot for the next weekly event.
          </p>
          <div className="flex items-center justify-center gap-4 relative">
            <button type="button" onClick={() => onNavigate("developer")}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold no-underline hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary"
            >SDK documentation</button>
            <button type="button" onClick={() => onNavigate("submit")}
              className="px-8 py-3 rounded-xl border border-[#fbf0df]/20 text-[#fbf0df] font-bold no-underline hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-all cursor-pointer bg-transparent"
            >Submit</button>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <footer className="px-8 py-16 border-t border-[#fbf0df]/5">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-[#fbf0df] mb-3">
            <img src={logo} alt="" className="h-6" />
            NavalCode
          </div>
          <p className="text-[#fbf0df]/40 text-sm leading-relaxed">AI robot competition platform. Code, compete, and earn.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#fbf0df] mb-3 uppercase tracking-wider">Platform</h4>
          <div className="flex flex-col gap-2 text-sm">
            <button type="button" onClick={() => onNavigate("developer")} className="text-[#fbf0df]/40 hover:text-[#00d4ff] transition-colors text-left bg-transparent border-0 cursor-pointer">Developer</button>
            <button type="button" onClick={() => onNavigate("submit")} className="text-[#fbf0df]/40 hover:text-[#00d4ff] transition-colors text-left bg-transparent border-0 cursor-pointer">Submit</button>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#fbf0df] mb-3 uppercase tracking-wider">Legal</h4>
          <div className="flex flex-col gap-2 text-sm">
            <button type="button" onClick={() => onNavigate("terms")} className="text-[#fbf0df]/40 hover:text-[#00d4ff] transition-colors text-left bg-transparent border-0 cursor-pointer">Terms of service</button>
            <button type="button" onClick={() => onNavigate("privacy")} className="text-[#fbf0df]/40 hover:text-[#00d4ff] transition-colors text-left bg-transparent border-0 cursor-pointer">Privacy policy</button>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-[#fbf0df]/30 pt-8 border-t border-[#fbf0df]/5">NavalCode -- AI robot competition</div>
    </footer>
  );
}

function AppContent() {
  const [page, setPage] = useState<Page>(() => pathToPage(window.location.pathname));
  const { loading } = useAuth();

  useEffect(() => {
    const onPop = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleNavigate = (p: Page) => {
    navigate(p);
    setPage(p);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#fbf0df]/40">Chargement...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "developer": return <Developer />;
      case "terms": return <Terms />;
      case "privacy": return <Privacy />;
      case "submit": return <Submit />;
      case "login": return <Login onNavigate={handleNavigate} />;
      case "register": return <Register onNavigate={handleNavigate} />;
      default:
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <Stats />
            <HowItWorks />
            <Features />
            <RevenueSplit />
            <FAQ />
            <CTA onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
    <div className="relative z-10">
      <div className="grid-bg" />
      <Nav current={page} onNavigate={handleNavigate} />
      {renderPage()}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
