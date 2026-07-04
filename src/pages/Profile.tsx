import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "../auth/AuthContext";
import { Brain } from "../classes/Brain";
import { Board } from "../classes/Board";
import { Strategy, type Direction } from "../classes/Strategy";
import { State } from "../types/State";
import { Boats } from "../types/Boats";

type Tab = "bots" | "leaderboard" | "estimate" | "train" | "settings";

interface Bot {
  id: number;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  status: string;
  created_at: string;
}

interface ValidationCheck {
  label: string;
  passed: boolean;
}

interface LeaderEntry {
  id: number;
  username: string;
  display_name: string;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winrate: number;
}

function getToken(): string | null {
  return localStorage.getItem("navalcode_token");
}

function authFetch(url: string, init?: RequestInit): Promise<Response> {
  const token = getToken();
  return fetch(url, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}` },
  });
}

export function Profile() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("bots");

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <p className="text-[#fbf0df]/50">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <AvatarPreview userId={user.id} className="w-12 h-12 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold text-[#fbf0df]">{t("profile.title")}</h1>
            <p className="text-[#fbf0df]/40 text-sm">@{user.username}</p>
          </div>
        </div>

        <div className="flex gap-1 mb-10 p-1 rounded-xl bg-[#16161f] border border-[#fbf0df]/5">
          {(["bots", "leaderboard", "estimate", "train", "settings"] as Tab[]).map((tKey) => (
            <button
              key={tKey}
              type="button"
              onClick={() => setTab(tKey)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all bg-transparent border-0 cursor-pointer ${
                tab === tKey
                  ? "bg-gradient-to-r from-[#00d4ff]/20 to-[#7c3aed]/20 text-[#fbf0df] shadow-sm"
                  : "text-[#fbf0df]/40 hover:text-[#fbf0df]/70"
              }`}
            >
              {t(`profile.tabs.${tKey}`)}
            </button>
          ))}
        </div>

        {tab === "bots" && <BotsTab />}
        {tab === "leaderboard" && <LeaderboardTab />}
        {tab === "estimate" && <EstimateTab />}
        {tab === "settings" && <SettingsTab userId={user.id} />}
        {tab === "train" && <TrainTab />}
      </div>
    </div>
  );
}

