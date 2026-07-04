import { useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";

export function Device() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center">
        <p className="text-[#fbf0df]/50 mb-4">{t("loading")}</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const raw = code.trim().toUpperCase();
    if (!raw.match(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)) {
      setStatus("error");
      setError(t("device.error.invalid"));
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const token = localStorage.getItem("navalcode_token");
      const res = await fetch("/api/auth/device/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: raw }),
      });
      const data = await res.json();
      if (!res.ok) {
        const key = data.error === "Code déjà utilisé" ? "device.error.used"
          : data.error === "Code expiré" ? "device.error.expired"
          : "device.error.invalid";
        setStatus("error");
        setError(t(key));
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError(t("device.error.invalid"));
    }
  }

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-md mx-auto pt-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#fbf0df] mb-3">{t("device.title")}</h1>
          <p className="text-[#fbf0df]/50 text-sm">{t("device.desc")}</p>
        </div>

        {status === "success" ? (
          <div className="p-8 rounded-2xl bg-[#16161f] border border-green-500/20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-green-400" role="img" aria-label="check">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="text-green-400 font-semibold">{t("device.success")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="deviceCode" className="block text-sm font-bold text-[#fbf0df] mb-2">
                {t("device.codeTitle")}
              </label>
              <input
                id="deviceCode"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("device.placeholder")}
                maxLength={9}
                className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-4 text-center text-2xl text-[#fbf0df] font-mono tracking-[0.3em] outline-none focus:border-[#00d4ff]/50 transition-colors placeholder:text-[#fbf0df]/20"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-base no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border-0 btn-primary"
            >
              {status === "loading" ? t("loading") : t("device.confirm")}
            </button>
          </form>
        )}

        <p className="text-[#fbf0df]/30 text-xs text-center mt-8 leading-relaxed">
          {t("device.noCode")}<br />
          <code className="text-[#00d4ff]/60">npm install -g @navalcode/cli</code>
        </p>
      </div>
    </div>
  );
}
