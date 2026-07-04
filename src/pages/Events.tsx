import { useState, useEffect } from "react";
import { useI18n } from "../i18n/I18nContext";

interface EventData {
  id: number;
  name: string;
  description: string;
  event_date: string;
  status: string;
}

interface LeaderEntry {
  id: number;
  username: string;
  display_name: string;
  rank: number;
  score: number;
  prize: number;
}

export function Events() {
  const { t } = useI18n();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data as EventData[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedEvent === null) { return; }
    fetch(`/api/events/leaderboard?eventId=${selectedEvent}`)
      .then((r) => r.json())
      .then((data) => setLeaderboard(data as LeaderEntry[]))
      .catch(() => {});
  }, [selectedEvent]);

  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status !== "upcoming");

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <p className="text-[#fbf0df]/50">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#7c3aed]/20 border border-[#00d4ff]/20 text-sm font-bold text-[#00d4ff]">
            E
          </div>
          <h1 className="text-4xl font-bold text-[#fbf0df]">{t("events.title")}</h1>
        </div>

        {upcoming.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">
              <span className="text-gradient">{t("events.upcoming")}</span>
            </h2>
            <div className="grid gap-4">
              {upcoming.map((event) => (
                <div key={event.id} className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#fbf0df]">{event.name}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20">
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-[#fbf0df]/50 text-sm">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#fbf0df] mb-6">
              <span className="text-gradient">{t("events.past")}</span>
            </h2>
            <div className="grid gap-4">
              {past.map((event) => (
                <div key={event.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                    className="w-full p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 card-hover text-left bg-transparent cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#fbf0df]">{event.name}</h3>
                        <p className="text-[#fbf0df]/40 text-xs mt-1">{new Date(event.event_date).toLocaleDateString()}</p>
                      </div>
                      <span className="text-xs text-[#fbf0df]/30">{t("events.viewResults")}</span>
                    </div>
                  </button>
                  {selectedEvent === event.id && leaderboard.length > 0 && (
                    <div className="mt-2 p-4 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-[#fbf0df]/40 text-xs uppercase tracking-wider">
                            <th className="text-left py-2 px-2">{t("events.rank")}</th>
                            <th className="text-left py-2 px-2">{t("events.player")}</th>
                            <th className="text-right py-2 px-2">{t("events.score")}</th>
                            <th className="text-right py-2 px-2">{t("events.prize")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.map((entry) => (
                            <tr key={entry.id} className="border-t border-[#fbf0df]/5">
                              <td className="py-2 px-2 text-[#fbf0df] font-bold">#{entry.rank}</td>
                              <td className="py-2 px-2 text-[#fbf0df]">{entry.display_name || entry.username}</td>
                              <td className="py-2 px-2 text-right text-[#00d4ff] font-mono">{entry.score?.toFixed(1)}%</td>
                              <td className="py-2 px-2 text-right text-[#fbf0df]/70 font-mono">{entry.prize ? `${entry.prize}€` : "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#fbf0df]/30 text-lg">{t("events.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