function AvatarPreview({ userId, className, refreshKey }: { userId: number; className?: string; refreshKey?: number }) {
  const [src, setSrc] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshKey intentionally forces re-fetch
  useEffect(() => {
    const token = getToken();
    fetch(`/api/profile/avatar?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) { return res.blob(); }
        return null;
      })
      .then((blob) => {
        if (blob) { setSrc(URL.createObjectURL(blob)); }
      })
      .catch(() => {});
  }, [userId, refreshKey]);

  if (!src) {
    return (
      <div className={`bg-[#16161f] border border-[#fbf0df]/10 flex items-center justify-center text-[#fbf0df]/20 ${className || ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" role="img" aria-label="user">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    );
  }

  return <img src={src} alt="" className={`object-cover ${className || ""}`} />;
}

function BotsTab() {
  const { t } = useI18n();
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationCheck[] | null>(null);
  const devBotId = useRef<number | null>(null);
  const loadBotsRef = useRef<() => void>(() => {});

  function loadBots() {
    authFetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setBots(data.bots || []);
        const dev = (data.bots || []).find((b: Bot) => b.status === "dev");
        if (dev) {
          devBotId.current = dev.id;
          authFetch("/api/bots/dev")
            .then((r2) => r2.json())
            .then((d2) => setValidation(d2.validation?.checks || null))
            .catch(() => {});
        } else {
          devBotId.current = null;
          setValidation(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  loadBotsRef.current = loadBots;

  useEffect(() => {
    loadBotsRef.current?.();
    const handler = () => loadBotsRef.current?.();
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  async function finalizeBot(id: number) {
    setFinalizing(id);
    setError(null);
    try {
      const res = await authFetch("/api/bots/finalize", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        const details = data.details ? data.details.join("\n") : data.error || "Erreur";
        setError(details);
        return;
      }
      setBots((prev) => prev.map((b) => b.id === id ? { ...b, status: "finalized" } : b));
      setValidation(null);
      devBotId.current = null;
    } catch {
      setError("Erreur réseau");
    }
    setFinalizing(null);
  }

  function CheckItem({ label, passed }: ValidationCheck) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className={passed ? "text-green-400" : "text-red-400"}>{passed ? "✓" : "✗"}</span>
        <span className={passed ? "text-green-400" : "text-[#fbf0df]/50"}>{label}</span>
      </div>
    );
  }

  function statusBadge(status: string) {
    switch (status) {
      case "dev":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-semibold">DEV</span>;
      case "finalized":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-semibold">PRÊT</span>;
      case "submitted":
        return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">SOUMIS</span>;
      default:
        return <span className="text-xs px-2 py-0.5 rounded-full bg-[#fbf0df]/10 text-[#fbf0df]/40 border border-[#fbf0df]/10 font-semibold">{status}</span>;
    }
  }

  if (loading) {
    return <p className="text-[#fbf0df]/40 text-sm">{t("loading")}</p>;
  }

  if (bots.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 text-center">
        <p className="text-[#fbf0df]/50">{t("profile.bots.empty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
          <p className="text-red-400 text-xs whitespace-pre-line font-mono">{error}</p>
        </div>
      )}
      {bots.map((bot) => (
        <div key={bot.id}>
          <div className="p-5 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#fbf0df]">{bot.name}</h3>
                  {statusBadge(bot.status)}
                </div>
                <div className="flex gap-4 text-xs text-[#fbf0df]/40 mt-1">
                  <span>{t("profile.bots.wins")}: {bot.wins}</span>
                  <span>{t("profile.bots.losses")}: {bot.losses}</span>
                  <span>{t("profile.bots.draws")}: {bot.draws}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {bot.status === "dev" && (
                <button
                  type="button"
                  onClick={() => finalizeBot(bot.id)}
                  disabled={finalizing === bot.id || validation?.some((c) => !c.passed)}
                  className="px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 font-semibold text-xs hover:border-green-500/60 hover:bg-green-500/5 transition-all bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {finalizing === bot.id ? "..." : "Finaliser"}
                </button>
              )}
              <a
                href={`/api/bots/download?id=${bot.id}`}
                download
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-semibold text-xs no-underline hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all btn-primary"
              >
                {t("profile.bots.download")}
              </a>
            </div>
          </div>
          {bot.status === "dev" && validation && (
            <div className="mt-2 p-4 rounded-xl bg-[#0d0d14] border border-[#fbf0df]/5 space-y-1.5">
              {validation.map((check) => <CheckItem key={check.label} label={check.label} passed={check.passed} />)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LeaderboardTab() {
  const { t } = useI18n();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => { setEntries(data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-[#fbf0df]/40 text-sm">{t("loading")}</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 text-center">
        <p className="text-[#fbf0df]/50">{t("profile.bots.empty")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#fbf0df]/5 text-[#fbf0df]/40 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-semibold">{t("profile.leaderboard.rank")}</th>
              <th className="text-left px-5 py-3 font-semibold">{t("profile.leaderboard.player")}</th>
              <th className="text-right px-5 py-3 font-semibold">{t("profile.leaderboard.wins")}</th>
              <th className="text-right px-5 py-3 font-semibold">{t("profile.leaderboard.losses")}</th>
              <th className="text-right px-5 py-3 font-semibold">{t("profile.leaderboard.draws")}</th>
              <th className="text-right px-5 py-3 font-semibold">{t("profile.leaderboard.winrate")}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={entry.id} className="border-b border-[#fbf0df]/5 last:border-0 text-[#fbf0df]/70">
                <td className="px-5 py-4 font-bold text-[#00d4ff]">#{i + 1}</td>
                <td className="px-5 py-4">{entry.display_name || entry.username}</td>
                <td className="px-5 py-4 text-right text-green-400">{entry.wins}</td>
                <td className="px-5 py-4 text-right text-red-400">{entry.losses}</td>
                <td className="px-5 py-4 text-right text-yellow-400">{entry.draws}</td>
                <td className="px-5 py-4 text-right font-mono">{(entry.winrate * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTab({ userId }: { userId: number }) {
  const { t } = useI18n();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    authFetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setDisplayName(data.user.display_name || "");
          setBio(data.user.bio || "");
        }
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    await authFetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: displayName, bio }),
    });
    if (avatarFile) {
      const form = new FormData();
      form.append("avatar", avatarFile);
      await authFetch("/api/profile/avatar", { method: "POST", body: form });
      setAvatarFile(null);
      setLocalPreview(null);
      setRefreshKey((k) => k + 1);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
        <label htmlFor="avatarInput" className="block text-sm font-bold text-[#fbf0df] mb-3">{t("profile.settings.avatar")}</label>
        <div className="flex items-center gap-4">
          <div className="relative">
            {localPreview ? (
              <img src={localPreview} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <AvatarPreview userId={userId} className="w-16 h-16 rounded-full" refreshKey={refreshKey} />
            )}
          </div>
          <input
            ref={fileRef}
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 rounded-lg border border-[#fbf0df]/20 text-[#fbf0df]/70 text-sm font-semibold hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-all bg-transparent cursor-pointer"
          >
            {t("profile.settings.avatarUpload")}
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5 space-y-5">
        <div>
          <label htmlFor="displayName" className="block text-sm font-bold text-[#fbf0df] mb-2">
            {t("profile.settings.displayName")}
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-3 text-[#fbf0df] font-mono text-sm outline-none focus:border-[#00d4ff]/50 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-bold text-[#fbf0df] mb-2">
            {t("profile.settings.bio")}
          </label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-transparent border-2 border-[#fbf0df]/10 rounded-xl px-4 py-3 text-[#fbf0df] font-mono text-sm outline-none focus:border-[#00d4ff]/50 transition-colors resize-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-sm no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary"
      >
        {saved ? t("profile.settings.saved") : t("profile.settings.save")}
      </button>
    </div>
  );
}

function generateRandomStrategy(): Strategy {
  const strategy = new Strategy();
  const types: [Boats, "AircraftCarrier" | "Cruiser" | "TorpedoBoat" | "Submarine"][] = [
    [Boats.AircraftCarrier, "AircraftCarrier"],
    [Boats.Cruiser, "Cruiser"],
    [Boats.TorpedoBoat, "TorpedoBoat"],
    [Boats.Submarine, "Submarine"],
  ];
  const occupied = new Set<string>();
  for (const [type] of types) {
    const dirs: Direction[] = ["right", "down", "left", "up"];
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const dir: Direction = dirs[Math.floor(Math.random() * dirs.length)] ?? "right";
      const cells: { x: number; y: number }[] = [];
      for (let i = 0; i < type; i++) {
        const cx = dir === "right" ? x + i : dir === "left" ? x - i : x;
        const cy = dir === "down" ? y + i : dir === "up" ? y - i : y;
        cells.push({ x: cx, y: cy });
      }
      if (cells.every(c => c.x >= 0 && c.x < 10 && c.y >= 0 && c.y < 10 && !occupied.has(`${c.x},${c.y}`))) {
        for (const c of cells) { occupied.add(`${c.x},${c.y}`); }
        strategy.addBoat(type, x, y, dir);
        placed = true;
      }
    }
  }
  return strategy;
}

const GRID_SIZE = 10;

interface TrainState {
  status: "menu" | "placing" | "playing" | "won" | "lost" | "error";
  turn: "player" | "bot";
  playerStrategy: Strategy | null;
  botStrategy: Strategy | null;
  playerShots: Set<string>;
  playerHits: Set<string>;
  botShots: Set<string>;
  botHits: Set<string>;
  playerBoatCells: Set<string>;
  message: string;
  error: string;
}

function getSunkCells(strategy: Strategy, hits: Set<string>): Set<string> {
  const sunk = new Set<string>();
  for (const p of strategy.placements) {
    const allCells = strategy.getCells(p);
    if (allCells.every(c => hits.has(`${c.x},${c.y}`))) {
      for (const c of allCells) { sunk.add(`${c.x},${c.y}`); }
    }
  }
  return sunk;
}

function key(x: number, y: number) { return `${x},${y}`; }

function TrainTab() {
  const { t } = useI18n();
  useAuth();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<TrainState>({
    status: "menu",
    turn: "player",
    playerStrategy: null,
    botStrategy: null,
    playerShots: new Set(),
    playerHits: new Set(),
    botShots: new Set(),
    botHits: new Set(),
    playerBoatCells: new Set(),
    message: "",
    error: "",
  });
  const botRef = useRef<Brain | null>(null);
  const [botName, setBotName] = useState("");

  async function startGame() {
    setLoading(true);
    setState({
      status: "menu",
      turn: "player",
      playerStrategy: null,
      botStrategy: null,
      playerShots: new Set(),
      playerHits: new Set(),
      botShots: new Set(),
      botHits: new Set(),
      playerBoatCells: new Set(),
      message: "",
      error: "",
    });
    try {
      const res = await authFetch("/api/bots/train/transpile");
      if (!res.ok) {
        const data = await res.json();
        setState(s => ({ ...s, status: "error", error: data.error || "Erreur inconnue" }));
        return;
      }
      const { js } = await res.json();
      const className = js.match(/class\s+(\w+)\s+extends\s+\w+/)?.[1];
      if (!className) { throw new Error("Aucune classe trouvée"); }

      const deps = { Brain, Board, Strategy, State, Boats };
      // biome-ignore lint/nursery/noImpliedEval: needed to dynamically instantiate user bot code
      const fn = new Function(
        ...Object.keys(deps),
        `${js}\nreturn new ${className}();`,
      );
      const bot = fn(...Object.values(deps)) as Brain;
      botRef.current = bot;
      setBotName(bot.name || "Bot");

      const botStrategy = bot.getStrategy();
      if (botStrategy?.placements.length !== 4) {
        throw new Error("La stratégie du bot doit placer exactement 4 bateaux");
      }

      const boatDefs: { type: Boats; name: string; size: number }[] = [
        { type: Boats.AircraftCarrier, name: "AircraftCarrier", size: 5 },
        { type: Boats.Cruiser, name: "Cruiser", size: 4 },
        { type: Boats.TorpedoBoat, name: "TorpedoBoat", size: 3 },
        { type: Boats.Submarine, name: "Submarine", size: 2 },
      ];
      const occupied = new Set<string>();
      const usedTypes = new Set<number>();

      for (const p of botStrategy.placements) {
        const def = boatDefs.find(d => d.type === p.boat);
        if (!def) {
          throw new Error(`Type de bateau inconnu : ${p.boat}`);
        }
        usedTypes.add(p.boat);
        const cells = botStrategy.getCells(p);
        if (cells.length !== def.size) {
          throw new Error(`Bateau ${def.name} : attendu ${def.size} cellules, reçu ${cells.length}`);
        }
        for (const c of cells) {
          if (c.x < 0 || c.x >= 10 || c.y < 0 || c.y >= 10) {
            throw new Error(`Bateau ${def.name} hors limites (${c.x},${c.y})`);
          }
          const k = `${c.x},${c.y}`;
          if (occupied.has(k)) {
            throw new Error(`Bateaux qui se chevauchent à (${c.x},${c.y})`);
          }
          occupied.add(k);
        }
      }

      if (usedTypes.size !== 4) {
        const missing = boatDefs.filter(d => !usedTypes.has(d.type)).map(d => d.name);
        throw new Error(`Bateaux manquants : ${missing.join(", ")}`);
      }

      // Validate bot boat positions are in bounds
      for (const p of botStrategy.placements) {
        const cells = botStrategy.getCells(p);
        for (const c of cells) {
          if (c.x < 0 || c.x >= 10 || c.y < 0 || c.y >= 10) {
            throw new Error(`Bateau ${p.boat} hors limites`);
          }
        }
      }

      // Generate random player strategy
      const playerStrategy = generateRandomStrategy();
      const playerBoatCells = new Set<string>();
      for (const p of playerStrategy.placements) {
        for (const c of playerStrategy.getCells(p)) {
          playerBoatCells.add(`${c.x},${c.y}`);
        }
      }

      setState(s => ({
        ...s,
        status: "playing",
        playerStrategy,
        botStrategy,
        playerBoatCells,
        message: "À vous de jouer !",
      }));
    } catch (e) {
      setState(s => ({ ...s, status: "error", error: (e as Error).message }));
    } finally {
      setLoading(false);
    }
  }

  const handleCellClick = useCallback((x: number, y: number) => {
    setState(prev => {
      if (prev.status !== "playing" || prev.turn !== "player") { return prev; }
      if (prev.playerShots.has(key(x, y))) { return prev; }
      if (!prev.botStrategy) { return prev; }
      if (!botRef.current) { return prev; }

      const botStrategy = prev.botStrategy;
      const playerShots = new Set(prev.playerShots);
      const playerHits = new Set(prev.playerHits);
      const botShots = new Set(prev.botShots);
      const botHits = new Set(prev.botHits);

      playerShots.add(key(x, y));
      const hit = botStrategy.isHit(x, y);
      if (hit) { playerHits.add(key(x, y)); }

      const prevPlayerSunk = getSunkCells(botStrategy, prev.playerHits);
      const newPlayerSunk = getSunkCells(botStrategy, playerHits);
      const allBotSunk = botStrategy.placements.every(p =>
        botStrategy.getCells(p).every(c => playerHits.has(key(c.x, c.y)))
      );

      if (allBotSunk) {
        const msg = "Tous les bateaux coulés ! Vous avez gagné !";
        return {
          ...prev,
          playerShots,
          playerHits,
          status: "won" as const,
          turn: "player" as const,
          message: msg,
        };
      }

      const hitMsg = hit
        ? (newPlayerSunk.size > prevPlayerSunk.size ? "Touché-Coulé !" : "Touché !")
        : "Raté !";

      const bot = botRef.current;

      // Tell bot where player shot before it thinks
      bot.turn(x, y);

      const botThink = bot.think();
      let bx = Math.max(0, Math.min(9, Math.round(botThink.x)));
      let by = Math.max(0, Math.min(9, Math.round(botThink.y)));

      // Prevent duplicate bot shots
      let attempts = 0;
      while (botShots.has(key(bx, by)) && attempts < 100) {
        const retry = bot.think();
        bx = Math.max(0, Math.min(9, Math.round(retry.x)));
        by = Math.max(0, Math.min(9, Math.round(retry.y)));
        attempts++;
      }

      botShots.add(key(bx, by));

      const playerStrategy = prev.playerStrategy!;
      const botHit = playerStrategy.isHit(bx, by);
      if (botHit) { botHits.add(key(bx, by)); }

      // Update bot's adversary board so it knows where its shots hit
      const advBoard = bot.getAdversaryBoard();
      if (botHit) { advBoard.board[bx]![by] = State.Hit; }

      const prevBotSunk = getSunkCells(playerStrategy, prev.botHits);
      const newBotSunk = getSunkCells(playerStrategy, botHits);

      // Mark sunk boat cells on bot's adversary board
      if (newBotSunk.size > prevBotSunk.size) {
        for (const k of newBotSunk) {
          if (!prevBotSunk.has(k)) {
            const parts = k.split(",");
            const sx = Number(parts[0]);
            const sy = Number(parts[1]);
            advBoard.board[sx]![sy] = State.Sunk;
          }
        }
      }
      const allPlayerSunk = playerStrategy.placements.every(p =>
        playerStrategy.getCells(p).every(c => botHits.has(key(c.x, c.y)))
      );

      const botMsg = botHit
        ? (newBotSunk.size > prevBotSunk.size ? "Touché-Coulé !" : "Touché !")
        : "Raté !";

      if (allPlayerSunk) {
        return {
          ...prev,
          playerShots,
          playerHits,
          botShots,
          botHits,
          status: "lost" as const,
          turn: "bot" as const,
          message: `Votre tir : ${hitMsg} — Bot (${bx},${by}) : ${botMsg}. Vous avez perdu !`,
        };
      }

      return {
        ...prev,
        playerShots,
        playerHits,
        botShots,
        botHits,
        turn: "player" as const,
        message: `Votre tir : ${hitMsg} — Bot (${bx},${by}) : ${botMsg}`,
      };
    });
  }, []);

  function cellColor(
    isPlayerBoard: boolean,
    x: number,
    y: number,
    boatCells: Set<string>,
    shots: Set<string>,
    hits: Set<string>,
    strategy: Strategy | null,
  ): string {
    const k = key(x, y);
    const isShot = shots.has(k);
    const isHit = hits.has(k);

    if (isPlayerBoard) {
      // Player's own board
      if (boatCells.has(k)) {
        if (isHit) {
          // Check if this boat is fully sunk
          if (strategy) {
            const sunkCells = getSunkCells(strategy, hits);
            if (sunkCells.has(k)) { return "#ff4444"; } // sunk
          }
          return "#ff8800"; // hit
        }
        return "#0066cc"; // boat
      }
      if (isShot) { return "rgba(255,255,255,0.15)"; } // miss
      return "rgba(255,255,255,0.05)"; // water
    }

    // Bot's board (boats hidden)
    if (isHit) {
      if (strategy) {
        const sunkCells = getSunkCells(strategy, hits);
        if (sunkCells.has(k)) { return "#ff4444"; } // sunk
      }
      return "#ff8800"; // hit
    }
    if (isShot) { return "rgba(255,255,255,0.15)"; } // miss
    return "rgba(255,255,255,0.05)"; // unknown
  }

  function renderGrid(
    isPlayer: boolean,
    boatCells: Set<string>,
    shots: Set<string>,
    hits: Set<string>,
    strategy: Strategy | null,
    onClick?: (x: number, y: number) => void,
  ) {
    const cells: React.ReactNode[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const color = cellColor(isPlayer, col, row, boatCells, shots, hits, strategy);
        const k = key(col, row);
        const showHitMark = shots.has(k);
        cells.push(
          // biome-ignore lint/a11y/useSemanticElements: using CSS grid, not HTML table
          <div
            key={`${col}-${row}`}
            onClick={() => {
              if (!isPlayer && onClick && shots.has(k) === false) {
                onClick(col, row);
              }
            }}
            role="gridcell"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(col, row);
              }
            }}
            className={(isPlayer || shots.has(k)) ? "" : "cursor-pointer hover:bg-white/20"}
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: color,
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              transition: "background-color 0.15s",
            }}
          >
            {showHitMark && shots.has(k) && (
              <span style={{ color: hits.has(k) ? "#fff" : "rgba(255,255,255,0.3)", fontWeight: "bold" }}>
                {hits.has(k) ? "X" : "O"}
              </span>
            )}
          </div>,
        );
      }
    }
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_SIZE}, 28px)`,
        gap: 0,
      }}>
        {cells}
      </div>
    );
  }

  const activeGame = state.status === "playing" || state.status === "won" || state.status === "lost";
  const canClick = state.status === "playing" && state.turn === "player";

  return (
    <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
      {state.status === "menu" || state.status === "error" ? (
        <div className="text-center py-8">
          <p className="text-[#fbf0df]/50 leading-relaxed mb-6">
            {t("profile.train.desc")}
          </p>
          {state.status === "error" && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {state.error}
            </div>
          )}
          <button
            type="button"
            onClick={startGame}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-sm no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "Chargement..." : "Lancer l'entraînement"}
          </button>
        </div>
      ) : activeGame ? (
        <div>
          <div className="text-center mb-4">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
              state.turn === "player"
                ? "bg-[#00d4ff]/20 text-[#00d4ff]"
                : "bg-purple-500/20 text-purple-400"
            }`}>
              {state.turn === "player" ? "Votre tour" : "Tour du bot"}
            </span>
            {state.status !== "playing" && (
              <span className={`ml-3 inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                state.status === "won" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                {state.status === "won" ? "Victoire !" : "Défaite"}
              </span>
            )}
          </div>

          {state.message && (
            <p className="text-center text-sm text-[#fbf0df]/60 mb-4">{state.message}</p>
          )}

          <div className="flex justify-center gap-8 flex-wrap">
            {/* Player's board */}
            <div className="text-center">
              <p className="text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-2">Votre plateau</p>
              {renderGrid(true, state.playerBoatCells, state.botShots, state.botHits, state.playerStrategy)}
            </div>

            {/* Bot's board */}
            <div className="text-center">
              <p className="text-xs font-bold text-[#fbf0df]/40 uppercase tracking-wider mb-2">Plateau de {botName}</p>
              {renderGrid(false, new Set(), state.playerShots, state.playerHits, state.botStrategy, canClick ? handleCellClick : undefined)}
            </div>
          </div>

          {state.status !== "playing" && (
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-sm no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary"
              >
                Rejouer
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

const GAMES_PER_OPPONENT = 50;

function createBotFactory(js: string, className: string): () => Brain {
  const deps = { Brain, Board, Strategy, State, Boats };
  // biome-ignore lint/nursery/noImpliedEval: needed to create bot factories for estimation
  const fn = new Function(
    ...Object.keys(deps),
    `${js}\nreturn new ${className}();`,
  );
  return () => fn(...Object.values(deps)) as Brain;
}

function key_(x: number, y: number) { return `${x},${y}`; }
function clamp(v: number) { return Math.max(0, Math.min(9, Math.round(v))); }

function clearBoard(board: Board) {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      board.board[x]![y] = State.None;
    }
  }
}

function allSunk(strategy: Strategy, hits: Set<string>): boolean {
  return strategy.placements.every(p =>
    strategy.getCells(p).every(c => hits.has(key_(c.x, c.y)))
  );
}

function playHeadlessGame(
  factoryA: () => Brain,
  factoryB: () => Brain,
): "A" | "B" | "draw" {
  const A = factoryA();
  const B = factoryB();
  const strategyA = A.getStrategy();
  const strategyB = B.getStrategy();

  const shotsA = new Set<string>();
  const hitsA = new Set<string>();
  const shotsB = new Set<string>();
  const hitsB = new Set<string>();

  clearBoard(A.getAdversaryBoard());
  clearBoard(B.getAdversaryBoard());

  let current: "A" | "B" = "A";

  for (let turn = 0; turn < 200; turn++) {
    if (current === "A") {
      const target = A.think();
      let x = clamp(target.x);
      let y = clamp(target.y);
      let attempts = 0;
      while (shotsA.has(key_(x, y)) && attempts < 100) {
        const retry = A.think();
        x = clamp(retry.x);
        y = clamp(retry.y);
        attempts++;
      }
      shotsA.add(key_(x, y));

      const hit = strategyB.isHit(x, y);
      if (hit) {
        hitsA.add(key_(x, y));
        const adv = A.getAdversaryBoard();
        adv.board[x]![y] = State.Hit;
        if (allSunk(strategyB, hitsA)) { return "A"; }
      }

      B.turn(x, y);
    } else {
      const target = B.think();
      let x = clamp(target.x);
      let y = clamp(target.y);
      let attempts = 0;
      while (shotsB.has(key_(x, y)) && attempts < 100) {
        const retry = B.think();
        x = clamp(retry.x);
        y = clamp(retry.y);
        attempts++;
      }
      shotsB.add(key_(x, y));

      const hit = strategyA.isHit(x, y);
      if (hit) {
        hitsB.add(key_(x, y));
        const adv = B.getAdversaryBoard();
        adv.board[x]![y] = State.Hit;
        if (allSunk(strategyA, hitsB)) { return "B"; }
      }

      A.turn(x, y);
    }

    current = current === "A" ? "B" : "A";
  }

  return "draw";
}

function EstimateTab() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "loading" | "running" | "done">("idle");
  const [results, setResults] = useState<{ opponent: string; wins: number; losses: number; draws: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userFactoryRef = useRef<(() => Brain) | null>(null);
  const templatesRef = useRef<{ name: string; factory: () => Brain }[]>([]);

  async function runEstimation() {
    setStatus("loading");
    setError(null);
    setResults([]);

    try {
      const userRes = await authFetch("/api/bots/train/transpile");
      if (!userRes.ok) {
        const d = await userRes.json();
        throw new Error(d.error || "Erreur chargement robot");
      }
      const { js: userJs } = await userRes.json();
      const userClassName = userJs.match(/class\s+(\w+)\s+extends\s+\w+/)?.[1];
      if (!userClassName) { throw new Error("Classe du robot introuvable"); }

      const tmplRes = await authFetch("/api/bots/train/templates");
      const templates: { name: string; js: string }[] = await tmplRes.json();

      userFactoryRef.current = createBotFactory(userJs, userClassName);
      templatesRef.current = templates.map((t) => ({
        name: t.name,
        factory: createBotFactory(t.js, t.name),
      }));

      setStatus("running");

      for (const tmpl of templatesRef.current) {
        let wins = 0;
        let losses = 0;
        let draws = 0;

        for (let i = 0; i < GAMES_PER_OPPONENT; i++) {
          const userFirst = i % 2 === 0;
          const result = playHeadlessGame(
            userFirst ? userFactoryRef.current : tmpl.factory,
            userFirst ? tmpl.factory : userFactoryRef.current,
          );
          if (result === "A") { userFirst ? wins++ : losses++; }
          else if (result === "B") { userFirst ? losses++ : wins++; }
          else { draws++; }

          if (i % 10 === 0 && i > 0) { await new Promise((r) => setTimeout(r, 0)); }
        }

        setResults((prev) => [...prev, { opponent: tmpl.name, wins, losses, draws }]);
      }

      setStatus("done");
    } catch (e) {
      setError((e as Error).message);
      setStatus("idle");
    }
  }

  const totalResults = results.reduce((acc, r) => ({
    wins: acc.wins + r.wins,
    losses: acc.losses + r.losses,
    draws: acc.draws + r.draws,
  }), { wins: 0, losses: 0, draws: 0 });

  return (
    <div className="p-6 rounded-2xl bg-[#16161f] border border-[#fbf0df]/5">
      {status === "idle" || status === "loading" ? (
        <div className="text-center py-8">
          <p className="text-[#fbf0df]/50 leading-relaxed mb-6">
            {t("profile.estimate.desc")}
          </p>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={runEstimation}
            disabled={status === "loading"}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-sm no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {status === "loading" ? t("profile.estimate.running") : t("profile.estimate.start")}
          </button>
        </div>
      ) : (
        <div>
          {(status === "running" || status === "done") && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#fbf0df]/10">
                    <th className="px-4 py-3 text-left text-[#fbf0df]/40 font-semibold uppercase tracking-wider">{t("profile.estimate.opponent")}</th>
                    <th className="px-4 py-3 text-right text-[#fbf0df]/40 font-semibold uppercase tracking-wider">{t("profile.estimate.wins")}</th>
                    <th className="px-4 py-3 text-right text-[#fbf0df]/40 font-semibold uppercase tracking-wider">{t("profile.estimate.losses")}</th>
                    <th className="px-4 py-3 text-right text-[#fbf0df]/40 font-semibold uppercase tracking-wider">{t("profile.estimate.draws")}</th>
                    <th className="px-4 py-3 text-right text-[#fbf0df]/40 font-semibold uppercase tracking-wider">{t("profile.estimate.winrate")}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => {
                    const pct = r.wins + r.losses + r.draws > 0
                      ? ((r.wins / (r.wins + r.losses + r.draws)) * 100).toFixed(1)
                      : "-";
                    return (
                      <tr key={r.opponent} className="border-b border-[#fbf0df]/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-[#fbf0df] font-semibold">{r.opponent}</td>
                        <td className="px-4 py-3 text-right text-green-400 font-bold">{r.wins}</td>
                        <td className="px-4 py-3 text-right text-red-400 font-bold">{r.losses}</td>
                        <td className="px-4 py-3 text-right text-[#fbf0df]/40">{r.draws}</td>
                        <td className="px-4 py-3 text-right text-[#00d4ff] font-bold">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
                {status === "done" && (
                  <tfoot>
                    <tr className="border-t-2 border-[#fbf0df]/20">
                      <td className="px-4 py-3 text-[#fbf0df] font-bold">{t("profile.estimate.total")}</td>
                      <td className="px-4 py-3 text-right text-green-400 font-bold">{totalResults.wins}</td>
                      <td className="px-4 py-3 text-right text-red-400 font-bold">{totalResults.losses}</td>
                      <td className="px-4 py-3 text-right text-[#fbf0df]/40">{totalResults.draws}</td>
                      <td className="px-4 py-3 text-right text-[#00d4ff] font-bold">
                        {((totalResults.wins / (totalResults.wins + totalResults.losses + totalResults.draws)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
          {status === "running" && (
            <p className="text-center text-sm text-[#fbf0df]/40 mt-4">
              {t("profile.estimate.running")}
            </p>
          )}
          {status === "done" && (
            <div className="text-center mt-6">
              <p className="text-xs text-[#fbf0df]/30 mb-4">
                {results.reduce((sum, r) => sum + r.wins + r.losses + r.draws, 0)} parties jouées
              </p>
              <button
                type="button"
                onClick={runEstimation}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold text-sm no-underline hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-0 btn-primary"
              >
                Re-estimer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
