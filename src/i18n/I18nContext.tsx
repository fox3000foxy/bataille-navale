import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type Lang = "fr" | "en";

interface I18nValue {
  lang: Lang;
  t: (key: string) => string;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nValue | null>(null);

function loadLang(): Lang {
  const stored = localStorage.getItem("navalcode_lang") as Lang | null;
  if (stored === "fr" || stored === "en") { return stored; }
  const browser = navigator.language?.slice(0, 2);
  return browser === "fr" ? "fr" : "en";
}

const cache = new Map<Lang, Record<string, string>>();

async function fetchTranslations(lang: Lang): Promise<Record<string, string>> {
  if (cache.has(lang)) { return cache.get(lang)!; }
  const module = lang === "fr" ? await import("./fr.json") : await import("./en.json");
  const data = module.default || module;
  cache.set(lang, data);
  return data;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(loadLang);
  const [dict, setDict] = useState<Record<string, string>>({});

  useEffect(() => {
    // biome-ignore lint/nursery/noFloatingPromises: effect fire-and-forget
    fetchTranslations(lang).then(setDict);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("navalcode_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key: string): string => {
    return dict[key] ?? `[${key}]`;
  }, [dict]);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "fr" ? "en" : "fr"));
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) { throw new Error("useI18n must be used within I18nProvider"); }
  return ctx;
}
