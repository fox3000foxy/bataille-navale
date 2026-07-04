import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";

type Page = "home" | "developer" | "terms" | "privacy" | "submit" | "login" | "register";

export function Register({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { register } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
        <h1 className="text-3xl font-bold text-[#fbf0df] mb-8 text-center">{t("register.title")}</h1>

        {error && (
          <p className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20">{error}</p>
        )}

        <form onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          if (password !== confirm) { setError(t("register.passwordMismatch")); return; }
          setLoading(true);
          try {
            await register(email, username, password);
            onNavigate("home");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur");
          } finally {
            setLoading(false);
          }
        }} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#fbf0df] mb-2">{t("register.email")}</label>
            <input id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-3 text-[#fbf0df] text-sm outline-none focus:border-[#00d4ff]/50 transition-colors placeholder-[#fbf0df]/20"
              placeholder={t("register.emailPlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-[#fbf0df] mb-2">{t("register.username")}</label>
            <input id="username" type="text" required value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-3 text-[#fbf0df] text-sm outline-none focus:border-[#00d4ff]/50 transition-colors"
              placeholder={t("register.usernamePlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-[#fbf0df] mb-2">{t("register.password")}</label>
            <input id="password" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-3 text-[#fbf0df] text-sm outline-none focus:border-[#00d4ff]/50 transition-colors"
              placeholder={t("register.passwordPlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-bold text-[#fbf0df] mb-2">{t("register.confirm")}</label>
            <input id="confirm" type="password" required value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-3 text-[#fbf0df] text-sm outline-none focus:border-[#00d4ff]/50 transition-colors"
              placeholder={t("register.confirmPlaceholder")}
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full px-8 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-sm transition-all hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] disabled:opacity-40 cursor-pointer border-0 btn-primary"
          >
            {loading ? t("register.loading") : t("register.submit")}
          </button>
        </form>

        <p className="text-[#fbf0df]/40 text-sm text-center mt-6">
          {t("register.hasAccount")}{" "}
          <button type="button" onClick={() => onNavigate("login")}
            className="text-[#00d4ff] bg-transparent border-0 cursor-pointer hover:underline"
          >
            {t("register.login")}
          </button>
        </p>
      </div>
    </div>
  );
}
