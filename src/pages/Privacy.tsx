import { useI18n } from "../i18n/I18nContext";

const PRIVACY_SECTIONS = ["0", "1", "2", "3", "4", "5", "6"] as const;

function PrivacySection({ section, t }: { section: string; t: (key: string) => string }) {
  const title = t(`privacy.sections.${section}.title`);
  const body = t(`privacy.sections.${section}.body`);
  const email = section === "6" ? t("privacy.sections.6.email") : null;

  const items: Array<{ key: string; val: string }> = [];
  for (let i = 0; ; i++) {
    const k = `privacy.sections.${section}.items.${i}`;
    const val = t(k);
    if (val === `[${k}]`) { break; }
    items.push({ key: k, val });
  }

  if (items.length > 0) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">{title}</h2>
        <p className="text-[#fbf0df]/50 leading-relaxed">{body}</p>
        <ul className="text-[#fbf0df]/50 leading-relaxed list-disc list-inside mt-2 space-y-1 marker:text-[#00d4ff]">
          {items.map((item) => <li key={item.key}>{item.val}</li>)}
        </ul>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-[#fbf0df] mb-4">{title}</h2>
      <p className="text-[#fbf0df]/50 leading-relaxed">
        {body}
        {email && <span className="text-[#fbf0df] block mt-1">{email}</span>}
      </p>
    </section>
  );
}

export function Privacy() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#fbf0df] mb-12">
          {t("privacy.title")}
        </h1>
        {PRIVACY_SECTIONS.map((s) => (
          <PrivacySection key={s} section={s} t={t} />
        ))}
      </div>
    </div>
  );
}
