import { useState, useEffect, useRef } from "react";
import "./index.css";
import logo from "./logo.svg";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { I18nProvider, useI18n } from "./i18n/I18nContext";
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
  const { t, toggleLang } = useI18n();
  const links: { label: string; page: Page }[] = [
    { label: t("nav.developer"), page: "developer" },
    { label: t("nav.terms"), page: "terms" },
    { label: t("nav.privacy"), page: "privacy" },
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
        <button type="button" onClick={toggleLang}
          className="text-[#fbf0df]/40 hover:text-[#00d4ff] transition-colors bg-transparent border-0 cursor-pointer text-xs font-mono"
        >
          {t("nav.lang")}
        </button>
        {loading ? null : user ? (
          <div className="flex items-center gap-4">
            <span className="text-[#fbf0df]/80">{user.username}</span>
            <button type="button" onClick={() => { logout().then(() => onNavigate("home")).catch(() => {}); }}
              className="text-[#fbf0df]/50 hover:text-[#fbf0df] bg-transparent border-0 cursor-pointer transition-colors"
            >
              {t("nav.logout")}
            </button>
            <button type="button" onClick={() => onNavigate("submit")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-semibold no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary"
            >
              {t("nav.submitRobot")}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onNavigate("login")}
              className="text-[#fbf0df]/70 hover:text-[#fbf0df] bg-transparent border-0 cursor-pointer transition-colors"
            >
              {t("nav.login")}
            </button>
            <button type="button" onClick={() => onNavigate("register")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-semibold no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary"
            >
              {t("nav.register")}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useI18n();
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-24 text-center overflow-hidden">
      <div className="glow-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <img src={logo} alt="" className="h-32 mb-8 opacity-90 animate-[float_6s_ease-in-out_infinite]" />
      <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-tight text-gradient">
        NavalCode
      </h1>
      <p className="text-xl text-[#fbf0df]/60 max-w-2xl mb-10 leading-relaxed">
        {t("hero.subtitle1")}<br />
        {t("hero.subtitle2")}<br />
        {t("hero.subtitle3")}
      </p>
      <div className="flex items-center gap-4">
        <button type="button"
          onClick={() => onNavigate("developer")}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-lg no-underline hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all hover:-translate-y-0.5 cursor-pointer border-0 btn-primary"
        >
          {t("hero.startCoding")}
        </button>
        <button type="button"
          onClick={() => onNavigate("submit")}
          className="px-8 py-3 rounded-xl border border-[#fbf0df]/20 text-[#fbf0df] font-bold text-lg no-underline hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-all cursor-pointer bg-transparent"
        >
          {t("hero.submitRobot")}
        </button>
      </div>
    </section>
  );
}

function Stats() {
  const { t } = useI18n();
  const items = [
    { value: "42+", label: t("stats.bots") },
    { value: "128+", label: t("stats.developers") },
    { value: "16", label: t("stats.competitions") },
    { value: "2500", label: t("stats.prizes") },
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

function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    {
      num: "1",
      title: t("howItWorks.step1.title"),
      desc: t("howItWorks.step1.desc"),
    },
    {
      num: "2",
      title: t("howItWorks.step2.title"),
      desc: t("howItWorks.step2.desc"),
    },
    {
      num: "3",
      title: t("howItWorks.step3.title"),
      desc: t("howItWorks.step3.desc"),
    },
  ];

  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <h2 className="section-title"><span>{t("howItWorks.title")}</span></h2>
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

function IconSandbox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#00d4ff]" role="img" aria-label="shiel">
      <path d="M12 3L3 7.5v9L12 21l9-4.5v-9L12 3z"/><path d="M12 12l-4.5-2.25M12 12v6M12 12l4.5-2.25"/><path d="M7.5 9.75L12 12l4.5-2.25"/>
    </svg>
  );
}
function IconSDK() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#00d4ff]" role="img" aria-label="code">
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/><path d="M14 4l-4 16"/>
    </svg>
  );
}
function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#00d4ff]" role="img" aria-label="trophy">
      <path d="M6 4h12v4a6 6 0 01-12 0V4z"/><path d="M8 16h8v4H8z"/><path d="M12 14v2"/><path d="M4 8a2 2 0 012-2M20 8a2 2 0 00-2-2"/>
    </svg>
  );
}
function IconBot() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#00d4ff]" role="img" aria-label="robot">
      <rect x="4" y="6" width="16" height="12" rx="2"/><path d="M9 10h.01M15 10h.01"/><path d="M12 14c1.5 0 3-1 3-2H9c0 1 1.5 2 3 2z"/><path d="M8 4l2 2M16 4l-2 2"/>
    </svg>
  );
}
function IconBetting() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#00d4ff]" role="img" aria-label="coin">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 10l3-3 3 3"/>
    </svg>
  );
}
function IconFairplay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#00d4ff]" role="img" aria-label="check">
      <path d="M9 12l2 2 4-4"/><path d="M12 3a9 9 0 100 18 9 9 0 000-18z"/>
    </svg>
  );
}

