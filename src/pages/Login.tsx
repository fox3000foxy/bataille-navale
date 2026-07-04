import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";

type Page = "home" | "terms" | "privacy" | "login" | "register";

export function Login({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
        <h1 className="text-3xl font-bold text-[#fbf0df] mb-8 text-center">{t("login.title")}</h1>

        {error && (
          <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20">{error}</p>
        )}

        <form onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);
          try {
            await login(email, password);
            onNavigate("home");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur");
          } finally {
            setLoading(false);
          }
        }} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#fbf0df] mb-2">{t("login.email")}</label>
            <input id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-3 text-[#fbf0df] text-sm outline-none focus:border-[#00d4ff]/50 transition-colors placeholder-[#fbf0df]/20"
              placeholder={t("login.emailPlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-[#fbf0df] mb-2">{t("login.password")}</label>
            <input id="password" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-3 text-[#fbf0df] text-sm outline-none focus:border-[#00d4ff]/50 transition-colors"
              placeholder={t("login.passwordPlaceholder")}
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full px-8 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-sm transition-all hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] disabled:opacity-40 cursor-pointer border-0 btn-primary"
          >
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>

        <p className="text-[#fbf0df]/40 text-sm text-center mt-6">
          {t("login.noAccount")}{" "}
          <button type="button" onClick={() => onNavigate("register")}
            className="text-[#00d4ff] bg-transparent border-0 cursor-pointer hover:underline"
          >
            {t("login.register")}
          </button>
        </p>
      </div>
    </div>
  );
}
