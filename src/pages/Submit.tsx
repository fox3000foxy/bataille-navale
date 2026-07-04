import { useI18n } from "../i18n/I18nContext";
import logo from "../logo.svg";

export function Submit() {
  const { t } = useI18n();

  const steps = [
    { key: "submit.how.steps.0", text: t("submit.how.steps.0") },
    { key: "submit.how.steps.1", text: t("submit.how.steps.1") },
    { key: "submit.how.steps.2", text: t("submit.how.steps.2") },
    { key: "submit.how.steps.3", text: t("submit.how.steps.3") },
  ];

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <img src={logo} alt="" className="h-12 opacity-70" />
          <h1 className="text-4xl font-bold text-[#fbf0df]">{t("submit.title")}</h1>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4"><span className="text-gradient">{t("submit.event.title")}</span></h2>
          <div className="p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 text-center card-hover">
            <p className="text-[#fbf0df]/30 text-sm uppercase tracking-widest mb-2">{t("submit.event.label")}</p>
            <p className="text-3xl font-bold text-[#00d4ff]">{t("submit.event.time")}</p>
            <p className="text-[#fbf0df]/50 text-sm mt-4">
              {t("submit.event.desc")}
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4"><span className="text-gradient">{t("submit.how.title")}</span></h2>
          <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
            <ol className="text-[#fbf0df]/50 text-sm leading-relaxed space-y-4 list-decimal list-inside">
              {steps.map((step) => (
                <li key={step.key}>{step.text}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#fbf0df] mb-4"><span className="text-gradient">{t("submit.form.title")}</span></h2>
          <form
            className="p-8 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-[#fbf0df] mb-2">
                {t("submit.form.name")}
              </label>
              <input
                id="name"
                type="text"
                placeholder={t("submit.form.namePlaceholder")}
                className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-3 text-[#fbf0df] font-mono text-sm outline-none focus:border-[#00d4ff]/50 transition-colors placeholder-[#fbf0df]/20"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-bold text-[#fbf0df] mb-2">
                {t("submit.form.file")}
              </label>
              <div className="border-2 border-dashed border-[#fbf0df]/10 rounded-xl p-8 text-center hover:border-[#00d4ff]/30 transition-colors cursor-pointer">
                <p className="text-[#fbf0df]/50 text-sm mb-1">
                  {t("submit.form.dragDrop")}
                </p>
                <p className="text-[#fbf0df]/20 text-xs">{t("submit.form.maxSize")}</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-base no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed btn-primary"
              disabled
            >
              {t("submit.form.submit")}
            </button>

            <p className="text-[#fbf0df]/20 text-xs text-center">
              {t("submit.form.agreement")}{" "}
              <a href="/terms" className="text-[#fbf0df]/40 underline hover:text-[#00d4ff] transition-colors">CGU</a>.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