function Features() {
  const { t } = useI18n();
  const items = [
    { icon: <IconSandbox />, title: t("features.sandbox.title"), desc: t("features.sandbox.desc") },
    { icon: <IconSDK />, title: t("features.sdk.title"), desc: t("features.sdk.desc") },
    { icon: <IconTrophy />, title: t("features.competitions.title"), desc: t("features.competitions.desc") },
    { icon: <IconBot />, title: t("features.bots.title"), desc: t("features.bots.desc") },
    { icon: <IconBetting />, title: t("features.betting.title"), desc: t("features.betting.desc") },
    { icon: <IconFairplay />, title: t("features.fairplay.title"), desc: t("features.fairplay.desc") },
  ];

  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <h2 className="section-title"><span>{t("features.title")}</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <RevealSection key={item.title}>
            <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover h-full">
              <div className="mb-3">{item.icon}</div>
              <h3 className="text-lg font-bold text-[#fbf0df] mb-2">{item.title}</h3>
              <p className="text-[#fbf0df]/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}

function RevenueSplit() {
  const { t } = useI18n();
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <h2 className="section-title"><span>{t("revenue.title")}</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RevealSection>
          <div className="p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 text-center card-hover">
            <div className="text-5xl font-bold text-[#00d4ff] mb-2">75%</div>
            <div className="text-sm uppercase tracking-widest text-[#fbf0df]/30 mb-3">{t("revenue.bettors.label")}</div>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed">{t("revenue.bettors.desc")}</p>
          </div>
        </RevealSection>
        <RevealSection>
          <div className="p-8 rounded-2xl bg-[#16161f] border-2 border-[#00d4ff]/20 text-center relative animate-[pulse-glow_3s_ease-in-out_infinite]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white text-xs font-bold uppercase tracking-wider">{t("revenue.winner.label")}</div>
            <div className="text-5xl font-bold text-[#fbf0df] mb-2 mt-2">20%</div>
            <div className="text-sm uppercase tracking-widest text-[#fbf0df]/30 mb-3">{t("revenue.winner.title")}</div>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed">{t("revenue.winner.desc")}</p>
          </div>
        </RevealSection>
        <RevealSection>
          <div className="p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 text-center card-hover">
            <div className="text-5xl font-bold text-[#00d4ff] mb-2">5%</div>
            <div className="text-sm uppercase tracking-widest text-[#fbf0df]/30 mb-3">{t("revenue.maintenance.label")}</div>
            <p className="text-[#fbf0df]/50 text-sm leading-relaxed">{t("revenue.maintenance.desc")}</p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useI18n();

  const items = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
  ];

  return (
    <section className="px-6 py-24 max-w-3xl mx-auto">
      <h2 className="section-title"><span>{t("faq.title")}</span></h2>
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
  const { t } = useI18n();
  return (
    <section className="px-6 py-24 text-center">
      <RevealSection>
        <div className="max-w-3xl mx-auto p-12 md:p-16 rounded-3xl bg-[#16161f] border border-[#fbf0df]/5 relative overflow-hidden">
          <div className="glow-orb -top-40 -right-40 opacity-70" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#fbf0df] mb-4 relative">{t("cta.title")}</h2>
          <p className="text-[#fbf0df]/50 mb-10 max-w-xl mx-auto leading-relaxed relative">{t("cta.desc")}</p>
          <div className="flex items-center justify-center gap-4 relative">
            <button type="button" onClick={() => onNavigate("developer")}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold no-underline hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary"
            >{t("cta.docs")}</button>
            <button type="button" onClick={() => onNavigate("submit")}
              className="px-8 py-3 rounded-xl border border-[#fbf0df]/20 text-[#fbf0df] font-bold no-underline hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-all cursor-pointer bg-transparent"
            >{t("cta.submit")}</button>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useI18n();
  return (
    <footer className="px-8 py-16 border-t border-[#fbf0df]/5">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-[#fbf0df] mb-3">
            <img src={logo} alt="" className="h-6" />
            NavalCode
          </div>
          <p className="text-[#fbf0df]/40 text-sm leading-relaxed">{t("footer.tagline")}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#fbf0df] mb-3 uppercase tracking-wider">{t("nav.platform")}</h4>
          <div className="flex flex-col gap-2 text-sm">
            <button type="button" onClick={() => onNavigate("developer")} className="text-[#fbf0df]/40 hover:text-[#00d4ff] transition-colors text-left bg-transparent border-0 cursor-pointer">{t("nav.developer")}</button>
            <button type="button" onClick={() => onNavigate("submit")} className="text-[#fbf0df]/40 hover:text-[#00d4ff] transition-colors text-left bg-transparent border-0 cursor-pointer">{t("nav.submit")}</button>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#fbf0df] mb-3 uppercase tracking-wider">{t("nav.legal")}</h4>
          <div className="flex flex-col gap-2 text-sm">
            <button type="button" onClick={() => onNavigate("terms")} className="text-[#fbf0df]/40 hover:text-[#00d4ff] transition-colors text-left bg-transparent border-0 cursor-pointer">{t("nav.terms")}</button>
            <button type="button" onClick={() => onNavigate("privacy")} className="text-[#fbf0df]/40 hover:text-[#00d4ff] transition-colors text-left bg-transparent border-0 cursor-pointer">{t("nav.privacy")}</button>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-[#fbf0df]/30 pt-8 border-t border-[#fbf0df]/5">{t("footer.taglineShort")}</div>
    </footer>
  );
}

function AppContent() {
  const [page, setPage] = useState<Page>(() => pathToPage(window.location.pathname));
  const { loading } = useAuth();
  const { t } = useI18n();

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
        <div className="text-[#fbf0df]/40">{t("loading")}</div>
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
    <I18nProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
