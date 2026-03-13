import { useState, useEffect, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import { createRoot } from "react-dom/client";

// ── DATA ────────────────────────────────────────────────────────────────────

const LEVELS = ["Xcel Bronze", "Xcel Silver", "Xcel Gold", "Xcel Platinum", "Xcel Diamond", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9", "Level 10"];

const SKILLS_BY_LEVEL = {
  "Xcel Bronze": {
    Vault: ["FHS Over Vault", "Handspring Vault (Intro)"],
    Bars: ["Pullover", "Back Hip Circle", "Cast", "Underswing Dismount"],
    Beam: ["Cartwheel", "Kick to Handstand", "Relevé Walk", "Split Jump", "Straight Jump Dismount"],
    Floor: ["Cartwheel", "Roundoff", "Forward Roll", "Back Walkover (attempt)", "Split"],
  },
  "Xcel Silver": {
    Vault: ["FHS Over Vault", "Squat-On Dismount"],
    Bars: ["Kip (attempt)", "Back Hip Circle", "Cast to Horizontal", "Sole Circle Dismount"],
    Beam: ["Back Walkover", "Aerial Cartwheel (attempt)", "180° Split Jump", "Cartwheel to BHS"],
    Floor: ["Back Walkover", "Roundoff BHS", "Front Aerial (spot)", "Switch Leap"],
  },
  "Xcel Gold": {
    Vault: ["Yurchenko Approach", "FHS Vault (1.0+)"],
    Bars: ["Kip", "Cast to Handstand (45°)", "Clear Hip (intro)", "Flyaway Dismount"],
    Beam: ["BHS", "Front Aerial (attempt)", "180° Switch Leap", "Aerial Walkover"],
    Floor: ["Roundoff BHS Back Tuck", "Switch Ring Leap", "Front Layout (spot)", "Double Turn"],
  },
  "Level 5": {
    Vault: ["FHS Vault", "Handspring Vault"],
    Bars: ["Kip", "Cast to Horizontal", "Back Hip Circle", "Flyaway Dismount"],
    Beam: ["BHS", "180° Split Leap", "Cartwheel", "Straight Jump + Full Turn"],
    Floor: ["Roundoff BHS Back Tuck", "Switch Leap", "Straddle Jump", "Front Walkover"],
  },
  "Level 6": {
    Vault: ["Handspring Vault (4.0+)"],
    Bars: ["Kip", "Cast to 45°", "Clear Hip (intro)", "Sole Circle", "Flyaway"],
    Beam: ["BHS + BHS", "Switch Leap 180°", "Front Aerial (attempt)", "Full Turn"],
    Floor: ["Roundoff BHS Layout", "Roundoff BHS Back Tuck", "Switch Leap", "Double Turn"],
  },
  "Level 7": {
    Vault: ["Handspring Vault (4.4+)", "Tsuk (intro)"],
    Bars: ["Kip", "Cast to Handstand", "Clear Hip", "Giant (intro)", "Flyaway"],
    Beam: ["BHS", "Front Aerial", "Switch Ring Leap", "Side Aerial (attempt)"],
    Floor: ["Roundoff BHS Full Twist", "Front Layout + Step-Out", "Switch Ring Leap", "Double Turn"],
  },
  "Level 8": {
    Vault: ["Yurchenko (intro)", "Tsuk"],
    Bars: ["Giant", "Release (intro)", "Pirouette", "Flyaway Full"],
    Beam: ["Front Aerial", "BHS + Layout", "Switch Ring + Switch", "Wolf Turn"],
    Floor: ["Double Back (spot)", "Roundoff BHS Double Tuck", "Tour Jeté", "Switch Ring Leap"],
  },
  "Level 9": {
    Vault: ["Yurchenko", "Tsuk Full"],
    Bars: ["Giant", "Tkatchev / Release", "Pirouette", "Double Flyaway"],
    Beam: ["Side Aerial", "BHS + Layout + Layout", "Onodi", "Triple Series"],
    Floor: ["Double Back", "Front 1.5 Punch Front", "Tour Jeté Half", "Triple Turn"],
  },
  "Level 10": {
    Vault: ["Yurchenko Full", "Yurchenko 1.5"],
    Bars: ["Giant", "Tkatchev", "Pak Salto", "Double Layout Dismount"],
    Beam: ["Back 2.5 Twist", "Side Aerial + BHS", "Switch Ring + Switch Half", "Double Pike Dismount (attempt)"],
    Floor: ["Double Layout", "Double Arabian (attempt)", "Tour Jeté Half", "Stuck Landing Series"],
  },
};
for (const lvl of ["Xcel Platinum", "Xcel Diamond", "Level 3", "Level 4"]) {
  SKILLS_BY_LEVEL[lvl] = SKILLS_BY_LEVEL[lvl] || SKILLS_BY_LEVEL["Level 5"];
}

const QUOTES = [
  { text: "Champions aren't made in gyms. Champions are made from something deep inside them.", author: "Muhammad Ali" },
  { text: "It's not about being perfect, it's about effort.", author: "Jillian Michaels" },
  { text: "The hard days are the best because that's when champions are made.", author: "Gabby Douglas" },
  { text: "You have to expect things of yourself before you can do them.", author: "Michael Jordan" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Gold medals aren't really made of gold. They're made of sweat, determination and a hard-to-find alloy called guts.", author: "Dan Gable" },
  { text: "Do not let what you cannot do interfere with what you can do.", author: "John Wooden" },
  { text: "Every landing sticks in your mind before your feet touch the mat.", author: "Gymnastics Proverb" },
  { text: "Gymnastics uses every part of your body, every part of your mind.", author: "Nellie Kim" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "The only way to prove that you're a good sport is to lose.", author: "Ernie Banks" },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
];

const STRETCHES = [
  { id: "s1", name: "Shoulder Circles", sets: "2×20 each direction", icon: "🔄" },
  { id: "s2", name: "Hip Flexor Stretch", sets: "Hold 45 sec each side", icon: "🧘" },
  { id: "s3", name: "Straddle Hold", sets: "3×60 sec", icon: "🦋" },
  { id: "s4", name: "Bridge Hold", sets: "3×30 sec", icon: "🌉" },
  { id: "s5", name: "Pancake Stretch", sets: "2×60 sec", icon: "🥞" },
  { id: "s6", name: "Standing Pike", sets: "3×30 sec", icon: "📐" },
  { id: "s7", name: "Shoulder Flexibility (wall)", sets: "2×45 sec", icon: "🧱" },
  { id: "s8", name: "Split Stretch (R)", sets: "Hold 60 sec", icon: "✂️" },
  { id: "s9", name: "Split Stretch (L)", sets: "Hold 60 sec", icon: "✂️" },
  { id: "s10", name: "Middle Split", sets: "Hold 60 sec", icon: "⭐" },
];

const CONDITIONING = [
  { id: "c1", name: "Hollow Body Holds", sets: "4×30 sec", icon: "🏋️" },
  { id: "c2", name: "Arch Body Holds", sets: "4×30 sec", icon: "🏹" },
  { id: "c3", name: "V-Ups", sets: "3×15", icon: "💪" },
  { id: "c4", name: "Press Handstand Drills", sets: "3×10", icon: "🙃" },
  { id: "c5", name: "Leg Lifts", sets: "3×20", icon: "🦵" },
  { id: "c6", name: "Pull-Up Negatives", sets: "3×5", icon: "⬆️" },
  { id: "c7", name: "Dips", sets: "3×10", icon: "🤸" },
  { id: "c8", name: "Squat Jumps", sets: "3×15", icon: "🦘" },
  { id: "c9", name: "Plank", sets: "3×45 sec", icon: "🪵" },
  { id: "c10", name: "Cast Drills (Strap Bar / Tramp)", sets: "3×10", icon: "🎯" },
];

const PROGRESS_LABELS = ["Not Started", "Learning", "Developing", "Consistent", "Competition Ready"];
const PROGRESS_COLORS = ["#4a4a6a", "#e07b54", "#e6b740", "#5dc8a0", "#c97fd4"];


// ── GAMIFICATION ─────────────────────────────────────────────────────────────

const XP_VALUES = {
  SKILL_LEARNING:    25,   // moved to Learning
  SKILL_DEVELOPING:  50,   // moved to Developing
  SKILL_CONSISTENT: 100,   // moved to Consistent
  SKILL_MASTERED:   250,   // Competition Ready
  EXERCISE_DONE:      5,   // per exercise checked
  DAILY_COMPLETE:   100,   // all exercises done in one day
  STREAK_3:          75,
  STREAK_7:         200,
  STREAK_14:        400,
  STREAK_30:       1000,
};

const XP_LEVELS = [
  { level: 1,  title: "Rookie",        min: 0,     color: "#7a78a0" },
  { level: 2,  title: "Bronze Beam",   min: 200,   color: "#e07b54" },
  { level: 3,  title: "Silver Cast",   min: 600,   color: "#aaaacc" },
  { level: 4,  title: "Gold Kip",      min: 1200,  color: "#e6b740" },
  { level: 5,  title: "Platinum Flip", min: 2500,  color: "#7ecef5" },
  { level: 6,  title: "Diamond Floor", min: 4500,  color: "#5dc8a0" },
  { level: 7,  title: "Elite",         min: 7500,  color: "#c97fd4" },
  { level: 8,  title: "Champion",      min: 12000, color: "#e6b740" },
];

const BADGES = [
  // Skill milestones
  { id: "first_skill",     icon: "⭐", name: "First Steps",      desc: "Master your first skill",                check: (s) => s.totalMastered >= 1 },
  { id: "five_skills",     icon: "🌟", name: "Rising Star",       desc: "Master 5 skills",                        check: (s) => s.totalMastered >= 5 },
  { id: "ten_skills",      icon: "💫", name: "Skill Collector",   desc: "Master 10 skills",                       check: (s) => s.totalMastered >= 10 },
  { id: "twenty_skills",   icon: "🏅", name: "Skill Master",      desc: "Master 20 skills",                       check: (s) => s.totalMastered >= 20 },
  { id: "all_events",      icon: "🎪", name: "All-Around",        desc: "Master a skill on every event",          check: (s) => s.eventsWithMastered >= 4 },
  { id: "perfectionist",   icon: "💎", name: "Perfectionist",     desc: "Master all skills at your level",        check: (s) => s.totalMastered >= s.totalSkills && s.totalSkills > 0 },
  // Conditioning milestones
  { id: "first_workout",   icon: "💪", name: "First Rep",         desc: "Complete your first workout",            check: (s) => s.totalWorkoutDays >= 1 },
  { id: "five_days",       icon: "🔥", name: "On Fire",           desc: "Complete 5 workout days",                check: (s) => s.totalWorkoutDays >= 5 },
  { id: "full_day",        icon: "✅", name: "Beast Mode",        desc: "Complete all exercises in one day",      check: (s) => s.fullCompleteDays >= 1 },
  { id: "ten_full",        icon: "🏋️", name: "Iron Will",         desc: "10 full completion days",                check: (s) => s.fullCompleteDays >= 10 },
  // Streak badges
  { id: "streak_3",        icon: "🔥", name: "Warming Up",        desc: "3-day training streak",                  check: (s) => s.bestStreak >= 3 },
  { id: "streak_7",        icon: "🌊", name: "Weekly Warrior",    desc: "7-day training streak",                  check: (s) => s.bestStreak >= 7 },
  { id: "streak_14",       icon: "⚡", name: "Fortnight Force",   desc: "14-day training streak",                 check: (s) => s.bestStreak >= 14 },
  { id: "streak_30",       icon: "👑", name: "Unstoppable",       desc: "30-day training streak",                 check: (s) => s.bestStreak >= 30 },
  // XP milestones
  { id: "xp_500",          icon: "🥉", name: "Bronze Grind",      desc: "Earn 500 XP",                            check: (s) => s.totalXP >= 500 },
  { id: "xp_2000",         icon: "🥈", name: "Silver Hustle",     desc: "Earn 2,000 XP",                          check: (s) => s.totalXP >= 2000 },
  { id: "xp_5000",         icon: "🥇", name: "Gold Grind",        desc: "Earn 5,000 XP",                          check: (s) => s.totalXP >= 5000 },
  // Special
  { id: "early_bird",      icon: "🌅", name: "Early Bird",        desc: "Log a workout before 8 AM",              check: (s) => s.earlyBird },
  { id: "comeback",        icon: "🦅", name: "Comeback Kid",      desc: "Train again after a 7-day break",        check: (s) => s.comeback },
  { id: "consistent_3ev",  icon: "🎯", name: "Well-Rounded",      desc: "Reach Consistent on 3+ skills per event",check: (s) => s.eventsWithConsistent >= 4 },
];

function getXPLevel(xp) {
  let lvl = XP_LEVELS[0];
  for (const l of XP_LEVELS) { if (xp >= l.min) lvl = l; }
  return lvl;
}

function getNextXPLevel(xp) {
  for (const l of XP_LEVELS) { if (xp < l.min) return l; }
  return null;
}

function computeStats(skillProgress, profileLevel) {
  // Skill stats
  const skills = SKILLS_BY_LEVEL[profileLevel] || {};
  const allSkills = Object.values(skills).flat();
  const totalSkills = allSkills.length;
  const prog = skillProgress[profileLevel] || {};
  const totalMastered = allSkills.filter(s => (prog[s] || 0) >= 4).length;
  const eventsWithMastered = Object.entries(skills).filter(([, evSkills]) =>
    evSkills.some(s => (prog[s] || 0) >= 4)
  ).length;
  const eventsWithConsistent = Object.entries(skills).filter(([, evSkills]) =>
    evSkills.filter(s => (prog[s] || 0) >= 3).length >= 3
  ).length;

  // Conditioning stats from localStorage
  const TOTAL_EX = STRETCHES.length + CONDITIONING.length;
  let totalWorkoutDays = 0, fullCompleteDays = 0, bestStreak = 0, currentStreak = 0;
  let earlyBird = false, comeback = false;
  const today = new Date(); today.setHours(0,0,0,0);

  // collect all conditioning keys
  const condDays = [];
  for (const key of lsKeys()) {
    if (!key || !key.startsWith("conditioning_")) continue;
    const dateStr = key.replace("conditioning_", "");
    const d = new Date(dateStr); d.setHours(0,0,0,0);
    if (isNaN(d.getTime())) continue;
    try {
      const arr = JSON.parse(lsGet(key) || "[]");
      if (arr.length > 0) { totalWorkoutDays++; condDays.push({ d, count: arr.length }); }
      if (arr.length === TOTAL_EX) fullCompleteDays++;
    } catch(_) {}
  }
  condDays.sort((a, b) => a.d - b.d);

  // Streaks
  let streak = 0, maxStreak = 0;
  const daySet = new Set(condDays.filter(x => x.count === TOTAL_EX).map(x => x.d.toDateString()));
  for (let i = 0; i <= 365; i++) {
    const d2 = new Date(today); d2.setDate(today.getDate() - i);
    if (daySet.has(d2.toDateString())) { streak++; maxStreak = Math.max(maxStreak, streak); }
    else if (i > 0) break;
  }
  currentStreak = streak;
  // best streak ever
  let runStreak = 0;
  const sortedFull = condDays.filter(x => x.count === TOTAL_EX).sort((a,b) => a.d - b.d);
  for (let i = 0; i < sortedFull.length; i++) {
    if (i === 0) { runStreak = 1; }
    else {
      const diff = (sortedFull[i].d - sortedFull[i-1].d) / 86400000;
      runStreak = diff === 1 ? runStreak + 1 : 1;
    }
    bestStreak = Math.max(bestStreak, runStreak);
  }

  // Comeback: had a 7-day gap then worked out again
  for (let i = 1; i < condDays.length; i++) {
    const gap = (condDays[i].d - condDays[i-1].d) / 86400000;
    if (gap >= 7) { comeback = true; break; }
  }

  // XP calculation
  let totalXP = 0;
  // Skills XP
  allSkills.forEach(s => {
    const p = prog[s] || 0;
    if (p === 1) totalXP += XP_VALUES.SKILL_LEARNING;
    else if (p === 2) totalXP += XP_VALUES.SKILL_DEVELOPING;
    else if (p === 3) totalXP += XP_VALUES.SKILL_CONSISTENT;
    else if (p === 4) totalXP += XP_VALUES.SKILL_MASTERED;
  });
  // Conditioning XP
  condDays.forEach(({ count }) => {
    totalXP += count * XP_VALUES.EXERCISE_DONE;
    if (count === TOTAL_EX) totalXP += XP_VALUES.DAILY_COMPLETE;
  });
  // Streak bonuses
  if (bestStreak >= 3)  totalXP += XP_VALUES.STREAK_3;
  if (bestStreak >= 7)  totalXP += XP_VALUES.STREAK_7;
  if (bestStreak >= 14) totalXP += XP_VALUES.STREAK_14;
  if (bestStreak >= 30) totalXP += XP_VALUES.STREAK_30;

  return { totalXP, totalMastered, totalSkills, eventsWithMastered, eventsWithConsistent, totalWorkoutDays, fullCompleteDays, bestStreak, currentStreak, earlyBird, comeback };
}

function checkBadges(stats, earnedBadgeIds) {
  const newlyEarned = [];
  for (const badge of BADGES) {
    if (!earnedBadgeIds.includes(badge.id) && badge.check(stats)) {
      newlyEarned.push(badge);
    }
  }
  return newlyEarned;
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

// In-memory fallback for when localStorage isn't available (Claude artifact sandbox)
const _memStore = {};  // always-current in-memory mirror of localStorage
const _hasLS = (() => { try { localStorage.setItem('__t','1'); localStorage.removeItem('__t'); return true; } catch { return false; } })();

// lsGet: prefer _memStore (always up-to-date even before deferred flush),
// fall back to localStorage (for values written before this session), then null.
const lsGet = (key) => {
  if (key in _memStore) return _memStore[key];
  if (_hasLS) { try { const v = localStorage.getItem(key); if (v !== null) { _memStore[key] = v; return v; } } catch {} }
  return null;
};

// lsSet: write to _memStore immediately (so lsGet always returns latest),
// then flush to localStorage in a deferred task so it never blocks the UI (INP fix).
const _lsPending = {};
let _lsScheduled = false;
const lsFlush = () => {
  _lsScheduled = false;
  for (const k of Object.keys(_lsPending)) {
    const v = _lsPending[k];
    delete _lsPending[k];
    if (_hasLS) { try { localStorage.setItem(k, v); } catch (_) {} }
  }
};
const lsSet = (key, val) => {
  _memStore[key] = val;   // synchronous — always readable immediately
  if (_hasLS) {
    _lsPending[key] = val;
    if (!_lsScheduled) { _lsScheduled = true; setTimeout(lsFlush, 0); }
  }
};
const lsKeys = () => {
  const keys = new Set(Object.keys(_memStore));
  if (_hasLS) { try { for (let i = 0; i < localStorage.length; i++) keys.add(localStorage.key(i)); } catch {} }
  return Array.from(keys);
};

function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = lsGet(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const save = useCallback((v) => {
    // Write to in-memory store synchronously so it survives navigation/unmount,
    // then flush to localStorage in a deferred task to avoid blocking the UI (INP fix).
    const serialised = JSON.stringify(v);
    _memStore[key] = serialised;          // immediately readable by any component
    setVal(v);
    lsSet(key, serialised);               // batched deferred write to disk
  }, [key]);
  return [val, save];
}

function Confetti({ show }) {
  if (!show) return null;
  const pieces = Array.from({ length: 48 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: ["#c97fd4", "#e6b740", "#5dc8a0", "#e07b54", "#7ecef5"][i % 5],
    size: 8 + Math.random() * 8,
    rotate: Math.random() * 360,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.left}%`, top: "-20px",
          width: p.size, height: p.size, background: p.color,
          borderRadius: i % 3 === 0 ? "50%" : "2px",
          transform: `rotate(${p.rotate}deg)`,
          animation: `fall 2.5s ${p.delay}s ease-in forwards`,
        }} />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}

// ── EMOJI & SKIN TONE SYSTEM ─────────────────────────────────────────────────

const SKIN_TONES = [
  { label: "Default",      mod: "",       swatch: "#FFCC66" },
  { label: "Light",        mod: "\u{1F3FB}", swatch: "#FFDBB4" },
  { label: "Medium-Light", mod: "\u{1F3FC}", swatch: "#E8B88A" },
  { label: "Medium",       mod: "\u{1F3FD}", swatch: "#C68642" },
  { label: "Medium-Dark",  mod: "\u{1F3FE}", swatch: "#8D5524" },
  { label: "Dark",         mod: "\u{1F3FF}", swatch: "#4A2912" },
];

// Emojis that support skin tone modifiers
const SKIN_TONE_EMOJIS = [
  "🤸","🧘","🤾","🏊","🚴","🤺","🥊","🙋","🙆","💪","🤝","👏","🫶","🤜","✌️","👋","🫰","🤙","🤟","🫵","🤳","🧗","🏃","🚶","🧍","🧎","🤼","🥋","⛹️","🏌️","🏇","🤽","🧜","🧝","🛀","🛌","💆","💇","🚣","🏄","🤿",
];
// Emojis that do NOT take skin tone
const NEUTRAL_EMOJIS = [
  "⭐","🌟","💫","✨","🔥","💥","🎯","🏅","🥇","🏆","🎀","💜","💛","❤️","🧡","💙","💚","🖤","🤍","💗","💪","🦋","🌸","🌺","🌻","🌈","⚡","🌊","🍀","🎵","🎶","🎪","🎭","🎨","🦁","🐯","🐺","🦊","🦄","🐉","🦅","🦋","🌙","☀️","⭐","🪐","🎆","🎇","✦","❋","🏵️","🎗️","🎖️","🌠","💎","👑","🔮","🧿","🪬",
];

function applyTone(emoji, tone) {
  if (!tone || !SKIN_TONE_EMOJIS.some(e => e === emoji)) return emoji;
  // Insert tone modifier after the base emoji codepoint
  const cp = [...emoji][0];
  return cp + tone;
}

// ── Global skin-tone store — updated by App, read anywhere via t() ────────────
// This avoids prop-drilling skinTone into every component.
let _globalSkinTone = "";
const _toneListeners = new Set();
function setGlobalSkinTone(tone) {
  if (tone === _globalSkinTone) return;
  _globalSkinTone = tone;
  _toneListeners.forEach(fn => fn(tone));
}
function useSkinTone() {
  const [tone, setTone] = useState(_globalSkinTone);
  useEffect(() => {
    _toneListeners.add(setTone);
    return () => _toneListeners.delete(setTone);
  }, []);
  return tone;
}
// Convenience: t(emoji) applies the current global tone — call inside render
function t(emoji) { return applyTone(emoji, _globalSkinTone); }

function EmojiPicker({ value, tone, onSelect, onToneChange, compact = false }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("gymnast");

  const TABS = [
    { id: "gymnast", label: "🤸 Sport", emojis: SKIN_TONE_EMOJIS },
    { id: "neutral", label: "⭐ All",   emojis: NEUTRAL_EMOJIS },
  ];

  const displayed = (() => {
    const pool = tab === "gymnast" ? SKIN_TONE_EMOJIS : NEUTRAL_EMOJIS;
    const withTone = pool.map(e => ({ base: e, display: applyTone(e, tone) }));
    if (!search.trim()) return withTone;
    return withTone.filter(({ base, display }) =>
      base.includes(search) || display.includes(search)
    );
  })();

  return (
    <div>
      {/* Skin tone row */}
      <div style={{ marginBottom: compact ? 10 : 14 }}>
        <p style={{ color: "var(--muted-text)", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Skin Tone</p>
        <div style={{ display: "flex", gap: 6 }}>
          {SKIN_TONES.map(st => (
            <button key={st.label} onClick={() => onToneChange && onToneChange(st.mod)}
              title={st.label}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: st.swatch,
                border: `3px solid ${tone === st.mod ? "var(--accent)" : "transparent"}`,
                cursor: "pointer", padding: 0, transition: "border .15s",
                boxShadow: tone === st.mod ? "0 0 0 1px var(--accent)" : "none"
              }} />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "6px 14px", borderRadius: 8,
            border: `1px solid ${tab === t.id ? "var(--accent)" : "var(--border)"}`,
            background: tab === t.id ? "var(--accent-dim)" : "var(--input-bg)",
            color: tab === t.id ? "var(--accent)" : "var(--muted-text)",
            cursor: "pointer", fontSize: 12, fontWeight: tab === t.id ? 700 : 400
          }}>{t.label}</button>
        ))}
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
        style={{ width: "100%", padding: "8px 12px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 13, marginBottom: 10, boxSizing: "border-box" }} />

      {/* Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxHeight: compact ? 120 : 180, overflowY: "auto", paddingBottom: 2 }}>
        {displayed.map(({ base, display }) => (
          <button key={base} onClick={() => onSelect(display)}
            style={{
              width: 40, height: 40, borderRadius: 9, fontSize: 22, cursor: "pointer",
              background: value === display ? "var(--accent-dim)" : "var(--input-bg)",
              border: `2px solid ${value === display ? "var(--accent)" : "transparent"}`,
              transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center"
            }}>{display}</button>
        ))}
      </div>
    </div>
  );
}



// ── SCREEN ICON EDITOR ────────────────────────────────────────────────────────
// A small floating button that lets users pick a custom icon + skin tone for
// any screen. Usage: <ScreenIconButton screenKey="skills" profile={profile} onUpdateProfile={onUpdateProfile} />
function ScreenIconButton({ screenKey, defaultIcon, profile, onUpdateProfile }) {
  const [open, setOpen] = useState(false);
  const currentIcon = (profile.screenIcons || {})[screenKey] || defaultIcon;
  const tone = profile.skinTone || "";

  const handleSelect = (emoji) => {
    onUpdateProfile({
      ...profile,
      screenIcons: { ...(profile.screenIcons || {}), [screenKey]: emoji }
    });
    setOpen(false);
  };

  const handleTone = (t) => {
    onUpdateProfile({ ...profile, skinTone: t });
  };

  return (
    <>
      <button onClick={() => setOpen(true)} title="Customize icon"
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: 0.5, padding: "2px 4px", lineHeight: 1 }}
        aria-label="Edit screen icon">
        {t(currentIcon)}✏️
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 4000 }}>
          <div style={{ background: "var(--card)", borderRadius: "22px 22px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 480, maxHeight: "75vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <p style={{ color: "var(--text)", fontWeight: 700, fontSize: 16, fontFamily: "var(--font-display)" }}>Customize Icon</p>
                <p style={{ color: "var(--muted-text)", fontSize: 11, marginTop: 2 }}>Current: <span style={{ fontSize: 18 }}>{t(currentIcon)}</span></p>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "var(--input-bg)", border: "none", borderRadius: 8, color: "var(--muted-text)", width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
            <EmojiPicker value={currentIcon} tone={tone} onSelect={handleSelect} onToneChange={handleTone} compact />
          </div>
        </div>
      )}
    </>
  );
}

// ── SCREENS ──────────────────────────────────────────────────────────────────

// ONBOARDING
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [color, setColor] = useState("#c97fd4");
  const [emoji, setEmoji] = useState("🤸");
  const [skinTone, setSkinTone] = useState("");

  const COLORS = ["#c97fd4","#e07b54","#e6b740","#5dc8a0","#7ecef5","#e87fa0","#6fbff5","#a0d468","#ff6b9d","#a78bfa"];

  const canNext = [name.trim().length > 0, level !== "", true];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--card)", borderRadius: 24, padding: "40px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
        {/* progress dots */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i <= step ? "var(--accent)" : "var(--muted)", transition: "all .3s" }} />
          ))}
        </div>

        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{t("🤸")}</div>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 28, marginBottom: 8 }}>Welcome, Gymnast!</h2>
            <p style={{ color: "var(--muted-text)", marginBottom: 28, fontSize: 14 }}>Let's set up your personal training hub.</p>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="What's your name?"
              style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "2px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 16, outline: "none", boxSizing: "border-box" }}
            />
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 24, textAlign: "center", marginBottom: 6 }}>What level do you compete?</h2>
            <p style={{ color: "var(--muted-text)", textAlign: "center", marginBottom: 20, fontSize: 13 }}>This personalizes your skill tracker.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 300, overflowY: "auto" }}>
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)} style={{
                  padding: "12px 8px", borderRadius: 10, border: `2px solid ${level === l ? "var(--accent)" : "var(--border)"}`,
                  background: level === l ? "var(--accent-dim)" : "var(--input-bg)",
                  color: level === l ? "var(--accent)" : "var(--muted-text)", cursor: "pointer",
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: level === l ? 700 : 400, transition: "all .2s"
                }}>{l}</button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 22, marginBottom: 4, textAlign: "center" }}>Make it yours!</h2>
            <p style={{ color: "var(--muted-text)", marginBottom: 18, fontSize: 13, textAlign: "center" }}>Pick your color, skin tone, and icon.</p>

            {/* Accent color */}
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Accent Color</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setColor(c)} style={{
                  width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer",
                  outline: color === c ? "3px solid white" : "none", outlineOffset: 2,
                  boxShadow: color === c ? `0 0 0 4px ${c}55` : "none", transition: "all .2s"
                }} />
              ))}
            </div>

            {/* Icon picker with skin tone */}
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Your Icon</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, background: "var(--input-bg)", borderRadius: 12, padding: "12px 16px" }}>
              <span style={{ fontSize: 40 }}>{emoji}</span>
              <div>
                <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>Selected icon</p>
                <p style={{ color: "var(--muted-text)", fontSize: 11 }}>Tap any below to change</p>
              </div>
            </div>
            <EmojiPicker value={emoji} tone={skinTone} onSelect={setEmoji} onToneChange={setSkinTone} compact />
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: 1, padding: "14px", borderRadius: 12, border: "2px solid var(--border)",
              background: "transparent", color: "var(--muted-text)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 15
            }}>Back</button>
          )}
          <button
            disabled={!canNext[step]}
            onClick={() => step < 2 ? setStep(s => s + 1) : onComplete({ name: name.trim(), level, accentColor: color, icon: emoji, skinTone })}
            style={{
              flex: 2, padding: "14px", borderRadius: 12, border: "none",
              background: canNext[step] ? color : "var(--muted)", color: "#fff",
              cursor: canNext[step] ? "pointer" : "not-allowed", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700
            }}
          >{step < 2 ? "Continue →" : "Let's Go! 🚀"}</button>
        </div>
      </div>
    </div>
  );
}

// QUOTE POPUP
function QuotePopup({ onClose }) {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
      <div style={{ background: "var(--card)", borderRadius: 24, padding: 36, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
        <p style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 20, lineHeight: 1.5, marginBottom: 16 }}>"{q.text}"</p>
        <p style={{ color: "var(--accent)", fontSize: 13, marginBottom: 24 }}>— {q.author}</p>
        <button onClick={onClose} style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 15 }}>💜 Thanks!</button>
      </div>
    </div>
  );
}

// HOME

// ── SETTINGS SCREEN ───────────────────────────────────────────────────────────
function SettingsScreen({ profile, onUpdateProfile, onNavigate }) {
  const COLORS = ["#c97fd4","#e07b54","#e6b740","#5dc8a0","#7ecef5","#e87fa0","#6fbff5","#a0d468","#ff6b9d","#a78bfa"];
  const GREETING_OPTIONS = ["Good Morning / Afternoon / Evening", "Hey", "Welcome back", "Hello", "What's up", "Let's go"];

  // Draft state — only committed on Save
  const [draftName, setDraftName] = useState(profile.name || "");
  const [draftLevel, setDraftLevel] = useState(profile.level || "");
  const [draftGreeting, setDraftGreeting] = useState(profile.customGreeting || "");
  const [draftAccent, setDraftAccent] = useState(profile.accentColor || "#c97fd4");
  const [draftIcon, setDraftIcon] = useState(profile.icon || "🤸");
  const [draftTone, setDraftTone] = useState(profile.skinTone || "");
  const [draftHero, setDraftHero] = useState(profile.heroImage || null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleHeroUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setHeroUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => { setDraftHero(ev.target.result); setHeroUploading(false); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const save = () => {
    onUpdateProfile({
      ...profile,
      name: draftName.trim() || profile.name,
      level: draftLevel || profile.level,
      customGreeting: draftGreeting,
      accentColor: draftAccent,
      icon: draftIcon,
      skinTone: draftTone,
      heroImage: draftHero,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const SECTIONS = [
    { id: "profile", label: "👤 Profile", icon: "👤" },
    { id: "appearance", label: "🎨 Appearance", icon: "🎨" },
    { id: "greeting", label: "💬 Greeting", icon: "💬" },
    { id: "level", label: "🏅 Level", icon: "🏅" },
  ];

  return (
    <div style={{ padding: "24px 18px 80px", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button onClick={() => onNavigate("home")} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--muted-text)", width: 36, height: 36, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 24 }}>⚙️ Settings</h2>
      </div>

      {/* Section pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            padding: "8px 14px", borderRadius: 20, fontSize: 12, fontWeight: activeSection === s.id ? 700 : 400, whiteSpace: "nowrap",
            border: `1px solid ${activeSection === s.id ? "var(--accent)" : "var(--border)"}`,
            background: activeSection === s.id ? "var(--accent-dim)" : "var(--input-bg)",
            color: activeSection === s.id ? "var(--accent)" : "var(--muted-text)", cursor: "pointer"
          }}>{s.label}</button>
        ))}
      </div>

      {/* ── PROFILE ── */}
      {activeSection === "profile" && (
        <div style={{ background: "var(--card)", borderRadius: 20, padding: "22px 20px", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 17, marginBottom: 18 }}>Profile Info</h3>
          <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Display Name</p>
          <input value={draftName} onChange={e => setDraftName(e.target.value)} placeholder="Your name"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "2px solid var(--accent)", background: "var(--input-bg)", color: "var(--text)", fontSize: 15, marginBottom: 18, boxSizing: "border-box" }} />
          
          <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Profile Icon</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, background: "var(--input-bg)", borderRadius: 12, padding: "12px 16px" }}>
            <span style={{ fontSize: 40 }}>{t(draftIcon)}</span>
            <div>
              <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>Your icon</p>
              <p style={{ color: "var(--muted-text)", fontSize: 11 }}>Pick from the grid below</p>
            </div>
          </div>
          <EmojiPicker value={draftIcon} tone={draftTone} onSelect={setDraftIcon} onToneChange={setDraftTone} compact />

          <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, marginTop: 18 }}>Hero Photo</p>
          {draftHero ? (
            <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 10, height: 130 }}>
              <img src={draftHero} alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => setDraftHero(null)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "none", borderRadius: 8, color: "#fff", padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>Remove</button>
            </div>
          ) : (
            <div style={{ height: 80, borderRadius: 14, border: "2px dashed var(--border)", background: "var(--input-bg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, gap: 8 }}>
              <span style={{ fontSize: 22 }}>🖼️</span><span style={{ color: "var(--muted-text)", fontSize: 13 }}>No hero photo</span>
            </div>
          )}
          <label style={{ display: "block", cursor: "pointer" }}>
            <input type="file" accept="image/*" onChange={handleHeroUpload} style={{ display: "none" }} />
            <div style={{ padding: "11px", borderRadius: 10, background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--muted-text)", textAlign: "center", fontSize: 13 }}>
              {heroUploading ? "Uploading…" : "📷 Upload Photo"}
            </div>
          </label>
        </div>
      )}

      {/* ── APPEARANCE ── */}
      {activeSection === "appearance" && (
        <div style={{ background: "var(--card)", borderRadius: 20, padding: "22px 20px", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 17, marginBottom: 18 }}>Theme & Colors</h3>
          <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Accent Color</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            {COLORS.map(c => (
              <div key={c} onClick={() => setDraftAccent(c)} style={{
                width: 38, height: 38, borderRadius: "50%", background: c, cursor: "pointer",
                outline: draftAccent === c ? "3px solid white" : "none", outlineOffset: 2,
                boxShadow: draftAccent === c ? `0 0 0 5px ${c}55` : "none", transition: "all .2s"
              }} />
            ))}
          </div>
          <div style={{ background: "var(--input-bg)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 8 }}>Preview</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: draftAccent + "33", border: `2px solid ${draftAccent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{t(draftIcon)}</div>
              <div style={{ height: 8, flex: 1, borderRadius: 4, background: draftAccent }} />
              <div style={{ padding: "4px 12px", borderRadius: 20, background: draftAccent, color: "#fff", fontSize: 11, fontWeight: 700 }}>Accent</div>
            </div>
          </div>
        </div>
      )}

      {/* ── GREETING ── */}
      {activeSection === "greeting" && (
        <div style={{ background: "var(--card)", borderRadius: 20, padding: "22px 20px", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 17, marginBottom: 6 }}>Customize Greeting</h3>
          <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>Choose how you're greeted on the home screen. Leaving it blank uses the default time-based greeting.</p>

          <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Presets</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {GREETING_OPTIONS.map(g => (
              <button key={g} onClick={() => setDraftGreeting(g === "Good Morning / Afternoon / Evening" ? "" : g)}
                style={{
                  padding: "12px 16px", borderRadius: 12, textAlign: "left", cursor: "pointer", fontSize: 14,
                  border: `2px solid ${(g === "Good Morning / Afternoon / Evening" ? !draftGreeting : draftGreeting === g) ? "var(--accent)" : "var(--border)"}`,
                  background: (g === "Good Morning / Afternoon / Evening" ? !draftGreeting : draftGreeting === g) ? "var(--accent-dim)" : "var(--input-bg)",
                  color: (g === "Good Morning / Afternoon / Evening" ? !draftGreeting : draftGreeting === g) ? "var(--accent)" : "var(--text)"
                }}>
                {g}
              </button>
            ))}
          </div>

          <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Custom Greeting</p>
          <input value={draftGreeting} onChange={e => setDraftGreeting(e.target.value)} placeholder="Type your own…"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "2px solid var(--accent)", background: "var(--input-bg)", color: "var(--text)", fontSize: 15, boxSizing: "border-box", marginBottom: 12 }} />
          
          <div style={{ background: "var(--input-bg)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 4 }}>Preview</p>
            <p style={{ color: "var(--text)", fontFamily: "var(--font-display)", fontSize: 16 }}>
              {draftGreeting || "Good Morning"}, {draftName || profile.name}! {t(draftIcon)}
            </p>
          </div>
        </div>
      )}

      {/* ── LEVEL ── */}
      {activeSection === "level" && (
        <div style={{ background: "var(--card)", borderRadius: 20, padding: "22px 20px", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 17, marginBottom: 6 }}>Competition Level</h3>
          <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 18, lineHeight: 1.5 }}>Changing your level will update your skill list. Your progress for each level is saved separately.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {LEVELS.map(l => (
              <button key={l} onClick={() => setDraftLevel(l)} style={{
                padding: "13px 16px", borderRadius: 12, textAlign: "left", cursor: "pointer", fontSize: 14, fontFamily: "var(--font-display)",
                border: `2px solid ${draftLevel === l ? "var(--accent)" : "var(--border)"}`,
                background: draftLevel === l ? "var(--accent-dim)" : "var(--input-bg)",
                color: draftLevel === l ? "var(--accent)" : "var(--text)",
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <span>{l}</span>
                {draftLevel === l && <span style={{ fontSize: 16 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Save button */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px", background: "var(--bg)", borderTop: "1px solid var(--border)", maxWidth: 480, margin: "0 auto", display: "flex", gap: 10, zIndex: 200 }}>
        <button onClick={save} style={{
          flex: 1, padding: "14px", borderRadius: 14, border: "none",
          background: saved ? "#5dc8a0" : "var(--accent)", color: "#fff",
          cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
          transition: "background .3s"
        }}>{saved ? "✓ Saved!" : "Save Settings"}</button>
      </div>
    </div>
  );
}

function Home({ profile, onUpdateProfile, onNavigate }) {
  const [showQuote, setShowQuote] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTab, setEditTab] = useState("profile"); // "profile" | "icon" | "hero"
  const [newAffirmation, setNewAffirmation] = useState("");
  const [affirmations, setAffirmations] = useStorage("affirmations", [
    "I am strong and capable.", "I trust my training.", "Every practice makes me better.", "I fly with grace and power."
  ]);

  // Local edit state
  const [draftName, setDraftName] = useState(profile.name);
  const [draftIcon, setDraftIcon] = useState(profile.icon || "🤸");
  const [draftTone, setDraftTone] = useState(profile.skinTone || "");
  const [draftHeroImage, setDraftHeroImage] = useState(profile.heroImage || null);
  const [draftAccent, setDraftAccent] = useState(profile.accentColor || "#c97fd4");
  const [heroUploading, setHeroUploading] = useState(false);

  const COLORS = ["#c97fd4","#e07b54","#e6b740","#5dc8a0","#7ecef5","#e87fa0","#6fbff5","#a0d468","#ff6b9d","#a78bfa"];

  const hour = new Date().getHours();
  const defaultGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const greeting = profile.customGreeting || defaultGreeting;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const addAffirmation = () => {
    if (newAffirmation.trim()) { setAffirmations([...affirmations, newAffirmation.trim()]); setNewAffirmation(""); }
  };
  const removeAffirmation = (i) => setAffirmations(affirmations.filter((_, idx) => idx !== i));

  const openEdit = (tab = "profile") => {
    setDraftName(profile.name);
    setDraftIcon(profile.icon || "🤸");
    setDraftTone(profile.skinTone || "");
    setDraftHeroImage(profile.heroImage || null);
    setDraftAccent(profile.accentColor || "#c97fd4");
    setEditTab(tab);
    setEditing(true);
  };

  const saveEdit = () => {
    onUpdateProfile({ ...profile, name: draftName.trim() || profile.name, icon: draftIcon, skinTone: draftTone, heroImage: draftHeroImage, accentColor: draftAccent });
    setEditing(false);
  };

  const handleHeroUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => { setDraftHeroImage(ev.target.result); setHeroUploading(false); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const randomAffirmation = affirmations[Math.floor(Date.now() / 60000) % affirmations.length];
  const heroImg = profile.heroImage;

  return (
    <div style={{ padding: "0 0 24px", maxWidth: 480, margin: "0 auto" }}>
      {showQuote && <QuotePopup onClose={() => setShowQuote(false)} />}

      {/* ── Hero card ── */}
      <div style={{
        position: "relative", overflow: "hidden", borderRadius: "0 0 24px 24px",
        marginBottom: 20, minHeight: 200,
        background: heroImg ? "transparent" : "linear-gradient(135deg, var(--accent-dim) 0%, var(--card) 100%)"
      }}>
        {heroImg && (
          <>
            <img src={heroImg} alt="hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)" }} />
          </>
        )}
        {!heroImg && <div style={{ position: "absolute", top: -20, right: -20, fontSize: 120, opacity: 0.1, userSelect: "none" }}>{t(profile.icon)}</div>}

        <div style={{ position: "relative", padding: "28px 22px 22px" }}>
          <p style={{ color: heroImg ? "rgba(255,255,255,0.75)" : "var(--muted-text)", fontSize: 12, marginBottom: 4 }}>{today}</p>
          <h1 style={{ fontFamily: "var(--font-display)", color: heroImg ? "#fff" : "var(--text)", fontSize: 26, marginBottom: 4, lineHeight: 1.2 }}>
            {greeting}, {profile.name}! {t(profile.icon)}
          </h1>
          <p style={{ color: heroImg ? "rgba(255,255,255,0.85)" : "var(--accent)", fontSize: 13, fontStyle: "italic", marginTop: 6, lineHeight: 1.4 }}>"{randomAffirmation}"</p>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => openEdit("profile")} style={{ padding: "7px 14px", borderRadius: 9, border: `1px solid ${heroImg ? "rgba(255,255,255,0.35)" : "var(--border)"}`, background: "rgba(0,0,0,0.3)", color: heroImg ? "#fff" : "var(--muted-text)", cursor: "pointer", fontSize: 11, backdropFilter: "blur(4px)" }}>✏️ Personalize</button>
            <button onClick={() => openEdit("hero")} style={{ padding: "7px 14px", borderRadius: 9, border: `1px solid ${heroImg ? "rgba(255,255,255,0.35)" : "var(--border)"}`, background: "rgba(0,0,0,0.3)", color: heroImg ? "#fff" : "var(--muted-text)", cursor: "pointer", fontSize: 11, backdropFilter: "blur(4px)" }}>🖼️ {heroImg ? "Change Photo" : "Add Photo"}</button>
            <button onClick={() => onNavigate && onNavigate("settings")} style={{ padding: "7px 14px", borderRadius: 9, border: `1px solid ${heroImg ? "rgba(255,255,255,0.35)" : "var(--border)"}`, background: "rgba(0,0,0,0.3)", color: heroImg ? "#fff" : "var(--muted-text)", cursor: "pointer", fontSize: 11, backdropFilter: "blur(4px)" }}>⚙️ Settings</button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* ── Personalize Modal ── */}
        {editing && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 2000 }}>
            <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: "28px 22px 44px", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}>

              {/* Modal header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 20 }}>Personalize</h3>
                <button onClick={() => setEditing(false)} style={{ background: "var(--input-bg)", border: "none", borderRadius: 8, color: "var(--muted-text)", width: 34, height: 34, cursor: "pointer", fontSize: 20 }}>×</button>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
                {[["profile","👤 Profile"],["icon","🤸 Icon"],["hero","🖼️ Hero Photo"],["theme","🎨 Theme"]].map(([t, label]) => (
                  <button key={t} onClick={() => setEditTab(t)} style={{
                    flex: 1, padding: "8px 4px", borderRadius: 10, fontSize: 10, fontWeight: editTab === t ? 700 : 400,
                    border: `1px solid ${editTab === t ? "var(--accent)" : "var(--border)"}`,
                    background: editTab === t ? "var(--accent-dim)" : "var(--input-bg)",
                    color: editTab === t ? "var(--accent)" : "var(--muted-text)", cursor: "pointer"
                  }}>{label}</button>
                ))}
              </div>

              {/* ── Profile tab ── */}
              {editTab === "profile" && (
                <div>
                  <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Display Name</p>
                  <input value={draftName} onChange={e => setDraftName(e.target.value)} placeholder="Your name"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "2px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 15, marginBottom: 20, boxSizing: "border-box" }} />
                  <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Competition Level</p>
                  <div style={{ background: "var(--input-bg)", borderRadius: 10, padding: "10px 14px", marginBottom: 6, border: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 15 }}>{profile.level}</span>
                    <span style={{ color: "var(--muted-text)", fontSize: 11, marginLeft: 8 }}>(change in settings)</span>
                  </div>
                </div>
              )}

              {/* ── Icon tab ── */}
              {editTab === "icon" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, background: "var(--input-bg)", borderRadius: 12, padding: "12px 16px" }}>
                    <span style={{ fontSize: 42 }}>{t(draftIcon)}</span>
                    <div>
                      <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>Your current icon</p>
                      <p style={{ color: "var(--muted-text)", fontSize: 11 }}>Tap any emoji below to change it</p>
                    </div>
                  </div>
                  <EmojiPicker
                    value={draftIcon}
                    tone={draftTone}
                    onSelect={setDraftIcon}
                    onToneChange={setDraftTone}
                  />
                </div>
              )}

              {/* ── Hero Photo tab ── */}
              {editTab === "hero" && (
                <div>
                  <p style={{ color: "var(--muted-text)", fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>
                    Upload a photo to display as your home screen hero — a competition photo, team pic, or anything that inspires you.
                  </p>

                  {/* Preview */}
                  {draftHeroImage ? (
                    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", marginBottom: 14, height: 160 }}>
                      <img src={draftHeroImage} alt="hero preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5))" }} />
                      <button onClick={() => setDraftHeroImage(null)}
                        style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "none", borderRadius: 8, color: "#fff", padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{ height: 120, borderRadius: 16, border: "2px dashed var(--border)", background: "var(--input-bg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 32 }}>🖼️</span>
                      <span style={{ color: "var(--muted-text)", fontSize: 12 }}>No photo set</span>
                    </div>
                  )}

                  <label style={{ display: "block", cursor: "pointer" }}>
                    <input type="file" accept="image/*" onChange={handleHeroUpload} style={{ display: "none" }} />
                    <div style={{ padding: "13px", borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", textAlign: "center", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                      {heroUploading ? "Uploading…" : draftHeroImage ? "📷 Change Photo" : "📷 Upload Photo"}
                    </div>
                  </label>
                </div>
              )}

              {/* ── Theme tab ── */}
              {editTab === "theme" && (
                <div>
                  <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Accent Color</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                    {COLORS.map(c => (
                      <div key={c} onClick={() => setDraftAccent(c)} style={{
                        width: 36, height: 36, borderRadius: "50%", background: c, cursor: "pointer",
                        outline: draftAccent === c ? "3px solid white" : "none", outlineOffset: 2,
                        boxShadow: draftAccent === c ? `0 0 0 5px ${c}55` : "none", transition: "all .2s"
                      }} />
                    ))}
                  </div>
                  <div style={{ background: "var(--input-bg)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border)" }}>
                    <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 6 }}>Preview</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: draftAccent + "33", border: `2px solid ${draftAccent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{t(draftIcon)}</div>
                      <div style={{ height: 8, flex: 1, borderRadius: 4, background: draftAccent }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Save / Cancel */}
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button onClick={() => setEditing(false)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
                <button onClick={saveEdit} style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>Save Changes ✓</button>
              </div>
            </div>
          </div>
        )}

        {/* Quote button */}
        <button onClick={() => setShowQuote(true)} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "2px dashed var(--accent)", background: "transparent", color: "var(--accent)", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 20, transition: "all .2s" }}>✨ Get Inspired — Daily Quote</button>

        {/* Affirmations */}
        <div style={{ background: "var(--card)", borderRadius: 20, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 18, marginBottom: 16 }}>💬 My Affirmations</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {affirmations.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--input-bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
                <span style={{ color: "var(--accent)", fontSize: 14 }}>💜</span>
                <span style={{ flex: 1, color: "var(--text)", fontSize: 14 }}>{a}</span>
                <button onClick={() => removeAffirmation(i)} style={{ background: "none", border: "none", color: "var(--muted-text)", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newAffirmation} onChange={e => setNewAffirmation(e.target.value)} onKeyDown={e => e.key === "Enter" && addAffirmation()} placeholder="Add your own affirmation..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "2px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14 }} />
            <button onClick={addAffirmation} style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontSize: 16 }}>+</button>
          </div>
        </div>

        {/* Level badge */}
        <div style={{ background: "var(--card)", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏅</div>
          <div>
            <p style={{ color: "var(--muted-text)", fontSize: 12, marginBottom: 2 }}>Competing at</p>
            <p style={{ color: "var(--text)", fontFamily: "var(--font-display)", fontSize: 18 }}>{profile.level}</p>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onNavigate && onNavigate("judge")} style={{ flex: 1, padding: "14px 12px", borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>⚖️</div>
            <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)" }}>ScoreVision</div>
            <div style={{ color: "var(--muted-text)", fontSize: 10, marginTop: 2 }}>Get a critique</div>
          </button>
          <button onClick={() => onNavigate && onNavigate("planner")} style={{ flex: 1, padding: "14px 12px", borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>📅</div>
            <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)" }}>Plan</div>
            <div style={{ color: "var(--muted-text)", fontSize: 10, marginTop: 2 }}>Schedule skills</div>
          </button>
          <button onClick={() => onNavigate && onNavigate("videos")} style={{ flex: 1, padding: "14px 12px", borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🎬</div>
            <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)" }}>Videos</div>
            <div style={{ color: "var(--muted-text)", fontSize: 10, marginTop: 2 }}>Library</div>
          </button>
        </div>
        {/* Meets quick-link */}
        <div style={{ marginTop: 8 }}>
          <button onClick={() => onNavigate && onNavigate("meets")} style={{ width: "100%", padding: "16px 18px", borderRadius: 16, border: "1.5px solid var(--accent)", background: "var(--accent-dim)", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 36 }}>🏅</div>
            <div>
              <div style={{ color: "var(--text)", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)" }}>Competition Calendar</div>
              <div style={{ color: "var(--muted-text)", fontSize: 11, marginTop: 2 }}>Track meets, set goals & log scores</div>
            </div>
            <div style={{ marginLeft: "auto", color: "var(--accent)", fontSize: 18 }}>›</div>
          </button>
        </div>
      </div>
    </div>
  );
}


// ── COMPETITION MEET CALENDAR ─────────────────────────────────────────────────

const EVENTS_4 = ["Vault", "Bars", "Beam", "Floor"];
const EVENT_COLORS_MEET = { Vault: "#e07b54", Bars: "#7ecef5", Beam: "#e6b740", Floor: "#5dc8a0" };

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr + "T00:00:00"); d.setHours(0,0,0,0);
  return Math.round((d - today) / 86400000);
}

function fmtDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function CountdownBadge({ days }) {
  if (days < 0) return <span style={{ background: "#3a3a5a", color: "var(--muted-text)", borderRadius: 8, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>Past</span>;
  if (days === 0) return <span style={{ background: "#e07b5422", color: "#e07b54", borderRadius: 8, padding: "2px 10px", fontSize: 11, fontWeight: 700, border: "1px solid #e07b54" }}>TODAY 🔥</span>;
  if (days <= 7) return <span style={{ background: "#e6b74022", color: "#e6b740", borderRadius: 8, padding: "2px 10px", fontSize: 11, fontWeight: 700, border: "1px solid #e6b740" }}>{days}d away ⚡</span>;
  if (days <= 30) return <span style={{ background: "var(--accent-dim)", color: "var(--accent)", borderRadius: 8, padding: "2px 10px", fontSize: 11, fontWeight: 700, border: "1px solid var(--accent)" }}>{days} days</span>;
  return <span style={{ background: "var(--input-bg)", color: "var(--muted-text)", borderRadius: 8, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>{days} days</span>;
}

function ScoreTrend({ meets, event }) {
  const scored = meets.filter(m => m.completed && m.scores?.[event] != null).map(m => ({ name: m.name, date: m.date, score: parseFloat(m.scores[event]) })).filter(m => !isNaN(m.score)).sort((a, b) => a.date.localeCompare(b.date));
  if (scored.length < 2) return null;
  const min = Math.min(...scored.map(s => s.score));
  const max = Math.max(...scored.map(s => s.score));
  const pad = Math.max(0.5, (max - min) * 0.2);
  const lo = Math.max(0, min - pad), hi = max + pad;
  const W = 260, H = 70;
  const px = (i) => (i / (scored.length - 1)) * (W - 24) + 12;
  const py = (v) => H - 8 - ((v - lo) / (hi - lo || 1)) * (H - 16);
  const pts = scored.map((s, i) => `${px(i)},${py(s.score)}`).join(" ");
  const latest = scored[scored.length - 1].score;
  const prev = scored[scored.length - 2].score;
  const delta = latest - prev;
  const color = EVENT_COLORS_MEET[event] || "var(--accent)";
  return (
    <div style={{ background: "var(--input-bg)", borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ color, fontSize: 12, fontWeight: 700 }}>{event}</span>
        <span style={{ color: delta >= 0 ? "#5dc8a0" : "#e07b54", fontSize: 11, fontWeight: 700 }}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(3)}</span>
      </div>
      <svg width={W} height={H} style={{ display: "block", overflow: "visible" }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {scored.map((s, i) => (
          <g key={i}>
            <circle cx={px(i)} cy={py(s.score)} r={4} fill={color} />
            <text x={px(i)} y={py(s.score) - 8} textAnchor="middle" fill="var(--muted-text)" fontSize="9">{s.score.toFixed(3)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MeetCard({ meet, onEdit, onComplete, onDelete, onViewResults }) {
  const days = daysUntil(meet.date);
  const isUpcoming = !meet.completed;
  const urgent = days >= 0 && days <= 7 && isUpcoming;
  return (
    <div style={{
      background: "var(--card)", borderRadius: 20, padding: "18px 18px 14px",
      border: `1.5px solid ${urgent ? "#e6b740" : meet.completed ? "#5dc8a044" : "var(--border)"}`,
      marginBottom: 12, position: "relative", overflow: "hidden",
      boxShadow: urgent ? "0 0 20px #e6b74018" : "none", transition: "all .2s"
    }}>
      {urgent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #e6b740, #e07b54)" }} />}
      {meet.completed && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #5dc8a0, var(--accent))" }} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 17, margin: 0 }}>{meet.name}</h3>
            {meet.completed
              ? <span style={{ background: "#5dc8a022", color: "#5dc8a0", borderRadius: 8, padding: "2px 9px", fontSize: 10, fontWeight: 700, border: "1px solid #5dc8a040" }}>✓ Complete</span>
              : <CountdownBadge days={days} />
            }
          </div>
          <p style={{ color: "var(--muted-text)", fontSize: 12, margin: 0 }}>📍 {meet.location || "TBD"} · {fmtDate(meet.date)}</p>
        </div>
        <div style={{ display: "flex", gap: 6, marginLeft: 8, flexShrink: 0 }}>
          <button onClick={() => onEdit(meet)} style={{ background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--muted-text)", width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>✏️</button>
          <button onClick={() => onDelete(meet.id)} style={{ background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--muted-text)", width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>🗑️</button>
        </div>
      </div>

      {meet.goals && (
        <div style={{ background: "var(--input-bg)", borderRadius: 10, padding: "8px 12px", marginBottom: 8 }}>
          <p style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.6 }}>Goals</p>
          <p style={{ color: "var(--text)", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{meet.goals}</p>
        </div>
      )}

      {meet.notes && (
        <div style={{ background: "var(--input-bg)", borderRadius: 10, padding: "8px 12px", marginBottom: 8 }}>
          <p style={{ color: "var(--muted-text)", fontSize: 11, fontWeight: 700, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.6 }}>Notes</p>
          <p style={{ color: "var(--text)", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{meet.notes}</p>
        </div>
      )}

      {meet.completed && meet.scores && Object.keys(meet.scores).length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {EVENTS_4.map(ev => meet.scores[ev] != null && (
            <div key={ev} style={{ background: EVENT_COLORS_MEET[ev] + "22", borderRadius: 8, padding: "4px 10px", border: `1px solid ${EVENT_COLORS_MEET[ev]}44` }}>
              <span style={{ color: EVENT_COLORS_MEET[ev], fontSize: 10, fontWeight: 700 }}>{ev}</span>
              <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 700, marginLeft: 6 }}>{parseFloat(meet.scores[ev]).toFixed(3)}</span>
            </div>
          ))}
          {meet.scores.AA != null && (
            <div style={{ background: "var(--accent-dim)", borderRadius: 8, padding: "4px 10px", border: "1px solid var(--accent)" }}>
              <span style={{ color: "var(--accent)", fontSize: 10, fontWeight: 700 }}>AA</span>
              <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 700, marginLeft: 6 }}>{parseFloat(meet.scores.AA).toFixed(3)}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        {!meet.completed && (
          <button onClick={() => onComplete(meet)} style={{
            flex: 1, padding: "9px 0", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #5dc8a0, #3aaa80)", color: "#fff",
            cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)"
          }}>✓ Mark Complete & Enter Scores</button>
        )}
        {meet.completed && (
          <button onClick={() => onViewResults(meet)} style={{
            flex: 1, padding: "9px 0", borderRadius: 10, border: "1px solid var(--border)",
            background: "transparent", color: "var(--muted-text)",
            cursor: "pointer", fontSize: 12
          }}>📊 View / Edit Results</button>
        )}
      </div>
    </div>
  );
}

function MeetFormModal({ meet, onSave, onClose }) {
  const [name, setName] = useState(meet?.name || "");
  const [date, setDate] = useState(meet?.date || "");
  const [location, setLocation] = useState(meet?.location || "");
  const [goals, setGoals] = useState(meet?.goals || "");
  const [notes, setNotes] = useState(meet?.notes || "");
  const isEdit = !!meet?.id;

  const valid = name.trim() && date;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 3000 }}>
      <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: "28px 22px 44px", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 20 }}>{isEdit ? "Edit Meet" : "Add Competition"}</h3>
          <button onClick={onClose} style={{ background: "var(--input-bg)", border: "none", borderRadius: 8, color: "var(--muted-text)", width: 34, height: 34, cursor: "pointer", fontSize: 20 }}>×</button>
        </div>

        <label style={{ display: "block", marginBottom: 16 }}>
          <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Meet Name *</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. State Championship 2025"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${name.trim() ? "var(--accent)" : "var(--border)"}`, background: "var(--input-bg)", color: "var(--text)", fontSize: 15, boxSizing: "border-box" }} />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <label>
            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Date *</p>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ width: "100%", padding: "11px 12px", borderRadius: 10, border: `2px solid ${date ? "var(--accent)" : "var(--border)"}`, background: "var(--input-bg)", color: "var(--text)", fontSize: 14, boxSizing: "border-box", colorScheme: "dark" }} />
          </label>
          <label>
            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Location</p>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Venue…"
              style={{ width: "100%", padding: "11px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, boxSizing: "border-box" }} />
          </label>
        </div>

        <label style={{ display: "block", marginBottom: 16 }}>
          <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Goals for this meet</p>
          <textarea value={goals} onChange={e => setGoals(e.target.value)} placeholder="What do you want to achieve? (e.g. hit all routines, score 36+ AA)"
            rows={3} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, resize: "vertical", boxSizing: "border-box", fontFamily: "var(--font-body)" }} />
        </label>

        <label style={{ display: "block", marginBottom: 24 }}>
          <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Notes / Reminders</p>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Warmup time, what to pack, coach reminders…"
            rows={3} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, resize: "vertical", boxSizing: "border-box", fontFamily: "var(--font-body)" }} />
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => valid && onSave({ name: name.trim(), date, location: location.trim(), goals: goals.trim(), notes: notes.trim() })}
            style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: valid ? "var(--accent)" : "var(--border)", color: valid ? "#fff" : "var(--muted-text)", cursor: valid ? "pointer" : "not-allowed", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, transition: "all .2s" }}>
            {isEdit ? "Save Changes ✓" : "Add Meet 🏆"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreModal({ meet, onSave, onClose }) {
  const [scores, setScores] = useState({ Vault: "", Bars: "", Beam: "", Floor: "", AA: "", ...Object.fromEntries(Object.entries(meet.scores || {}).map(([k,v]) => [k, v != null ? String(v) : ""])) });
  const [reflection, setReflection] = useState(meet.reflection || "");

  const setScore = (ev, val) => {
    const clean = val.replace(/[^0-9.]/g, "").slice(0, 7);
    const updated = { ...scores, [ev]: clean };
    // Auto-calc AA if all 4 events filled
    const evScores = EVENTS_4.map(e => parseFloat(updated[e])).filter(v => !isNaN(v));
    if (evScores.length === 4) updated.AA = evScores.reduce((a, b) => a + b, 0).toFixed(3);
    setScores(updated);
  };

  const hasAnyScore = Object.values(scores).some(v => v.trim() !== "" && !isNaN(parseFloat(v)));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 3000 }}>
      <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: "28px 22px 44px", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 20 }}>Enter Scores</h3>
          <button onClick={onClose} style={{ background: "var(--input-bg)", border: "none", borderRadius: 8, color: "var(--muted-text)", width: 34, height: 34, cursor: "pointer", fontSize: 20 }}>×</button>
        </div>
        <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 20 }}>{meet.name} · {fmtDate(meet.date)}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {EVENTS_4.map(ev => (
            <div key={ev}>
              <p style={{ color: EVENT_COLORS_MEET[ev], fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{ev}</p>
              <input
                type="number" min="0" max="20" step="0.001"
                value={scores[ev]} onChange={e => setScore(ev, e.target.value)}
                placeholder="0.000"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${scores[ev] ? EVENT_COLORS_MEET[ev] + "88" : "var(--border)"}`, background: "var(--input-bg)", color: "var(--text)", fontSize: 16, fontWeight: 700, boxSizing: "border-box", fontFamily: "var(--font-display)" }}
              />
            </div>
          ))}
        </div>

        <div style={{ background: "var(--input-bg)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--border)" }}>
          <span style={{ color: "var(--muted-text)", fontSize: 13 }}>All-Around Total</span>
          <span style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>
            {scores.AA || (EVENTS_4.every(e => scores[e]) ? EVENTS_4.reduce((sum, e) => sum + parseFloat(scores[e] || 0), 0).toFixed(3) : "—")}
          </span>
        </div>

        <label style={{ display: "block", marginBottom: 22 }}>
          <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Reflection & Notes</p>
          <textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="How did it go? What went well, what to work on…"
            rows={3} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, resize: "vertical", boxSizing: "border-box", fontFamily: "var(--font-body)" }} />
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onSave(scores, reflection)} disabled={!hasAnyScore}
            style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: hasAnyScore ? "linear-gradient(135deg, #5dc8a0, #3aaa80)" : "var(--border)", color: hasAnyScore ? "#fff" : "var(--muted-text)", cursor: hasAnyScore ? "pointer" : "not-allowed", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>
            Save Results ✓
          </button>
        </div>
      </div>
    </div>
  );
}

function CompetitionCalendar({ profile }) {
  const [meets, setMeets] = useStorage("meets", []);
  const [showForm, setShowForm] = useState(false);
  const [editingMeet, setEditingMeet] = useState(null);
  const [scoreModal, setScoreModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewTab, setViewTab] = useState("upcoming"); // upcoming | past | trends
  const [showConfetti, setShowConfetti] = useState(false);

  const upcoming = meets.filter(m => !m.completed).sort((a, b) => a.date.localeCompare(b.date));
  const past = meets.filter(m => m.completed).sort((a, b) => b.date.localeCompare(a.date));
  const nextMeet = upcoming[0];

  const addOrEdit = (data) => {
    if (editingMeet?.id) {
      setMeets(meets.map(m => m.id === editingMeet.id ? { ...m, ...data } : m));
    } else {
      setMeets([...meets, { id: Date.now().toString(), completed: false, scores: {}, ...data }]);
    }
    setShowForm(false); setEditingMeet(null);
  };

  const openEdit = (meet) => { setEditingMeet(meet); setShowForm(true); };

  const openComplete = (meet) => setScoreModal(meet);

  const saveScores = (scores, reflection) => {
    const cleaned = Object.fromEntries(Object.entries(scores).filter(([,v]) => v !== "" && !isNaN(parseFloat(v))).map(([k,v]) => [k, parseFloat(v)]));
    setMeets(meets.map(m => m.id === scoreModal.id ? { ...m, completed: true, scores: cleaned, reflection } : m));
    setScoreModal(null);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const deleteMeet = (id) => { setMeets(meets.filter(m => m.id !== id)); setDeleteConfirm(null); };

  const eventsWithTrend = EVENTS_4.filter(ev => past.filter(m => m.scores?.[ev] != null).length >= 2);

  return (
    <div style={{ padding: "20px 18px 32px", maxWidth: 480, margin: "0 auto" }}>
      <Confetti show={showConfetti} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 26, marginBottom: 2 }}>🏅 Competitions</h2>
          <p style={{ color: "var(--muted-text)", fontSize: 13 }}>{meets.length === 0 ? "No meets yet" : `${upcoming.length} upcoming · ${past.length} completed`}</p>
        </div>
        <button onClick={() => { setEditingMeet(null); setShowForm(true); }} style={{
          padding: "9px 16px", borderRadius: 12, border: "none", background: "var(--accent)",
          color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", marginTop: 4
        }}>+ Add Meet</button>
      </div>

      {/* Next Meet Countdown Hero */}
      {nextMeet && (
        <div style={{
          background: `linear-gradient(135deg, var(--accent-dim) 0%, var(--card) 100%)`,
          borderRadius: 20, padding: "20px 22px", marginTop: 16, marginBottom: 20,
          border: "1.5px solid var(--accent)", position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -16, right: -10, fontSize: 80, opacity: 0.07, userSelect: "none" }}>🏆</div>
          <p style={{ color: "var(--accent)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Next Competition</p>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 20, marginBottom: 4 }}>{nextMeet.name}</h3>
          <p style={{ color: "var(--muted-text)", fontSize: 12, marginBottom: 14 }}>📍 {nextMeet.location || "TBD"} · {fmtDate(nextMeet.date)}</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            {(() => {
              const d = daysUntil(nextMeet.date);
              if (d < 0) return <span style={{ color: "var(--muted-text)", fontSize: 15 }}>Meet has passed</span>;
              if (d === 0) return <span style={{ color: "#e07b54", fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700 }}>It's TODAY! 🔥</span>;
              return <>
                <span style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 700, lineHeight: 1 }}>{d}</span>
                <span style={{ color: "var(--muted-text)", fontSize: 15 }}>days away</span>
              </>;
            })()}
          </div>
          {nextMeet.goals && <p style={{ color: "var(--text)", fontSize: 12, marginTop: 10, fontStyle: "italic", opacity: 0.8 }}>🎯 "{nextMeet.goals}"</p>}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[["upcoming", `Upcoming (${upcoming.length})`], ["past", `Results (${past.length})`], ["trends", "📈 Trends"]].map(([tabId, label]) => (
          <button key={tabId} onClick={() => setViewTab(tabId)} style={{
            flex: 1, padding: "9px 6px", borderRadius: 12, fontSize: 11, fontWeight: viewTab === tabId ? 700 : 400,
            border: `1px solid ${viewTab === tabId ? "var(--accent)" : "var(--border)"}`,
            background: viewTab === tabId ? "var(--accent-dim)" : "var(--input-bg)",
            color: viewTab === tabId ? "var(--accent)" : "var(--muted-text)", cursor: "pointer"
          }}>{label}</button>
        ))}
      </div>

      {/* Upcoming tab */}
      {viewTab === "upcoming" && (
        <div>
          {upcoming.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", background: "var(--card)", borderRadius: 20, border: "2px dashed var(--border)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
              <p style={{ color: "var(--muted-text)", fontSize: 14, marginBottom: 16 }}>No upcoming meets yet.</p>
              <button onClick={() => { setEditingMeet(null); setShowForm(true); }} style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 14 }}>+ Add Your First Meet</button>
            </div>
          ) : (
            upcoming.map(m => <MeetCard key={m.id} meet={m} onEdit={openEdit} onComplete={openComplete} onDelete={setDeleteConfirm} onViewResults={setScoreModal} />)
          )}
        </div>
      )}

      {/* Past / Results tab */}
      {viewTab === "past" && (
        <div>
          {past.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", background: "var(--card)", borderRadius: 20, border: "2px dashed var(--border)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
              <p style={{ color: "var(--muted-text)", fontSize: 14 }}>No completed meets yet. Mark a meet as complete to log your scores.</p>
            </div>
          ) : (
            past.map(m => <MeetCard key={m.id} meet={m} onEdit={openEdit} onComplete={openComplete} onDelete={setDeleteConfirm} onViewResults={setScoreModal} />)
          )}
        </div>
      )}

      {/* Trends tab */}
      {viewTab === "trends" && (
        <div>
          {eventsWithTrend.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", background: "var(--card)", borderRadius: 20, border: "2px dashed var(--border)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📈</div>
              <p style={{ color: "var(--muted-text)", fontSize: 14 }}>Score trends will appear here after you complete at least 2 meets with scores for the same event.</p>
            </div>
          ) : (
            <div>
              <p style={{ color: "var(--muted-text)", fontSize: 12, marginBottom: 16 }}>Showing score progression across {past.length} completed meets</p>
              {/* AA trend */}
              {(() => {
                const scored = past.filter(m => m.scores?.AA != null).map(m => ({ name: m.name, date: m.date, score: parseFloat(m.scores.AA) })).filter(m => !isNaN(m.score)).sort((a,b) => a.date.localeCompare(b.date));
                if (scored.length < 2) return null;
                const min = Math.min(...scored.map(s => s.score)), max = Math.max(...scored.map(s => s.score));
                const pad = Math.max(0.5, (max-min)*0.2), lo = Math.max(0,min-pad), hi = max+pad;
                const W=260, H=80;
                const px=(i)=>(i/(scored.length-1))*(W-24)+12, py=(v)=>H-8-((v-lo)/(hi-lo||1))*(H-16);
                const pts=scored.map((s,i)=>`${px(i)},${py(s.score)}`).join(" ");
                const delta=scored[scored.length-1].score-scored[scored.length-2].score;
                return (
                  <div style={{ background: "var(--card)", borderRadius: 16, padding: "16px 18px", marginBottom: 14, border: "1.5px solid var(--accent)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ color: "var(--accent)", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)" }}>All-Around</span>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{scored[scored.length-1].score.toFixed(3)}</span>
                        <span style={{ color: delta >= 0 ? "#5dc8a0" : "#e07b54", fontSize: 11, marginLeft: 8 }}>{delta >= 0 ? "▲" : "▼"}{Math.abs(delta).toFixed(3)}</span>
                      </div>
                    </div>
                    <svg width={W} height={H} style={{ display: "block", overflow: "visible" }}>
                      <defs><linearGradient id="aaGrad" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4"/><stop offset="100%" stopColor="var(--accent)"/></linearGradient></defs>
                      <polyline points={pts} fill="none" stroke="url(#aaGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      {scored.map((s,i)=>(
                        <g key={i}>
                          <circle cx={px(i)} cy={py(s.score)} r={5} fill="var(--accent)"/>
                          <text x={px(i)} y={py(s.score)-10} textAnchor="middle" fill="var(--muted-text)" fontSize="9">{s.score.toFixed(1)}</text>
                        </g>
                      ))}
                    </svg>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      {scored.map((s,i) => <span key={i} style={{ color: "var(--muted-text)", fontSize: 9, textAlign: "center" }}>{s.name.slice(0,8)}</span>)}
                    </div>
                  </div>
                );
              })()}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {eventsWithTrend.map(ev => <ScoreTrend key={ev} meets={past} event={ev} />)}
              </div>

              {/* Personal bests */}
              <div style={{ background: "var(--card)", borderRadius: 16, padding: "16px 18px", marginTop: 4, border: "1px solid var(--border)" }}>
                <h4 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 15, marginBottom: 12 }}>🏆 Personal Bests</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[...EVENTS_4, "AA"].map(ev => {
                    const scores = past.filter(m => m.scores?.[ev] != null).map(m => parseFloat(m.scores[ev])).filter(v => !isNaN(v));
                    if (scores.length === 0) return null;
                    const best = Math.max(...scores);
                    const color = ev === "AA" ? "var(--accent)" : EVENT_COLORS_MEET[ev];
                    return (
                      <div key={ev} style={{ background: "var(--input-bg)", borderRadius: 10, padding: "10px 12px", border: `1px solid ${color}33` }}>
                        <p style={{ color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{ev}</p>
                        <p style={{ color: "var(--text)", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, margin: 0 }}>{best.toFixed(3)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showForm && <MeetFormModal meet={editingMeet} onSave={addOrEdit} onClose={() => { setShowForm(false); setEditingMeet(null); }} />}
      {scoreModal && <ScoreModal meet={scoreModal} onSave={saveScores} onClose={() => setScoreModal(null)} />}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: 24 }}>
          <div style={{ background: "var(--card)", borderRadius: 20, padding: "28px 24px", maxWidth: 340, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 18, marginBottom: 8 }}>Delete Meet?</h3>
            <p style={{ color: "var(--muted-text)", fontSize: 14, marginBottom: 22 }}>This will remove the meet and all its scores. This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => deleteMeet(deleteConfirm)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "#e07b54", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// DASHBOARD
function Dashboard({ profile, skillProgress, checkedToday }) {
  const skills = SKILLS_BY_LEVEL[profile.level] || {};
  const allSkills = Object.values(skills).flat();
  const totalSkills = allSkills.length;
  const masteredSkills = allSkills.filter(s => (skillProgress[profile.level]?.[s] || 0) >= 4).length;
  const inProgressSkills = allSkills.filter(s => { const p = skillProgress[profile.level]?.[s] || 0; return p > 0 && p < 4; }).length;
  const totalExercises = STRETCHES.length + CONDITIONING.length;
  const completedExercises = checkedToday.length;
  const skillPct = totalSkills > 0 ? Math.round((masteredSkills / totalSkills) * 100) : 0;
  const condPct = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  const eventColors = { Vault: "#e07b54", Bars: "#7ecef5", Beam: "#5dc8a0", Floor: "#c97fd4" };

  return (
    <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 26, marginBottom: 20 }}>📊 Dashboard</h2>

      {/* Big stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Skills Mastered", value: masteredSkills, total: totalSkills, color: "#c97fd4", icon: "⭐" },
          { label: "In Progress", value: inProgressSkills, total: totalSkills, color: "#e6b740", icon: "🔄" },
          { label: "Conditioning", value: completedExercises, total: totalExercises, color: "#5dc8a0", icon: "💪", suffix: "/" + totalExercises },
          { label: "Skill Progress", value: skillPct + "%", total: null, color: "#7ecef5", icon: "📈" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--card)", borderRadius: 18, padding: 20 }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{t(s.icon)}</div>
            <div style={{ fontFamily: "var(--font-display)", color: s.color, fontSize: 28, marginBottom: 2 }}>{s.value}{s.suffix || ""}</div>
            <div style={{ color: "var(--muted-text)", fontSize: 12 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 17, marginBottom: 16 }}>Overall Progress</h3>
        {[
          { label: "Skill Mastery", pct: skillPct, color: "#c97fd4" },
          { label: "Today's Conditioning", pct: condPct, color: "#5dc8a0" },
        ].map((b, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--muted-text)", fontSize: 13 }}>{b.label}</span>
              <span style={{ color: b.color, fontSize: 13, fontWeight: 700 }}>{b.pct}%</span>
            </div>
            <div style={{ height: 8, background: "var(--input-bg)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${b.pct}%`, background: b.color, borderRadius: 4, transition: "width .8s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* By event */}
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 17, marginBottom: 16 }}>Skills by Event</h3>
        {Object.entries(skills).map(([event, evSkills]) => {
          const mastered = evSkills.filter(s => (skillProgress[profile.level]?.[s] || 0) >= 4).length;
          const pct = evSkills.length > 0 ? Math.round((mastered / evSkills.length) * 100) : 0;
          const col = eventColors[event] || "var(--accent)";
          return (
            <div key={event} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: col, fontSize: 13, fontWeight: 700 }}>{event}</span>
                <span style={{ color: "var(--muted-text)", fontSize: 12 }}>{mastered}/{evSkills.length}</span>
              </div>
              <div style={{ height: 6, background: "var(--input-bg)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 3, transition: "width .8s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// SKILL TRACKER

// ── SKILL TRACKER EDITABLE SKILLS ────────────────────────────────────────────
// Storage key: "custom_skills_<level>" => { Vault: [...], Bars: [...], ... }
// Merges with SKILLS_BY_LEVEL defaults; custom flag on added skills.

function getCustomSkillsKey(level) { return "custom_skills_" + level; }

function useCustomSkills(level) {
  const defaults = SKILLS_BY_LEVEL[level] || {};
  const [custom, setCustom] = useStorage(getCustomSkillsKey(level), null);
  // custom is null means "use defaults"; {} means "empty overrides"
  const skills = custom || defaults;
  const resetToDefaults = () => setCustom(null);
  const saveSkills = (updated) => setCustom(updated);
  return [skills, saveSkills, resetToDefaults, custom !== null];
}

function SkillTracker({ profile, skillProgress, setSkillProgress, onXPGain, onUpdateProfile }) {
  const [activeEvent, setActiveEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const [customSkills, saveCustomSkills, resetSkills, isCustomized] = useCustomSkills(profile.level);
  const events = Object.keys(SKILLS_BY_LEVEL[profile.level] || {});

  const [editModal, setEditModal]     = useState(null);
  const [editDraft, setEditDraft]     = useState("");
  const [addModal, setAddModal]       = useState(null);
  const [addDraft, setAddDraft]       = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [resetConfirm, setResetConfirm]   = useState(false);
  const [editMode, setEditMode]       = useState(false);

  // Goals: { [level]: { [skill]: { target: stageNum, note: string, deadline: dateStr } } }
  const [skillGoals, setSkillGoals]   = useStorage("skill_goals", {});
  const [goalModal, setGoalModal]     = useState(null); // { skill, event }
  const [goalDraft, setGoalDraft]     = useState({ target: 4, note: "", deadline: "" });

  const SKILL_XP = [0, XP_VALUES.SKILL_LEARNING, XP_VALUES.SKILL_DEVELOPING, XP_VALUES.SKILL_CONSISTENT, XP_VALUES.SKILL_MASTERED];
  const SKILL_XP_LABELS = ["", "+25 XP", "+50 XP", "+100 XP", "+250 XP ⭐"];
  const eventColors = { Vault: "#e07b54", Bars: "#7ecef5", Beam: "#5dc8a0", Floor: "#c97fd4" };

  useEffect(() => { if (events.length && !activeEvent) setActiveEvent(events[0]); }, [profile.level]);

  const showToast = (xp, label) => { setToast({ xp, label }); setTimeout(() => setToast(null), 2200); };

  const setProgress = (skill, val) => {
    const lvl = profile.level;
    const oldVal = skillProgress[lvl]?.[skill] || 0;
    if (val === oldVal) return;
    setSkillProgress(prev => ({ ...prev, [lvl]: { ...(prev[lvl] || {}), [skill]: val } }));
    if (val > oldVal) {
      const xp = SKILL_XP[val] - SKILL_XP[oldVal];
      // Check if goal was just hit
      const goal = skillGoals[lvl]?.[skill];
      const goalHit = goal && val >= goal.target && oldVal < goal.target;
      showToast(xp, goalHit ? `🎯 Goal reached: ${skill}!` : val === 4 ? `${skill} MASTERED!` : `${PROGRESS_LABELS[val]}!`);
      onXPGain && onXPGain(xp);
    }
  };

  const getProgress = (skill) => skillProgress[profile.level]?.[skill] || 0;
  const getGoal    = (skill) => skillGoals[profile.level]?.[skill] || null;

  const openGoalModal = (skill, event) => {
    const existing = getGoal(skill);
    setGoalDraft(existing ? { ...existing } : { target: 4, note: "", deadline: "" });
    setGoalModal({ skill, event });
  };

  const saveGoal = () => {
    if (!goalModal) return;
    const lvl = profile.level;
    setSkillGoals(prev => ({
      ...prev,
      [lvl]: { ...(prev[lvl] || {}), [goalModal.skill]: { ...goalDraft } }
    }));
    setGoalModal(null);
  };

  const clearGoal = () => {
    if (!goalModal) return;
    const lvl = profile.level;
    setSkillGoals(prev => {
      const lv = { ...(prev[lvl] || {}) };
      delete lv[goalModal.skill];
      return { ...prev, [lvl]: lv };
    });
    setGoalModal(null);
  };

  const openEdit = (event, skillName) => { setEditDraft(skillName); setEditModal({ event, skillName }); };
  const saveEdit = () => {
    if (!editDraft.trim() || !editModal) return;
    const updated = { ...customSkills };
    const arr = [...(updated[editModal.event] || [])];
    const idx = arr.indexOf(editModal.skillName);
    if (idx !== -1) arr[idx] = editDraft.trim();
    updated[editModal.event] = arr;
    saveCustomSkills(updated);
    if (editDraft.trim() !== editModal.skillName) {
      const lvl = profile.level;
      setSkillProgress(prev => {
        const lp = { ...(prev[lvl] || {}) };
        lp[editDraft.trim()] = lp[editModal.skillName] || 0;
        delete lp[editModal.skillName];
        return { ...prev, [lvl]: lp };
      });
    }
    setEditModal(null);
  };

  const openAdd  = (event) => { setAddDraft(""); setAddModal(event); };
  const saveAdd  = () => {
    if (!addDraft.trim() || !addModal) return;
    const updated = { ...customSkills };
    updated[addModal] = [...(updated[addModal] || []), addDraft.trim()];
    saveCustomSkills(updated);
    setAddModal(null);
  };

  const doDelete = () => {
    if (!deleteConfirm) return;
    const updated = { ...customSkills };
    updated[deleteConfirm.event] = (updated[deleteConfirm.event] || []).filter(s => s !== deleteConfirm.skillName);
    saveCustomSkills(updated);
    setSkillProgress(prev => {
      const lp = { ...(prev[profile.level] || {}) };
      delete lp[deleteConfirm.skillName];
      return { ...prev, [profile.level]: lp };
    });
    setDeleteConfirm(null);
  };

  const allSkills   = Object.values(customSkills).flat();
  const mastered    = allSkills.filter(s => getProgress(s) === 4).length;
  const inProgress  = allSkills.filter(s => { const p = getProgress(s); return p > 0 && p < 4; }).length;
  const goalsSet    = allSkills.filter(s => !!getGoal(s)).length;
  const goalsHit    = allSkills.filter(s => { const g = getGoal(s); return g && getProgress(s) >= g.target; }).length;
  const currentEventSkills = activeEvent ? (customSkills[activeEvent] || []) : [];

  const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / 86400000);
  };

  return (
    <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
      {toast && (
        <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", background: "var(--card)", border: "2px solid var(--accent)", borderRadius: 50, padding: "10px 22px", zIndex: 9999, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "toastIn .25s ease", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 20 }}>✨</span>
          <span style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 14 }}>{toast.label}</span>
          <span style={{ background: "var(--accent)", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>+{toast.xp} XP</span>
        </div>
      )}
      <style>{`@keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(-12px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 26, flex: 1 }}>{(profile.screenIcons || {}).skills || "🎯"} Skill Tracker</h2>
          <ScreenIconButton screenKey="skills" defaultIcon="🎯" profile={profile} onUpdateProfile={onUpdateProfile} />
          <button onClick={() => setEditMode(e => !e)} style={{ padding: "6px 13px", borderRadius: 9, fontSize: 12, fontWeight: editMode ? 700 : 400, border: `1px solid ${editMode ? "var(--accent)" : "var(--border)"}`, background: editMode ? "var(--accent-dim)" : "var(--input-bg)", color: editMode ? "var(--accent)" : "var(--muted-text)", cursor: "pointer" }}>{editMode ? "✓ Done" : "✏️ Edit"}</button>
        </div>
        <p style={{ color: "var(--muted-text)", fontSize: 13 }}>{profile.level} · Track your skill development</p>
        {isCustomized && <button onClick={() => setResetConfirm(true)} style={{ fontSize: 11, color: "#e07b54", background: "none", border: "none", cursor: "pointer", padding: "2px 0", marginTop: 2, textDecoration: "underline" }}>Reset to defaults</button>}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {[
          { icon: "🏅", val: mastered,   label: "Mastered",    col: "var(--accent)" },
          { icon: "🔄", val: inProgress, label: "In Progress", col: "#e6b740" },
          { icon: "🎯", val: `${goalsHit}/${goalsSet}`, label: "Goals Hit",  col: "#5dc8a0" },
          { icon: "📋", val: allSkills.length, label: "Total", col: "var(--muted-text)" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: "var(--card)", borderRadius: 12, padding: "10px 6px", textAlign: "center", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 16, marginBottom: 2 }}>{t(s.icon)}</div>
            <div style={{ color: s.col, fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>{s.val}</div>
            <div style={{ color: "var(--muted-text)", fontSize: 9 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Event tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
        {events.map(ev => {
          const col = eventColors[ev] || "var(--accent)";
          const isActive = activeEvent === ev;
          const evSkills = customSkills[ev] || [];
          const evMastered = evSkills.filter(s => getProgress(s) === 4).length;
          const evGoals = evSkills.filter(s => !!getGoal(s)).length;
          return (
            <button key={ev} onClick={() => setActiveEvent(ev)} style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${isActive ? col : "var(--border)"}`, background: isActive ? `${col}22` : "var(--card)", color: isActive ? col : "var(--muted-text)", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 13, whiteSpace: "nowrap", fontWeight: isActive ? 700 : 400, transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span>{ev}</span>
              <span style={{ fontSize: 9, opacity: 0.8 }}>{evMastered}/{evSkills.length} ⭐{evGoals > 0 ? ` · ${evGoals} 🎯` : ""}</span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
        {PROGRESS_LABELS.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 7px", borderRadius: 20, background: PROGRESS_COLORS[i] + "22", border: `1px solid ${PROGRESS_COLORS[i]}40` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: PROGRESS_COLORS[i] }} />
            <span style={{ fontSize: 9, color: PROGRESS_COLORS[i] }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Skills list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {currentEventSkills.map((skill) => {
          const p     = getProgress(skill);
          const goal  = getGoal(skill);
          const col   = PROGRESS_COLORS[p];
          const isMastered = p === 4;
          const goalReached = goal && p >= goal.target;
          const days  = goal?.deadline ? daysUntil(goal.deadline) : null;
          return (
            <div key={skill} style={{ background: "var(--card)", borderRadius: 16, padding: "16px 18px", border: `2px solid ${isMastered ? col + "aa" : p > 0 ? col + "55" : "var(--border)"}`, boxShadow: isMastered ? `0 0 18px ${col}33` : "none", transition: "all .3s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: editMode ? 4 : 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                  {isMastered && !editMode && <span style={{ fontSize: 16, flexShrink: 0 }}>⭐</span>}
                  <span style={{ color: "var(--text)", fontSize: 15, fontWeight: 600, wordBreak: "break-word" }}>{skill}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 8 }}>
                  {!editMode && <span style={{ fontSize: 9, color: "#e6b740", opacity: p > 0 ? 1 : 0 }}>{SKILL_XP_LABELS[p]}</span>}
                  {!editMode && <span style={{ fontSize: 11, color: col, fontWeight: 700, background: col + "22", padding: "3px 8px", borderRadius: 20 }}>{PROGRESS_LABELS[p]}</span>}
                  {!editMode && (
                    <button onClick={() => openGoalModal(skill, activeEvent)}
                      title={goal ? "Edit goal" : "Set a goal"}
                      style={{ width: 26, height: 26, borderRadius: 7, border: `1px solid ${goal ? (goalReached ? "#5dc8a0" : "var(--accent)") : "var(--border)"}`, background: goal ? (goalReached ? "#5dc8a022" : "var(--accent-dim)") : "var(--input-bg)", color: goal ? (goalReached ? "#5dc8a0" : "var(--accent)") : "var(--muted-text)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>🎯</button>
                  )}
                  {editMode && (
                    <>
                      <button onClick={() => openEdit(activeEvent, skill)} style={{ background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 7, color: "var(--muted-text)", width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>✏️</button>
                      <button onClick={() => setDeleteConfirm({ event: activeEvent, skillName: skill })} style={{ background: "#e07b5422", border: "1px solid #e07b5444", borderRadius: 7, color: "#e07b54", width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>🗑️</button>
                    </>
                  )}
                </div>
              </div>

              {!editMode && (
                <>
                  {/* Progress bar */}
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {PROGRESS_LABELS.map((lbl, i) => (
                        <button key={i} onClick={() => setProgress(skill, i)} title={`${lbl}${i > 0 ? " (+" + (SKILL_XP[i] - SKILL_XP[Math.max(0,i-1)]) + " XP)" : ""}`}
                          style={{ flex: 1, height: 10, borderRadius: 5, border: "none", background: i <= p ? col : "var(--input-bg)", cursor: "pointer", transition: "all .2s", opacity: i <= p ? 1 : 0.35, transform: i === p ? "scaleY(1.3)" : "scaleY(1)", position: "relative" }} />
                      ))}
                    </div>
                    {/* Goal marker on bar */}
                    {goal && goal.target > 0 && goal.target <= 4 && (
                      <div style={{ position: "absolute", top: -3, left: `${((goal.target - 0.5) / 4) * 100}%`, transform: "translateX(-50%)", width: 3, height: 16, borderRadius: 2, background: goalReached ? "#5dc8a0" : "#e6b740", pointerEvents: "none" }} />
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 9, color: "var(--muted-text)" }}>Not Started</span>
                    <span style={{ fontSize: 9, color: isMastered ? col : "var(--muted-text)" }}>{isMastered ? "✓ Mastered" : "Mastered"}</span>
                  </div>

                  {/* Goal pill */}
                  {goal && (
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, background: goalReached ? "#5dc8a022" : "var(--accent-dim)", borderRadius: 20, padding: "3px 10px", border: `1px solid ${goalReached ? "#5dc8a066" : "var(--accent)44"}` }}>
                        <span style={{ fontSize: 11 }}>{goalReached ? "✅" : "🎯"}</span>
                        <span style={{ fontSize: 11, color: goalReached ? "#5dc8a0" : "var(--accent)", fontWeight: 600 }}>
                          Goal: {PROGRESS_LABELS[goal.target]}{goalReached ? " — Reached!" : ""}
                        </span>
                      </div>
                      {days !== null && !goalReached && (
                        <span style={{ fontSize: 10, color: days < 7 ? "#e07b54" : "var(--muted-text)" }}>
                          {days < 0 ? "⚠️ Overdue" : days === 0 ? "📅 Due today" : `📅 ${days}d left`}
                        </span>
                      )}
                      {goal.note && <span style={{ fontSize: 10, color: "var(--muted-text)", fontStyle: "italic" }}>"{goal.note}"</span>}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
        {editMode && (
          <button onClick={() => openAdd(activeEvent)} style={{ padding: "14px", borderRadius: 16, border: "2px dashed var(--accent)", background: "transparent", color: "var(--accent)", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 15, width: "100%", marginTop: 4 }}>+ Add Skill to {activeEvent}</button>
        )}
      </div>

      {/* ── Goal Modal ── */}
      {goalModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 3000 }}>
          <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: "28px 22px 44px", width: "100%", maxWidth: 480, boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 19 }}>🎯 Set Goal — {goalModal.skill}</h3>
              <button onClick={() => setGoalModal(null)} style={{ background: "var(--input-bg)", border: "none", borderRadius: 8, color: "var(--muted-text)", width: 34, height: 34, cursor: "pointer", fontSize: 20 }}>×</button>
            </div>

            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Target Stage</p>
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              {PROGRESS_LABELS.slice(1).map((lbl, i) => {
                const stageVal = i + 1;
                const sel = goalDraft.target === stageVal;
                return (
                  <button key={stageVal} onClick={() => setGoalDraft(d => ({ ...d, target: stageVal }))}
                    style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: `2px solid ${sel ? PROGRESS_COLORS[stageVal] : "var(--border)"}`, background: sel ? PROGRESS_COLORS[stageVal] + "22" : "var(--input-bg)", color: sel ? PROGRESS_COLORS[stageVal] : "var(--muted-text)", cursor: "pointer", fontSize: 10, fontWeight: sel ? 700 : 400, transition: "all .15s", textAlign: "center" }}>
                    {lbl}
                  </button>
                );
              })}
            </div>

            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Target Date (optional)</p>
            <input type="date" value={goalDraft.deadline}
              onChange={e => setGoalDraft(d => ({ ...d, deadline: e.target.value }))}
              style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, marginBottom: 14, boxSizing: "border-box", colorScheme: "dark" }} />

            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Note (optional)</p>
            <input value={goalDraft.note} onChange={e => setGoalDraft(d => ({ ...d, note: e.target.value }))}
              placeholder="e.g. Focus on pointed toes"
              style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, marginBottom: 20, boxSizing: "border-box" }} />

            <div style={{ display: "flex", gap: 8 }}>
              {getGoal(goalModal.skill) && (
                <button onClick={clearGoal} style={{ padding: "13px 16px", borderRadius: 12, border: "1px solid #e07b5444", background: "#e07b5411", color: "#e07b54", cursor: "pointer", fontSize: 13 }}>Clear</button>
              )}
              <button onClick={() => setGoalModal(null)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveGoal} style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>Save Goal 🎯</button>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 3000 }}>
          <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: "28px 22px 44px", width: "100%", maxWidth: 480, boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 19 }}>Edit Skill — {editModal.event}</h3>
              <button onClick={() => setEditModal(null)} style={{ background: "var(--input-bg)", border: "none", borderRadius: 8, color: "var(--muted-text)", width: 34, height: 34, cursor: "pointer", fontSize: 20 }}>×</button>
            </div>
            <input value={editDraft} onChange={e => setEditDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEdit()} style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: "2px solid var(--accent)", background: "var(--input-bg)", color: "var(--text)", fontSize: 15, marginBottom: 20, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditModal(null)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveEdit} disabled={!editDraft.trim()} style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: editDraft.trim() ? "var(--accent)" : "var(--border)", color: editDraft.trim() ? "#fff" : "var(--muted-text)", cursor: editDraft.trim() ? "pointer" : "not-allowed", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>Save ✓</button>
            </div>
          </div>
        </div>
      )}

      {addModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 3000 }}>
          <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: "28px 22px 44px", width: "100%", maxWidth: 480, boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 19 }}>Add Skill — {addModal}</h3>
              <button onClick={() => setAddModal(null)} style={{ background: "var(--input-bg)", border: "none", borderRadius: 8, color: "var(--muted-text)", width: 34, height: 34, cursor: "pointer", fontSize: 20 }}>×</button>
            </div>
            <input value={addDraft} onChange={e => setAddDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && saveAdd()} placeholder="e.g. Double Back Tuck" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: "2px solid var(--accent)", background: "var(--input-bg)", color: "var(--text)", fontSize: 15, marginBottom: 20, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setAddModal(null)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveAdd} disabled={!addDraft.trim()} style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: addDraft.trim() ? "var(--accent)" : "var(--border)", color: addDraft.trim() ? "#fff" : "var(--muted-text)", cursor: addDraft.trim() ? "pointer" : "not-allowed", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>Add Skill 🎯</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: 24 }}>
          <div style={{ background: "var(--card)", borderRadius: 20, padding: "28px 24px", maxWidth: 340, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🗑️</div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 18, marginBottom: 8 }}>Delete Skill?</h3>
            <p style={{ color: "var(--muted-text)", fontSize: 14, marginBottom: 8 }}>"{deleteConfirm.skillName}"</p>
            <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 22 }}>Progress and goals for this skill will also be removed.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={doDelete} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "#e07b54", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {resetConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: 24 }}>
          <div style={{ background: "var(--card)", borderRadius: 20, padding: "28px 24px", maxWidth: 340, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔄</div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 18, marginBottom: 8 }}>Reset to Defaults?</h3>
            <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 22 }}>Restores the default skill list for {profile.level}. Progress scores are kept.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setResetConfirm(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { resetSkills(); setResetConfirm(false); }} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700 }}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// CONDITIONING
const EMOJI_OPTIONS = ["🔄","🧘","🦋","🌉","🥞","📐","🧱","✂️","⭐","🏋️","🏹","💪","🙃","🦵","⬆️","🤸","🦘","🪵","🎯","🔥","⚡","🌊","🏃","🤾","🧗","🏊","🚴","🤺","🥊","🎽","🏅","💥","🌟","✨","🦾","🦿","💫","🎯","🎪","🎭"];

// Parse seconds from a sets string like "Hold 45 sec", "3×60 sec", "2×30s", "45s", "1 min"
function parseTimerSeconds(sets) {
  if (!sets) return null;
  const s = sets.toLowerCase();
  // Patterns: "X sec", "Xs", "X min", "X:XX"
  let m;
  m = s.match(/(\d+)\s*min/);
  if (m) return parseInt(m[1]) * 60;
  m = s.match(/(\d+)\s*s(?:ec)?(?:|$)/);
  if (m) return parseInt(m[1]);
  m = s.match(/(\d+):(\d{2})/);
  if (m) return parseInt(m[1]) * 60 + parseInt(m[2]);
  // "hold X" where X could be seconds
  m = s.match(/hold\s+(\d+)/);
  if (m) return parseInt(m[1]);
  return null;
}

// ── ExerciseTimer — full-screen overlay timer ──────────────────────────────
function ExerciseTimer({ item, onClose, onComplete }) {
  const totalSecs = parseTimerSeconds(item.sets) || 30;
  const [remaining, setRemaining] = useState(totalSecs);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useCallback(() => {}, []); // just to hold the ref
  const timerRef = { current: null };

  useEffect(() => {
    if (!running || finished) return;
    timerRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          setFinished(true);
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, finished]);

  const pct = (remaining / totalSecs) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}`;

  // SVG circular progress
  const R = 80;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;

  const accentColor = finished ? "#5dc8a0" : running ? "var(--accent)" : "#7ecef5";

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,9,20,0.97)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 5000, padding: 24
    }}>
      <style>{`@keyframes timerPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }`}</style>

      {/* Exercise info */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{t(item.icon)}</div>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 22, marginBottom: 4 }}>{item.name}</h2>
        <p style={{ color: "var(--muted-text)", fontSize: 14 }}>{item.sets}</p>
      </div>

      {/* Circular timer */}
      <div style={{ position: "relative", width: 200, height: 200, marginBottom: 36, animation: running && !finished ? "timerPulse 1s ease-in-out infinite" : "none" }}>
        <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle cx="100" cy="100" r={R} fill="none" stroke="var(--border)" strokeWidth="12" />
          {/* Progress */}
          <circle
            cx="100" cy="100" r={R} fill="none"
            stroke={finished ? "#5dc8a0" : "var(--accent)"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
            style={{ transition: "stroke-dasharray 0.9s linear, stroke 0.3s" }}
          />
        </svg>
        {/* Time display */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center"
        }}>
          {finished ? (
            <div style={{ fontSize: 48 }}>✅</div>
          ) : (
            <>
              <span style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: remaining >= 60 ? 36 : 48, fontWeight: 700, lineHeight: 1 }}>{timeStr}</span>
              <span style={{ color: "var(--muted-text)", fontSize: 11, marginTop: 4 }}>
                {running ? "remaining" : remaining === totalSecs ? "ready" : "paused"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Finished state */}
      {finished ? (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#5dc8a0", fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 20 }}>Time's up! Great work! 🔥</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => { setRemaining(totalSecs); setFinished(false); setRunning(false); }}
              style={{ padding: "13px 24px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", cursor: "pointer", fontSize: 14 }}>
              Repeat
            </button>
            <button onClick={() => { onComplete(); onClose(); }}
              style={{ padding: "13px 28px", borderRadius: 12, border: "none", background: "#5dc8a0", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>
              Mark Done ✓
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={onClose} style={{ padding: "12px 20px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-text)", cursor: "pointer", fontSize: 14 }}>✕ Close</button>
          <button onClick={() => setRunning(r => !r)}
            style={{
              width: 72, height: 72, borderRadius: "50%", border: "none",
              background: running ? "#e07b54" : "var(--accent)",
              color: "#fff", cursor: "pointer", fontSize: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 24px ${running ? "#e07b5466" : "var(--accent-dim)"}`,
              transition: "all .2s"
            }}>
            {running ? "⏸" : "▶"}
          </button>
          <button onClick={() => { setRemaining(totalSecs); setRunning(false); }}
            style={{ padding: "12px 20px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-text)", cursor: "pointer", fontSize: 14 }}>
            ↺ Reset
          </button>
        </div>
      )}
    </div>
  );
}

function Conditioning({ onXPGain, profile, onUpdateProfile }) {
  const [checked, setChecked] = useStorage("conditioning_" + new Date().toDateString(), []);
  const [customStretches, setCustomStretches] = useStorage("custom_stretches", STRETCHES);
  const [customConditioning, setCustomConditioning] = useStorage("custom_conditioning", CONDITIONING);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [tab, setTab] = useState("stretching");
  const [xpToast, setXpToast] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null); // item being timed

  // Edit modal state
  const [editModal, setEditModal] = useState(null); // { item, listType } | null
  const [editForm, setEditForm] = useState({ name: "", sets: "", icon: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null); // item id to confirm
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", sets: "", icon: "💪" });



  const stretches = customStretches.length > 0 ? customStretches : STRETCHES;
  const conditioning = customConditioning.length > 0 ? customConditioning : CONDITIONING;
  const items = tab === "stretching" ? stretches : conditioning;
  const setItems = tab === "stretching" ? setCustomStretches : setCustomConditioning;
  const total = stretches.length + conditioning.length;
  const allDone = checked.length === total;

  const fireToast = (xp, label) => {
    setXpToast({ xp, label });
    setTimeout(() => setXpToast(null), 2000);
  };

  const toggle = (id) => {
    const wasChecked = checked.includes(id);
    const next = wasChecked ? checked.filter(c => c !== id) : [...checked, id];
    setChecked(next);
    if (!wasChecked) {
      fireToast(XP_VALUES.EXERCISE_DONE, "Exercise done");
      onXPGain && onXPGain(XP_VALUES.EXERCISE_DONE);
    }
    if (next.length === total && !showCelebration) {
      setTimeout(() => { setShowCelebration(true); setConfetti(true); }, 200);
      setTimeout(() => setConfetti(false), 3000);
      fireToast(XP_VALUES.DAILY_COMPLETE, "Full day complete! 🔥");
      onXPGain && onXPGain(XP_VALUES.DAILY_COMPLETE);
    }
  };

  const openEdit = (item, e) => {
    e.stopPropagation();
    setEditForm({ name: item.name, sets: item.sets, icon: item.icon });
    setEditModal({ item, listType: tab });
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) return;
    setItems(prev => prev.map(i => i.id === editModal.item.id
      ? { ...i, name: editForm.name.trim(), sets: editForm.sets.trim(), icon: editForm.icon }
      : i
    ));
    setEditModal(null);
  };

  const confirmDelete = (id, e) => {
    e.stopPropagation();
    setDeleteConfirm(id);
  };

  const doDelete = () => {
    setItems(prev => prev.filter(i => i.id !== deleteConfirm));
    setChecked(prev => prev.filter(id => id !== deleteConfirm));
    setDeleteConfirm(null);
  };

  const addExercise = () => {
    if (!addForm.name.trim()) return;
    const prefix = tab === "stretching" ? "cs" : "cc";
    const newItem = {
      id: `${prefix}_${Date.now()}`,
      name: addForm.name.trim(),
      sets: addForm.sets.trim() || "3×10",
      icon: addForm.icon || "💪",
      custom: true,
    };
    setItems(prev => [...prev, newItem]);
    setAddForm({ name: "", sets: "", icon: "💪" });
    setShowAddForm(false);
  };

  const resetToDefaults = () => {
    const defaults = tab === "stretching" ? STRETCHES : CONDITIONING;
    setItems(defaults);
    setDeleteConfirm(null);
  };

  const pct = Math.round((checked.length / total) * 100);

  return (
    <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
      <Confetti show={confetti} />

      {/* Full-screen timer overlay */}
      {activeTimer && (
        <ExerciseTimer
          item={activeTimer}
          onClose={() => setActiveTimer(null)}
          onComplete={() => {
            if (!checked.includes(activeTimer.id)) toggle(activeTimer.id);
            setActiveTimer(null);
          }}
        />
      )}

      {/* XP Toast */}
      {xpToast && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: "var(--card)", border: "2px solid #5dc8a0", borderRadius: 50,
          padding: "9px 20px", zIndex: 9999, display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)", whiteSpace: "nowrap", animation: "toastIn .25s ease"
        }}>
          <span style={{ fontSize: 16 }}>{t("💪")}</span>
          <span style={{ color: "#5dc8a0", fontFamily: "var(--font-display)", fontSize: 13 }}>{xpToast.label}</span>
          <span style={{ background: "#5dc8a0", color: "#fff", borderRadius: 20, padding: "2px 9px", fontSize: 12, fontWeight: 700 }}>+{xpToast.xp} XP</span>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 2000, padding: "0 0 0 0" }}>
          <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 480, boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 20 }}>Edit Exercise</h3>
              <button onClick={() => setEditModal(null)} style={{ background: "var(--input-bg)", border: "none", borderRadius: 8, color: "var(--muted-text)", width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>×</button>
            </div>

            {/* Icon picker */}
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Icon</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18, maxHeight: 100, overflowY: "auto", padding: 4 }}>
              {EMOJI_OPTIONS.map(em => (
                <button key={em} onClick={() => setEditForm(f => ({ ...f, icon: em }))}
                  style={{ fontSize: 22, background: editForm.icon === em ? "var(--accent-dim)" : "var(--input-bg)", border: `2px solid ${editForm.icon === em ? "var(--accent)" : "transparent"}`, borderRadius: 8, width: 40, height: 40, cursor: "pointer", transition: "all .15s" }}>
                  {t(em)}
                </button>
              ))}
            </div>

            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Name</p>
            <input
              value={editForm.name}
              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 15, marginBottom: 14, boxSizing: "border-box" }}
              placeholder="Exercise name"
            />

            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Sets / Duration</p>
            <input
              value={editForm.sets}
              onChange={e => setEditForm(f => ({ ...f, sets: e.target.value }))}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 15, marginBottom: 8, boxSizing: "border-box" }}
              placeholder="e.g. 3×15 or Hold 60 sec"
            />
            {/* Live timer preview */}
            {parseTimerSeconds(editForm.sets) !== null ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, padding: "8px 12px", background: "#7ecef511", borderRadius: 10, border: "1px solid #7ecef533" }}>
                <span style={{ fontSize: 16 }}>⏱</span>
                <span style={{ color: "#7ecef5", fontSize: 13 }}>Timer detected: <strong>{parseTimerSeconds(editForm.sets)}s</strong> — a countdown will appear on the exercise card</span>
              </div>
            ) : (
              <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 18 }}>Tip: include "sec" or "min" to auto-enable a timer (e.g. "Hold 45 sec" or "3×60 sec")</p>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditModal(null)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={saveEdit} style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 24 }}>
          <div style={{ background: "var(--card)", borderRadius: 20, padding: 28, maxWidth: 320, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 18, marginBottom: 8 }}>Delete Exercise?</h3>
            <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 22 }}>
              {deleteConfirm === "__reset__"
                ? `Reset all ${tab === "stretching" ? "stretches" : "conditioning"} back to defaults? Your customizations will be lost.`
                : "This exercise will be removed from your list."}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={deleteConfirm === "__reset__" ? resetToDefaults : doDelete}
                style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "#e07b54", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                {deleteConfirm === "__reset__" ? "Reset" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <div style={{ background: "var(--card)", borderRadius: 28, padding: 40, textAlign: "center", maxWidth: 340, boxShadow: "0 0 60px var(--accent)" }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--accent)", fontSize: 28, marginBottom: 8 }}>BEAST MODE!</h2>
            <p style={{ color: "var(--text)", fontSize: 16, marginBottom: 6 }}>You crushed ALL your training today!</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, margin: "14px 0" }}>
              <div style={{ background: "var(--input-bg)", borderRadius: 12, padding: "10px 18px" }}>
                <div style={{ color: "#5dc8a0", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>+{total * XP_VALUES.EXERCISE_DONE + XP_VALUES.DAILY_COMPLETE}</div>
                <div style={{ color: "var(--muted-text)", fontSize: 10 }}>XP Earned</div>
              </div>
            </div>
            <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 24 }}>Your dedication is what champions are made of. 🌟</p>
            <button onClick={() => setShowCelebration(false)} style={{ padding: "14px 32px", borderRadius: 14, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 16 }}>Let's Go! 🚀</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 26 }}>{t((profile?.screenIcons || {}).conditioning || "💪")} Daily Training</h2>
        {profile && onUpdateProfile && (
          <ScreenIconButton screenKey="conditioning" defaultIcon="💪" profile={profile} onUpdateProfile={onUpdateProfile} />
        )}
      </div>
      <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 20 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>



      {/* Overall progress */}
      <div style={{ background: "var(--card)", borderRadius: 16, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "var(--text)", fontSize: 14, fontWeight: 600 }}>Daily Progress</span>
          <span style={{ color: allDone ? "#5dc8a0" : "var(--accent)", fontSize: 14, fontWeight: 700 }}>{checked.length}/{total} {allDone && "✓ Complete!"}</span>
        </div>
        <div style={{ height: 10, background: "var(--input-bg)", borderRadius: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: allDone ? "#5dc8a0" : "var(--accent)", borderRadius: 5, transition: "width .5s ease" }} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["stretching", "🧘", "Stretching", stretches], ["conditioning", "💪", "Conditioning", conditioning]].map(([tabId, icon, labelText, arr]) => {
          const done = arr.filter(i => checked.includes(i.id)).length;
          const isActive = tab === tabId;
          return (
            <button key={tabId} onClick={() => { setTab(tabId); setShowAddForm(false); }} style={{
              flex: 1, padding: "12px", borderRadius: 14, border: `2px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
              background: isActive ? "var(--accent-dim)" : "var(--card)", color: isActive ? "var(--accent)" : "var(--muted-text)",
              cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 14, transition: "all .2s"
            }}>
              <div>{t(icon)} {labelText}</div>
              <div style={{ fontSize: 11, marginTop: 2, opacity: 0.8 }}>{done}/{arr.length}</div>
            </button>
          );
        })}
      </div>

      {/* Exercise list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => {
          const done = checked.includes(item.id);
          const timerSecs = parseTimerSeconds(item.sets);
          const isTimed = timerSecs !== null;
          return (
            <div key={item.id} style={{ position: "relative" }}>
              <div onClick={() => toggle(item.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 12px 14px 16px",
                background: done ? "var(--accent-dim)" : "var(--card)", borderRadius: 16,
                border: `2px solid ${done ? "var(--accent)" : item.custom ? "var(--accent)55" : "var(--border)"}`,
                cursor: "pointer", transition: "all .2s", opacity: done ? 0.85 : 1
              }}>
                <div style={{ fontSize: 26, flexShrink: 0 }}>{t(item.icon)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ color: done ? "var(--accent)" : "var(--text)", fontSize: 15, fontWeight: 600, textDecoration: done ? "line-through" : "none" }}>{item.name}</span>
                    {item.custom && <span style={{ fontSize: 9, background: "var(--accent)33", color: "var(--accent)", borderRadius: 10, padding: "1px 6px", fontWeight: 700 }}>custom</span>}
                    {isTimed && <span style={{ fontSize: 9, background: "#7ecef522", color: "#7ecef5", borderRadius: 10, padding: "1px 6px", fontWeight: 700 }}>⏱ {timerSecs}s</span>}
                  </div>
                  <div style={{ color: "var(--muted-text)", fontSize: 12, marginTop: 2 }}>{item.sets}</div>
                </div>
                {/* Action buttons */}
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {isTimed && (
                    <button onClick={(e) => { e.stopPropagation(); setActiveTimer(item); }}
                      style={{
                        width: 34, height: 34, borderRadius: 9,
                        border: "2px solid #7ecef566",
                        background: "#7ecef511",
                        color: "#7ecef5", cursor: "pointer", fontSize: 16,
                        display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s",
                        fontWeight: 700
                      }}
                      title={`Start ${timerSecs}s timer`}>⏱</button>
                  )}
                  <button onClick={(e) => openEdit(item, e)} style={{
                    width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border)",
                    background: "var(--input-bg)", color: "var(--muted-text)", cursor: "pointer", fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s"
                  }}>✏️</button>
                  <button onClick={(e) => confirmDelete(item.id, e)} style={{
                    width: 30, height: 30, borderRadius: 8, border: "1px solid #e07b5444",
                    background: "#e07b5411", color: "#e07b54", cursor: "pointer", fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s"
                  }}>🗑️</button>
                </div>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, border: `2px solid ${done ? "var(--accent)" : "var(--border)"}`,
                  background: done ? "var(--accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 14, transition: "all .2s", flexShrink: 0
                }}>{done && "✓"}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add exercise form */}
      {showAddForm ? (
        <div style={{ background: "var(--card)", borderRadius: 16, padding: 18, marginTop: 12, border: "2px solid var(--accent)55" }}>
          <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 14 }}>New Exercise</p>

          {/* Emoji picker */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14, maxHeight: 88, overflowY: "auto" }}>
            {EMOJI_OPTIONS.map(em => (
              <button key={em} onClick={() => setAddForm(f => ({ ...f, icon: em }))}
                style={{ fontSize: 20, background: addForm.icon === em ? "var(--accent-dim)" : "var(--input-bg)", border: `2px solid ${addForm.icon === em ? "var(--accent)" : "transparent"}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", transition: "all .15s" }}>
                {t(em)}
              </button>
            ))}
          </div>

          <input
            value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Exercise name *"
            style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, marginBottom: 10, boxSizing: "border-box" }}
          />
          <input
            value={addForm.sets} onChange={e => setAddForm(f => ({ ...f, sets: e.target.value }))}
            placeholder="Sets / Duration  (e.g. 3×15 or Hold 60 sec)"
            style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, marginBottom: 8, boxSizing: "border-box" }}
          />
          {parseTimerSeconds(addForm.sets) !== null ? (
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, padding: "7px 11px", background: "#7ecef511", borderRadius: 9, border: "1px solid #7ecef533" }}>
              <span style={{ fontSize: 14 }}>⏱</span>
              <span style={{ color: "#7ecef5", fontSize: 12 }}>Timer: <strong>{parseTimerSeconds(addForm.sets)}s</strong> will be auto-enabled</span>
            </div>
          ) : (
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 10 }}>Add "sec" or "min" to enable a timer</p>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
            <button onClick={addExercise} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700 }}>Add Exercise</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={() => setShowAddForm(true)} style={{
            flex: 1, padding: "13px", borderRadius: 14, border: "2px dashed var(--accent)66",
            background: "transparent", color: "var(--accent)", cursor: "pointer", fontSize: 14, fontFamily: "var(--font-display)"
          }}>+ Add Exercise</button>
          <button onClick={() => setDeleteConfirm("__reset__")} style={{
            padding: "13px 16px", borderRadius: 14, border: "1px solid var(--border)",
            background: "var(--card)", color: "var(--muted-text)", cursor: "pointer", fontSize: 12
          }}>Reset</button>
        </div>
      )}
    </div>
  );
}

// ── VIDEO LIBRARY ────────────────────────────────────────────────────────────

const VIDEO_CATEGORIES = ["All", "Stretching", "Conditioning", "Vault", "Bars", "Beam", "Floor", "Drills", "Other"];

// ── YouTube helpers ───────────────────────────────────────────────────────────
function getYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2];
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
    }
  } catch (_) {}
  return null;
}
function getYouTubeThumbnail(ytId) {
  return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
}

// ── Module-level video blob store ─────────────────────────────────────────────
// Blob URLs are created immediately when the user picks a file and stored here.
// ── Video file store (module-level, survives re-renders) ─────────────────────
// Stores File objects by video id. Blob URLs created on demand, revoked on close.
const _fileMap = {};  // id -> File object

function vfSet(id, file) { _fileMap[id] = file; }
function vfGet(id)       { return _fileMap[id] || null; }
function vfHas(id)       { return !!_fileMap[id]; }
function vfDel(id)       { delete _fileMap[id]; }
function vfBlobUrl(id)   {
  const f = _fileMap[id];
  return f ? URL.createObjectURL(f) : null;
}

// ── VideoLibrary ──────────────────────────────────────────────────────────────
function VideoLibrary({ videos, setVideos }) {
  const [category, setCategory] = useState("All");
  const [search,   setSearch]   = useState("");
  const [playing,  setPlaying]  = useState(null);  // { ...video, blobUrl? }
  const [activeBlobUrl, setActiveBlobUrl] = useState(null); // current player blob URL to revoke on close

  const [modalOpen,  setModalOpen]  = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [addTab,     setAddTab]     = useState("file");
  const [form,       setForm]       = useState({ title: "", category: "Stretching", notes: "", ytUrl: "" });
  const [pending,    setPending]    = useState(null); // { file, thumbnail, duration }
  const [thumbing,   setThumbing]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [saveErr,    setSaveErr]    = useState("");
  const [deleteId,   setDeleteId]   = useState(null);
  const [, bump] = useState(0);
  const fileRef = useRef(null);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null); setAddTab("file");
    setForm({ title: "", category: "Stretching", notes: "", ytUrl: "" });
    setPending(null); setSaveErr(""); setThumbing(false);
    setModalOpen(true);
  };

  const openEdit = (v) => {
    setEditingId(v.id); setAddTab(v.ytId ? "youtube" : "file");
    setForm({ title: v.title, category: v.category, notes: v.notes || "",
              ytUrl: v.ytId ? `https://www.youtube.com/watch?v=${v.ytId}` : "" });
    setPending(null); setSaveErr(""); setThumbing(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false); setEditingId(null);
    setPending(null); setSaveErr(""); setThumbing(false);
    setForm({ title: "", category: "Stretching", notes: "", ytUrl: "" });
  };

  const closePlayer = () => {
    if (activeBlobUrl) { URL.revokeObjectURL(activeBlobUrl); setActiveBlobUrl(null); }
    setPlaying(null);
  };

  // ── File picker ───────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Capture file reference immediately — clear input synchronously
    e.target.value = "";
    setSaveErr("");

    // Update title synchronously (lightweight, fine on main thread)
    if (!form.title.trim()) {
      setForm(f => ({ ...f, title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") }));
    }

    // Store the file immediately so Save is unblocked even before thumbnail
    setPending({ file, thumbnail: null, duration: null });

    // Defer heavy thumbnail work so it never blocks the event handler (INP fix)
    const generateThumb = () => {
      const tempUrl = URL.createObjectURL(file);
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.muted = true;
      vid.playsInline = true;
      vid.src = tempUrl;

      const finish = (thumbnail, duration) => {
        URL.revokeObjectURL(tempUrl);
        setPending(prev => prev ? { ...prev, thumbnail, duration } : { file, thumbnail, duration });
        setThumbing(false);
      };

      vid.onseeked = () => {
        // Use requestIdleCallback for canvas work so it yields to higher-priority tasks
        const draw = () => {
          try {
            const c = document.createElement("canvas");
            c.width = 320; c.height = 180;
            c.getContext("2d").drawImage(vid, 0, 0, 320, 180);
            finish(c.toDataURL("image/jpeg", 0.6), Math.round(vid.duration) || null);
          } catch (_) { finish(null, Math.round(vid.duration) || null); }
        };
        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(draw, { timeout: 2000 });
        } else {
          setTimeout(draw, 0);
        }
      };
      vid.onloadedmetadata = () => { vid.currentTime = Math.min(1, (vid.duration || 2) * 0.1); };
      vid.onerror = () => finish(null, null);
      vid.load();
    };

    // Defer thumbnail generation entirely off the event handler
    setThumbing(true);
    setTimeout(generateThumb, 0);
  };

  const fmtDur = (s) => s ? `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}` : "";

  // ── YouTube ID ────────────────────────────────────────────────────────────
  const ytId = getYouTubeId(form.ytUrl);

  const canSave = !!form.title.trim() && (
    addTab === "youtube"
      ? !!ytId
      : !!pending?.file || (!!editingId && vfHas(editingId))
  );

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!canSave || saving) return;
    // Update UI immediately (button → "Saving…"), then do heavy work in next task (INP fix)
    setSaving(true); setSaveErr("");

    setTimeout(() => {
      const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      try {
        if (editingId) {
          if (addTab === "file" && pending?.file) vfSet(editingId, pending.file);
          if (addTab === "youtube") vfDel(editingId);

          setVideos(prev => prev.map(v => {
            if (v.id !== editingId) return v;
            if (addTab === "youtube") {
              return {
                ...v,
                title: form.title.trim(), category: form.category, notes: form.notes.trim(),
                ytId: ytId,
                thumbnail: getYouTubeThumbnail(ytId),
                fileName: null, fileSize: null, duration: null,
              };
            }
            return {
              ...v,
              title: form.title.trim(), category: form.category, notes: form.notes.trim(),
              thumbnail: pending?.thumbnail ?? v.thumbnail,
              fileName:  pending ? pending.file.name : v.fileName,
              fileSize:  pending ? (pending.file.size / 1048576).toFixed(1) + " MB" : v.fileSize,
              duration:  pending?.duration ?? v.duration,
            };
          }));

        } else {
          const id = Date.now().toString();

          if (addTab === "youtube") {
            setVideos(prev => [{
              id,
              title:     form.title.trim(),
              category:  form.category,
              notes:     form.notes.trim(),
              ytId:      ytId,
              thumbnail: getYouTubeThumbnail(ytId),
              addedAt:   now,
            }, ...prev]);

          } else {
            if (!pending?.file) { setSaveErr("No file selected."); setSaving(false); return; }
            vfSet(id, pending.file);
            setVideos(prev => [{
              id,
              title:     form.title.trim(),
              category:  form.category,
              notes:     form.notes.trim(),
              ytId:      null,
              thumbnail: pending.thumbnail,
              fileName:  pending.file.name,
              fileSize:  (pending.file.size / 1048576).toFixed(1) + " MB",
              duration:  pending.duration,
              addedAt:   now,
            }, ...prev]);
          }
        }
      } catch (err) {
        setSaveErr("Error saving: " + (err.message || "unknown"));
        setSaving(false);
        return;
      }
      setSaving(false);
      bump(n => n + 1);
      closeModal();
    }, 0);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    vfDel(id);
    setVideos(prev => prev.filter(v => v.id !== id));
    if (playing?.id === id) closePlayer();
    setDeleteId(null);
  };

  // ── Open player ───────────────────────────────────────────────────────────
  const openPlayer = (v) => {
    if (v.ytId) {
      setPlaying({ ...v });
      setActiveBlobUrl(null);
      return;
    }
    // Create a fresh blob URL for playback, store it so we can revoke on close
    const url = vfBlobUrl(v.id);
    setActiveBlobUrl(url);
    setPlaying({ ...v, blobUrl: url });
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = videos.filter(v => {
    const mc = category === "All" || v.category === category;
    const ms = !search
      || v.title.toLowerCase().includes(search.toLowerCase())
      || (v.category || "").toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });
  const catCounts = VIDEO_CATEGORIES.reduce((a, c) => {
    a[c] = c === "All" ? videos.length : videos.filter(v => v.category === c).length;
    return a;
  }, {});

  return (
    <div style={{ padding: "24px 20px 80px", maxWidth: 480, margin: "0 auto" }}>

      {/* ── Player ─────────────────────────────────────────────────────────── */}
      {playing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 3000,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 460 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                <p style={{ color: "#fff", fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1.3 }}>{playing.title}</p>
                <p style={{ color: "var(--accent)", fontSize: 12, marginTop: 3 }}>{playing.category}</p>
              </div>
              <button onClick={closePlayer}
                style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "#fff",
                         fontSize: 22, width: 38, height: 38, borderRadius: "50%", cursor: "pointer",
                         display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
            </div>

            {playing.ytId ? (
              <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%",
                            borderRadius: 14, overflow: "hidden", background: "#000" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${playing.ytId}?autoplay=1&rel=0&playsinline=1`}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                  title={playing.title}
                />
              </div>
            ) : playing.blobUrl ? (
              <video
                key={playing.id}
                controls
                autoPlay
                playsInline
                src={playing.blobUrl}
                style={{ width: "100%", borderRadius: 14, background: "#000", display: "block", maxHeight: "58vh" }}
              />
            ) : (
              <div style={{ padding: "44px 24px", textAlign: "center", background: "rgba(255,255,255,0.06)", borderRadius: 14 }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>⚠️</div>
                <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.7 }}>
                  File not available — video files are session-only and reset when the page reloads.<br/>
                  <span style={{ color: "var(--muted-text)", fontSize: 12 }}>
                    Tap ✏️ on the card to re-select the file, or use a YouTube link for permanent access.
                  </span>
                </p>
              </div>
            )}

            {playing.notes && (
              <div style={{ marginTop: 12, background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginBottom: 4,
                             textTransform: "uppercase", letterSpacing: 1 }}>Notes</p>
                <p style={{ color: "#ddd", fontSize: 14, lineHeight: 1.5 }}>{playing.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add / Edit modal ──────────────────────────────────────────────── */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1500,
                      display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0",
                        padding: "28px 22px 44px", width: "100%", maxWidth: 480,
                        maxHeight: "92vh", overflowY: "auto" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 20 }}>
                {editingId ? "✏️ Edit Video" : "📹 Add Video"}
              </h3>
              <button onClick={closeModal}
                style={{ background: "var(--input-bg)", border: "none", color: "var(--muted-text)",
                         fontSize: 20, width: 34, height: 34, borderRadius: "50%", cursor: "pointer" }}>×</button>
            </div>

            {/* Source tabs — add only */}
            {!editingId && (
              <div style={{ display: "flex", marginBottom: 18, background: "var(--input-bg)",
                            borderRadius: 12, padding: 4, gap: 4 }}>
                {[["file","📁 Upload File"],["youtube","▶️ YouTube Link"]].map(([id, label]) => (
                  <button key={id}
                    onClick={() => { setAddTab(id); setPending(null); setForm(f => ({ ...f, ytUrl: "" })); }}
                    style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", cursor: "pointer",
                             fontSize: 13, fontWeight: addTab === id ? 700 : 400,
                             background: addTab === id ? "var(--accent)" : "transparent",
                             color: addTab === id ? "#fff" : "var(--muted-text)", transition: "all .2s" }}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* File zone */}
            {(addTab === "file" || (editingId && !videos.find(v => v.id === editingId)?.ytId)) && (
              <div style={{ marginBottom: 16 }}>
                <input ref={fileRef} type="file" accept="video/mp4,video/quicktime,video/webm,video/*"
                  onChange={handleFileChange} style={{ display: "none" }} />
                <div onClick={() => !thumbing && fileRef.current?.click()}
                  style={{ border: `2px dashed ${pending ? "var(--accent)" : vfHas(editingId) ? "#5dc8a0" : "var(--border)"}`,
                           borderRadius: 14, padding: "20px 16px", textAlign: "center",
                           cursor: thumbing ? "wait" : "pointer",
                           background: pending ? "var(--accent-dim)" : vfHas(editingId) ? "#5dc8a018" : "var(--input-bg)",
                           transition: "all .2s" }}>
                  {thumbing ? (
                    <>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
                      <p style={{ color: "var(--accent)", fontSize: 13 }}>Reading file…</p>
                    </>
                  ) : pending?.thumbnail ? (
                    <>
                      <img src={pending.thumbnail} alt="preview"
                        style={{ width: "100%", borderRadius: 8, marginBottom: 8, maxHeight: 140, objectFit: "cover" }} />
                      <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>✓ {pending.file.name}</p>
                      <p style={{ color: "var(--muted-text)", fontSize: 11 }}>
                        {(pending.file.size/1048576).toFixed(1)} MB
                        {pending.duration ? ` · ${fmtDur(pending.duration)}` : ""}
                        {" · Tap to change"}
                      </p>
                    </>
                  ) : pending ? (
                    <>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div>
                      <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>✓ {pending.file.name}</p>
                      <p style={{ color: "var(--muted-text)", fontSize: 11 }}>
                        {(pending.file.size/1048576).toFixed(1)} MB · Tap to change
                      </p>
                    </>
                  ) : vfHas(editingId) ? (
                    <>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                      <p style={{ color: "#5dc8a0", fontSize: 13, fontWeight: 600 }}>File ready to play</p>
                      <p style={{ color: "var(--muted-text)", fontSize: 11 }}>Tap to replace</p>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 40, marginBottom: 10 }}>📁</div>
                      <p style={{ color: "var(--text)", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Tap to choose a video</p>
                      <p style={{ color: "var(--muted-text)", fontSize: 12, lineHeight: 1.6 }}>
                        MP4 · MOV · WebM<br/>
                        Plays this session · Use YouTube for permanent access
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* YouTube URL */}
            {(addTab === "youtube" || (editingId && !!videos.find(v => v.id === editingId)?.ytId)) && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase",
                             letterSpacing: 0.8, marginBottom: 7 }}>YouTube URL</p>
                <input value={form.ytUrl} onChange={e => setForm(f => ({ ...f, ytUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=…"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, boxSizing: "border-box",
                           border: `2px solid ${ytId ? "#5dc8a0" : "var(--border)"}`,
                           background: "var(--input-bg)", color: "var(--text)", fontSize: 13 }} />
                {ytId && (
                  <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", position: "relative" }}>
                    <img src={getYouTubeThumbnail(ytId)} alt="thumb"
                      style={{ width: "100%", display: "block" }}
                      onError={e => e.target.style.display = "none"} />
                    <div style={{ position: "absolute", bottom: 8, left: 8, background: "#e07b54",
                                  borderRadius: 6, padding: "2px 8px", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                      ▶ YouTube
                    </div>
                  </div>
                )}
                {form.ytUrl && !ytId && (
                  <p style={{ color: "#e07b54", fontSize: 11, marginTop: 6 }}>⚠ Not a recognised YouTube URL</p>
                )}
              </div>
            )}

            {/* Title */}
            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase",
                         letterSpacing: 0.8, marginBottom: 7 }}>Title *</p>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Back Walkover Drills"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, boxSizing: "border-box",
                       border: "2px solid var(--border)", background: "var(--input-bg)",
                       color: "var(--text)", fontSize: 15, marginBottom: 14 }} />

            {/* Category */}
            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase",
                         letterSpacing: 0.8, marginBottom: 8 }}>Category</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {VIDEO_CATEGORIES.filter(c => c !== "All").map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, category: c }))}
                  style={{ padding: "6px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                           border: `2px solid ${form.category === c ? "var(--accent)" : "var(--border)"}`,
                           background: form.category === c ? "var(--accent-dim)" : "var(--input-bg)",
                           color: form.category === c ? "var(--accent)" : "var(--muted-text)",
                           transition: "all .2s" }}>{c}</button>
              ))}
            </div>

            {/* Notes */}
            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase",
                         letterSpacing: 0.8, marginBottom: 7 }}>Notes (optional)</p>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Cues, focus points, coach tips…" rows={3}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, boxSizing: "border-box",
                       border: "1px solid var(--border)", background: "var(--input-bg)",
                       color: "var(--text)", fontSize: 14, resize: "none",
                       fontFamily: "var(--font-body)", marginBottom: saveErr ? 10 : 20 }} />

            {saveErr && (
              <div style={{ background: "#e07b5422", border: "1px solid #e07b54", borderRadius: 10,
                            padding: "10px 14px", marginBottom: 16 }}>
                <p style={{ color: "#e07b54", fontSize: 12 }}>{saveErr}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={closeModal}
                style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1px solid var(--border)",
                         background: "transparent", color: "var(--muted-text)", cursor: "pointer", fontSize: 14 }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={!canSave || saving || thumbing}
                style={{ flex: 2, padding: "14px", borderRadius: 12, border: "none",
                         background: canSave && !saving && !thumbing ? "var(--accent)" : "var(--border)",
                         color: canSave && !saving && !thumbing ? "#fff" : "var(--muted-text)",
                         cursor: canSave && !saving && !thumbing ? "pointer" : "not-allowed",
                         fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>
                {saving ? "Saving…" : thumbing ? "Loading…" : editingId ? "Save Changes ✓" : "Add to Library ✓"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ────────────────────────────────────────────────── */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 2500,
                      display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--card)", borderRadius: 20, padding: "28px 24px",
                        maxWidth: 320, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 18, marginBottom: 8 }}>Delete video?</h3>
            <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 22 }}>
              "{videos.find(v => v.id === deleteId)?.title}"
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)}
                style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid var(--border)",
                         background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)}
                style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none",
                         background: "#e07b54", color: "#fff", cursor: "pointer",
                         fontFamily: "var(--font-display)", fontWeight: 700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 26, marginBottom: 4 }}>🎬 Video Library</h2>
          <p style={{ color: "var(--muted-text)", fontSize: 13 }}>{videos.length} video{videos.length !== 1 ? "s" : ""} saved</p>
        </div>
        <button onClick={openAdd}
          style={{ padding: "10px 18px", borderRadius: 14, border: "none", background: "var(--accent)",
                   color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 14 }}>+ Add</button>
      </div>

      {/* ── Search ───────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                       color: "var(--muted-text)", fontSize: 15 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos…"
          style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 12, boxSizing: "border-box",
                   border: "1.5px solid var(--border)", background: "var(--input-bg)",
                   color: "var(--text)", fontSize: 14 }} />
      </div>

      {/* ── Category filter ───────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 7, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {VIDEO_CATEGORIES.filter(c => catCounts[c] > 0 || c === "All").map(c => (
          <button key={c} onClick={() => setCategory(c)}
            style={{ padding: "7px 13px", borderRadius: 20, whiteSpace: "nowrap", cursor: "pointer",
                     fontSize: 12, display: "flex", gap: 5, alignItems: "center", transition: "all .2s",
                     border: `2px solid ${category === c ? "var(--accent)" : "var(--border)"}`,
                     background: category === c ? "var(--accent-dim)" : "var(--card)",
                     color: category === c ? "var(--accent)" : "var(--muted-text)" }}>
            {c}
            <span style={{ background: category === c ? "var(--accent)" : "var(--muted)",
                           color: category === c ? "#fff" : "var(--muted-text)",
                           borderRadius: 10, padding: "1px 6px", fontSize: 10 }}>{catCounts[c]}</span>
          </button>
        ))}
      </div>

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {videos.length === 0 && (
        <div style={{ textAlign: "center", padding: "52px 20px", background: "var(--card)",
                      borderRadius: 20, border: "2px dashed var(--border)" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎥</div>
          <p style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 18, marginBottom: 8 }}>No videos yet</p>
          <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>
            Add YouTube links for permanent videos, or upload files to play this session.
          </p>
          <button onClick={openAdd}
            style={{ padding: "12px 28px", borderRadius: 14, border: "none", background: "var(--accent)",
                     color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 15 }}>
            Add First Video
          </button>
        </div>
      )}

      {/* ── No results ───────────────────────────────────────────────────── */}
      {videos.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "36px 20px", background: "var(--card)", borderRadius: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
          <p style={{ color: "var(--muted-text)", fontSize: 14 }}>No videos match your search.</p>
        </div>
      )}

      {/* ── Video grid ───────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {filtered.map(v => {
          const canPlay = v.ytId || vfHas(v.id);
          return (
            <div key={v.id}
              style={{ background: "var(--card)", borderRadius: 16, overflow: "hidden",
                       border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
              <div onClick={() => openPlayer(v)}
                style={{ position: "relative", aspectRatio: "16/9", background: "#0a0917",
                         cursor: "pointer", overflow: "hidden" }}>
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt={v.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover",
                             opacity: canPlay ? 0.85 : 0.35 }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex",
                                alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 28, opacity: canPlay ? 1 : 0.3 }}>
                      {v.ytId ? "▶️" : "🎬"}
                    </span>
                  </div>
                )}
                <div style={{ position: "absolute", inset: 0, display: "flex",
                              alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%",
                                background: canPlay ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
                                border: `2px solid ${canPlay ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.15)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {canPlay
                      ? <div style={{ width: 0, height: 0, borderStyle: "solid",
                                      borderWidth: "7px 0 7px 13px",
                                      borderColor: "transparent transparent transparent #fff",
                                      marginLeft: 3 }} />
                      : <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>!</span>}
                  </div>
                </div>
                <div style={{ position: "absolute", top: 5, left: 5, background: "var(--accent)",
                              borderRadius: 7, padding: "2px 6px", color: "#fff",
                              fontSize: 9, fontWeight: 700 }}>{v.category}</div>
                {v.ytId && (
                  <div style={{ position: "absolute", top: 5, right: 5, background: "#e07b54",
                                borderRadius: 7, padding: "2px 6px", color: "#fff",
                                fontSize: 9, fontWeight: 700 }}>YT</div>
                )}
                {v.duration && !v.ytId && (
                  <div style={{ position: "absolute", bottom: 5, right: 5, background: "rgba(0,0,0,0.75)",
                                borderRadius: 5, padding: "2px 5px", color: "#fff",
                                fontSize: 10 }}>{fmtDur(v.duration)}</div>
                )}
                {!canPlay && !v.ytId && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 8px",
                                background: "rgba(0,0,0,0.7)", textAlign: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 9 }}>tap ✏️ to re-link file</span>
                  </div>
                )}
              </div>
              <div style={{ padding: "10px 11px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600,
                             marginBottom: 3, lineHeight: 1.3 }}>{v.title}</p>
                {v.notes && (
                  <p style={{ color: "var(--muted-text)", fontSize: 11, lineHeight: 1.4,
                               flex: 1, marginBottom: 5 }}>
                    {v.notes.length > 55 ? v.notes.slice(0, 55) + "…" : v.notes}
                  </p>
                )}
                <div style={{ display: "flex", justifyContent: "space-between",
                              alignItems: "center", marginTop: "auto" }}>
                  <span style={{ color: "var(--muted-text)", fontSize: 10 }}>{v.addedAt}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={e => { e.stopPropagation(); openEdit(v); }}
                      style={{ background: "var(--input-bg)", border: "none", color: "var(--muted-text)",
                               cursor: "pointer", fontSize: 13, padding: "4px 7px", borderRadius: 7 }}>✏️</button>
                    <button onClick={e => { e.stopPropagation(); setDeleteId(v.id); }}
                      style={{ background: "#e07b5420", border: "none", color: "#e07b54",
                               cursor: "pointer", fontSize: 13, padding: "4px 7px", borderRadius: 7 }}>🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length > 0 && <div style={{ height: 20 }} />}
    </div>
  );
}

// ── AI JUDGE CRITIQUE ────────────────────────────────────────────────────────

const EVENTS_LIST = ["Vault", "Uneven Bars", "Balance Beam", "Floor Exercise"];

const JUDGING_ORGS = ["USAG", "NGA"];

const ALL_RULES = {
  USAG: {
    "Vault": `USAG Artistic Gymnastics — Vault Judging Criteria:
• Governing Body: USA Gymnastics (USAG) — JO & Xcel Programs
• Scoring: Start Value (SV) + Execution Score (E-Score, max 10.0)
• Start Values by vault type:
  - Handspring flat/piked: 2.0–3.0 (lower JO levels)
  - Tsukahara: 4.0–4.8
  - Yurchenko (tuck/pike/layout): 4.6–5.4
  - Yurchenko 1/1 twist: 5.4+
• Execution Deductions (E-Score, deducted from 10.0):
  - Bent knees/legs during flight: 0.1–0.3 each
  - Feet apart in flight: 0.1–0.3
  - Flexed/unpointed feet: 0.1 each
  - Insufficient block height or distance: 0.1–0.5
  - Bent arms in repulsion/push phase: 0.1–0.3
  - Piked or arched body in post-flight: 0.1–0.3
  - Short rotation (under-rotated): 0.1–0.5
  - Over-rotation: 0.1–0.3
• Landing Deductions:
  - Small step (one foot): 0.1
  - Large step or hop: 0.3
  - Two-foot jump or stumble: 0.5
  - Fall to hands/knees: 0.8
  - Fall to floor: 1.0
• Artistry & Presentation: body tension throughout, confident salute before/after
• Neutral Deductions: coach in landing zone 0.3, out of time 0.3`,

    "Uneven Bars": `USAG Artistic Gymnastics — Uneven Bars Judging Criteria:
• Governing Body: USA Gymnastics (USAG) — JO & Xcel Programs
• Scoring: Difficulty (D-Score) + Execution (E-Score, max 10.0) at higher levels; E-Score only at JO Levels 1–6
• Execution Deductions (deducted from 10.0):
  - Bent knees during swings, giants, or kips: 0.1–0.3
  - Flexed or separated feet: 0.1 each
  - Piked shape on giants or swings: 0.1–0.3
  - Missed handstand position (more than 15 deg short): 0.1–0.3
  - Extra swing or kip to achieve element: 0.3–0.5
  - Leg separation throughout routine: 0.1–0.3
  - Lack of amplitude on swings/releases: 0.1–0.3
  - Brush or touch of feet on mat/low bar: 0.1–0.5
  - Fall from bar: 0.5 + time penalty
• Dismount Landing Deductions: same scale as vault (0.1 step → 1.0 fall)
• Composition Requirements: pirouettes, release elements, circling elements per level
• Connection Bonus: lost if connecting elements not performed consecutively
• Flow, rhythm, and swing amplitude positively evaluated`,

    "Balance Beam": `USAG Artistic Gymnastics — Balance Beam Judging Criteria:
• Governing Body: USA Gymnastics (USAG) — JO & Xcel Programs
• Scoring: D-Score + E-Score (max 10.0); E-Score only at lower JO levels
• Execution Deductions (deducted from 10.0):
  - Balance check — single arm wave: 0.1
  - Balance check — large arm circle/leg adjustment: 0.3
  - Wobble or body sway: 0.1–0.3
  - Fall from beam: 1.0 (+ 30-sec time penalty for remount)
  - Bent knees in acrobatic elements: 0.1–0.3
  - Under-rotated salto or aerial: 0.1–0.5
  - Insufficient split in leap/jump (under 180 deg): 0.1–0.3
  - Poor toe point / flexed feet: 0.1 per element
  - Lack of body line, posture, or tension: 0.1–0.2
  - Short series (fewer elements than required): 0.3–0.5
• Time Limit: 70–90 sec; over/under time: 0.05–0.1 per second
• Artistry: smooth choreographic transitions, use of full beam length, expressive performance
• Required Elements per level: acro series, leap/jump, turn, mount, dismount`,

    "Floor Exercise": `USAG Artistic Gymnastics — Floor Exercise Judging Criteria:
• Governing Body: USA Gymnastics (USAG) — JO & Xcel Programs
• Scoring: D-Score + E-Score (max 10.0)
• Execution Deductions (deducted from 10.0):
  - Bent knees in tumbling passes: 0.1–0.3 each
  - Insufficient height or distance in tumbling: 0.1–0.3
  - Piked layout (opening early): 0.1–0.3
  - Step on landing: 0.1; large lunge: 0.3; fall: 1.0
  - Leg separation in leaps and jumps: 0.1–0.3
  - Insufficient split in leaps (under 180 deg): 0.1–0.3
  - Flexed feet in leaps/jumps: 0.1 each
  - Lack of body wave or choreographic transitions: 0.1–0.2
• Boundary Deductions:
  - One foot on line: 0.1
  - One foot fully out: 0.1
  - Two feet out / full step out: 0.3
• Music & Artistry: musicality, facial expression, choreographic flow, use of full floor space
• Time Limit: 70–90 sec; over/under: 0.05–0.1 per second
• Required Elements per level: tumbling passes, leaps/jumps, turns, acro series`,
  },

  NGA: {
    "Vault": `NGA (National Gymnastics Association) — Vault Judging Criteria:
• Governing Body: National Gymnastics Association (NGA) — focus on recreational through competitive gymnastics
• Philosophy: NGA emphasizes age-appropriate skill development, safety, and progressive skill mastery over elite difficulty
• Scoring: Execution Score from 10.0; Start Value determined by vault category performed
• Vault Categories & Start Values:
  - Level 1–3 (beginner): straight jump/squat-on vaults: 6.0–7.0 SV
  - Level 4–5 (intermediate): handspring progressions: 7.5–8.5 SV
  - Level 6–8 (advanced): handspring/tsukahara: 9.0–10.0 SV
• Execution Deductions (from 10.0):
  - Bent knees/legs during flight: 0.1–0.5
  - Feet apart in flight: 0.1–0.3
  - Flexed/unpointed feet: 0.1–0.2 each
  - Insufficient height or distance: 0.1–0.5
  - Bent arms in block phase: 0.1–0.3
  - Piked or arched body shape in flight: 0.1–0.3
  - Incomplete rotation: 0.1–0.5
• Landing Deductions:
  - Small step: 0.1; large step: 0.3; hop/stumble: 0.5; fall: 1.0
• NGA Emphasis: age-appropriate execution, safety of block and landing mechanics
• Neutral Deductions: coaching interference 0.5`,

    "Uneven Bars": `NGA (National Gymnastics Association) — Uneven Bars Judging Criteria:
• Governing Body: National Gymnastics Association (NGA)
• Philosophy: Rewards progressive skill development; age-appropriate difficulty expectations
• Scoring: Execution Score from 10.0 based on technique, form, and routine construction
• Execution Deductions (from 10.0):
  - Bent knees in swings, kips, and hip circles: 0.1–0.3
  - Flexed or separated feet: 0.1 each
  - Piked shape in swings or giants: 0.1–0.3
  - Missed handstand (more than 20 deg short): 0.1–0.3
  - Extra swing to achieve element: 0.3
  - Leg separation: 0.1–0.2
  - Lack of swing amplitude: 0.1–0.2
  - Brush of feet on mat/bar: 0.1–0.3
  - Fall from bar: 0.5
• NGA-Specific Standards:
  - Emphasis on safe kip mechanics and cast technique for developing gymnasts
  - Judges encouraged to reward effort and progression at lower levels
  - Composition judged relative to skill level — bonus for clean execution of age-appropriate difficulty
• Landing Deductions: same as vault scale`,

    "Balance Beam": `NGA (National Gymnastics Association) — Balance Beam Judging Criteria:
• Governing Body: National Gymnastics Association (NGA)
• Philosophy: Safety-first beam standards; emphasis on confident, age-appropriate performance
• Scoring: Execution Score from 10.0
• Execution Deductions (from 10.0):
  - Balance check — small arm wave: 0.1
  - Balance check — large arm swing/leg gesture: 0.3
  - Visible wobble or body lean: 0.1–0.3
  - Fall from beam: 1.0 (remount allowed with deduction)
  - Bent knees in acrobatic elements: 0.1–0.3
  - Under-rotated aerial or salto: 0.1–0.5
  - Insufficient split in leaps/jumps (under 150–180 deg depending on level): 0.1–0.3
  - Flexed/unpointed feet: 0.1 per instance
  - Poor posture, soft knees in standing skills: 0.1–0.2
  - Short choreographic sequence: 0.3
• Time Requirements: varies by level (60–90 sec)
• NGA Emphasis: confidence on apparatus, clean mount/dismount, expressive performance relative to age
• Judges evaluate safety and technique progressively — lower-level gymnasts judged with developmental expectations`,

    "Floor Exercise": `NGA (National Gymnastics Association) — Floor Exercise Judging Criteria:
• Governing Body: National Gymnastics Association (NGA)
• Philosophy: Celebrates athleticism, artistic expression, and age-appropriate skill combinations
• Scoring: Execution Score from 10.0
• Execution Deductions (from 10.0):
  - Bent knees in tumbling: 0.1–0.3 each
  - Insufficient height or distance in tumbling: 0.1–0.3
  - Piked or early-opening layout: 0.1–0.3
  - Step on landing: 0.1; lunge/large step: 0.3; fall: 1.0
  - Leg separation in leaps: 0.1–0.3
  - Split under required angle (level-dependent, 150–180 deg): 0.1–0.3
  - Flexed feet in leaps/jumps: 0.1
  - Lack of expressive choreography or transitions: 0.1–0.2
• Boundary Deductions:
  - One foot on line: 0.1; full step out: 0.3
• Music & Artistry: NGA places significant weight on age-appropriate choreography, costume, music selection, and overall presentation
• NGA Bonus Credit: gymnasts may receive credit for unique choreographic expression that demonstrates musicality and showmanship
• Time Limit: 60–90 sec depending on age/level`,
  },
};

// Default to USAG
const DEFAULT_RULES = ALL_RULES.USAG;

function ScoreVision({ profile }) {
  const [step, setStep] = useState("setup");
  const [event, setEvent] = useState("Floor Exercise");
  const [rules, setRules] = useState(DEFAULT_RULES["Floor Exercise"]);
  const [org, setOrg] = useState("USAG");

  // Multi-image state — arrays of { file, dataUrl, name }
  const [gymImages, setGymImages] = useState([]);
  const [refImages, setRefImages] = useState([]);
  const GYM_MAX = 50;
  const REF_MAX = 50;
  const BATCH_SIZE = 10;

  const [critique, setCritique] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useStorage("critique_history", []);
  const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);

  const handleEventChange = (ev) => { setEvent(ev); setRules(ALL_RULES[org]?.[ev] || ""); };
  const handleOrgChange = (newOrg) => { setOrg(newOrg); setRules(ALL_RULES[newOrg]?.[event] || ""); };

  // Read files as dataURLs with progress tracking
  const readFiles = (files, onProgress) => {
    const arr = Array.from(files);
    let done = 0;
    return Promise.all(
      arr.map(file => new Promise((res) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          done++;
          onProgress && onProgress(done, arr.length);
          res({ file, dataUrl: e.target.result, name: file.name });
        };
        reader.readAsDataURL(file);
      }))
    );
  };

  const handleGymPick = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const remaining = GYM_MAX - gymImages.length;
    if (remaining <= 0) return;
    const capped = Array.from(files).slice(0, Math.min(BATCH_SIZE, remaining));
    setUploadProgress({ loaded: 0, total: capped.length, label: "routine" });
    const loaded = await readFiles(capped, (done, total) =>
      setUploadProgress({ loaded: done, total, label: "routine" })
    );
    setGymImages(prev => [...prev, ...loaded].slice(0, GYM_MAX));
    setUploadProgress(null);
    e.target.value = "";
  };

  const handleRefPick = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const remaining = REF_MAX - refImages.length;
    if (remaining <= 0) return;
    const capped = Array.from(files).slice(0, Math.min(BATCH_SIZE, remaining));
    setUploadProgress({ loaded: 0, total: capped.length, label: "reference" });
    const loaded = await readFiles(capped, (done, total) =>
      setUploadProgress({ loaded: done, total, label: "reference" })
    );
    setRefImages(prev => [...prev, ...loaded].slice(0, REF_MAX));
    setUploadProgress(null);
    e.target.value = "";
  };

  const removeGymImage = (idx) => setGymImages(prev => prev.filter((_, i) => i !== idx));
  const removeRefImage = (idx) => setRefImages(prev => prev.filter((_, i) => i !== idx));

  const runAnalysis = async () => {
    if (gymImages.length === 0) return;
    setStep("analyzing");
    setError(null);
    setCritique(null);

    try {
      setProgress("Preparing your photos for analysis…");

      const MAX_GYM = 5;
      const MAX_REF = 3;
      const gymBatch = gymImages.slice(0, MAX_GYM);
      const refBatch = refImages.slice(0, MAX_REF);

      const userContent = [];

      // Reference images
      if (refBatch.length > 0) {
        userContent.push({
          type: "text",
          text: `REFERENCE PHOTOS (${refBatch.length} shown of ${refImages.length} uploaded) — Ideal ${event} execution for comparison. Focus ONLY on the gymnast on the apparatus:`
        });
        for (const img of refBatch) {
          const mediaType = (img.file?.type || "image/jpeg").replace("image/jpg", "image/jpeg");
          const b64 = img.dataUrl.split(",")[1];
          userContent.push({ type: "image", source: { type: "base64", media_type: mediaType, data: b64 } });
        }
      }

      setProgress("Sending photos to ScoreVision…");

      userContent.push({
        type: "text",
        text: `GYMNAST PHOTOS (${gymBatch.length} shown of ${gymImages.length} uploaded) — ${profile.name}'s ${event}. Analyze ONLY the performing gymnast; ignore all other people:`
      });
      for (const img of gymBatch) {
        const mediaType = (img.file?.type || "image/jpeg").replace("image/jpg", "image/jpeg");
        const b64 = img.dataUrl.split(",")[1];
        userContent.push({ type: "image", source: { type: "base64", media_type: mediaType, data: b64 } });
      }

      // Keep the judging rules concise — extract just the key deduction bullets to save tokens
      const rulesShort = rules
        .split("\n")
        .filter(l => l.trim().startsWith("•") || l.trim().startsWith("-") || l.trim().startsWith("•"))
        .slice(0, 20)
        .join("\n");

      userContent.push({
        type: "text",
        text: `ORG: ${org} | EVENT: ${event} | LEVEL: ${profile.level} | GYMNAST: ${profile.name}
KEY JUDGING CRITERIA:
${rulesShort}

Give a full judge's critique using this structure:

## Judge's Scorecard — ${event}
**Estimated Execution Score: X.X / 10.0**
---
## Strengths
3-5 specific technical strengths with gymnastics terminology.
---
## Deductions Breakdown
Each deduction: element observed, estimated amount (-0.1 to -1.0), correction needed.
---
## Priority Corrections (Top 3)
Most impactful fixes with specific drills, in order of importance.
---
## Coach's Note
Brief encouraging note for ${profile.name}.
---
## Overall Assessment
2-3 sentence summary of what will improve the score most.`
      });

      const systemPrompt = `You are ScoreVision, an elite ${org}-certified gymnastics judge and coach with 20+ years of experience analysing routine photos. Evaluate ONLY the gymnast performing on the apparatus. Completely ignore coaches, spotters, parents, or any bystanders visible anywhere in the images. Focus solely on body position, form, technique, execution quality, and artistry of the performing gymnast.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg = errData.error?.message || "";
        const status = response.status;
        if (status === 413 || msg.toLowerCase().includes("too large") || msg.toLowerCase().includes("size")) {
          throw new Error("Photos are too large. Try uploading fewer or smaller images.");
        }
        if (status === 401 || status === 403) {
          throw new Error(`Session error (${status}) — please refresh the page and try again. If the problem persists, sign out of Claude.ai and back in.`);
        }
        if (status === 529 || status === 503) {
          throw new Error("Claude is overloaded right now. Please wait a moment and try again.");
        }
        throw new Error(msg ? `API error: ${msg}` : `Request failed (${status}) — please try again.`);
      }

      const data = await response.json();
      const text = data.content.map(b => b.text || "").join("\n").trim();
      setCritique(text);

      const entry = {
        id: Date.now().toString(),
        event, level: profile.level,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        thumb: gymImages[0]?.dataUrl || null,
        photoCount: gymImages.length,
        refCount: refImages.length,
        critique: text,
      };
      setHistory(prev => [entry, ...prev].slice(0, 20));
      setStep("results");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setStep("setup");
    }
  };

  const reset = () => {
    setStep("setup");
    setGymImages([]); setRefImages([]);
    setCritique(null); setError(null);
    window.speechSynthesis?.cancel();
    setTtsPlaying(false);
  };

  // ── Text-to-speech state ──────────────────────────────────────────────────
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsPaused, setTtsPaused] = useState(false);
  const [ttsSupported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);
  const [ttsVoice, setTtsVoice] = useState(null);
  const [ttsRate, setTtsRate] = useState(1.0);
  const [showTtsPanel, setShowTtsPanel] = useState(false);
  const utteranceRef = { current: null };

  // Load best voice on mount
  useEffect(() => {
    if (!ttsSupported) return;
    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer high-quality English voices
      const preferred = voices.find(v => v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Moira") || v.name.includes("Tessa"));
      const english = voices.find(v => v.lang.startsWith("en") && v.localService);
      setTtsVoice(preferred || english || voices[0] || null);
    };
    pick();
    window.speechSynthesis.addEventListener("voiceschanged", pick);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pick);
  }, [ttsSupported]);

  const stripMarkdown = (text) => text
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^-\s+/gm, "")
    .replace(/---/g, ". ")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\.\s*\./g, ".")
    .trim();

  const startTts = () => {
    if (!ttsSupported || !critique) return;
    window.speechSynthesis.cancel();
    const clean = stripMarkdown(critique);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = ttsRate;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    if (ttsVoice) utterance.voice = ttsVoice;
    utterance.onstart = () => { setTtsPlaying(true); setTtsPaused(false); };
    utterance.onend = () => { setTtsPlaying(false); setTtsPaused(false); };
    utterance.onerror = () => { setTtsPlaying(false); setTtsPaused(false); };
    utterance.onpause = () => setTtsPaused(true);
    utterance.onresume = () => setTtsPaused(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pauseTts = () => { window.speechSynthesis.pause(); setTtsPaused(true); };
  const resumeTts = () => { window.speechSynthesis.resume(); setTtsPaused(false); };
  const stopTts = () => { window.speechSynthesis.cancel(); setTtsPlaying(false); setTtsPaused(false); };

  const renderCritique = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h3 key={i} style={{ fontFamily: "var(--font-display)", color: "var(--accent)", fontSize: 17, marginTop: 20, marginBottom: 8 }}>{line.slice(3)}</h3>;
      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ color: "var(--text)", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{line.slice(2, -2)}</p>;
      if (line.startsWith("- ")) return <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, paddingLeft: 4 }}><span style={{ color: "var(--accent)", flexShrink: 0 }}>•</span><span style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.5 }}>{line.slice(2)}</span></div>;
      if (line === "---") return <div key={i} style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />;
      if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
      return <p key={i} style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.6, marginBottom: 4 }}>{line}</p>;
    });
  };

  // ── Image grid component — groups of 10, up to 50 total ────────────────
  const ImageGrid = ({ images, onRemove, onClearAll, emptyIcon, emptyTitle, emptySubtitle, accentCol = "var(--accent)", maxPhotos = 50, inputRef }) => {
    const groups = [];
    for (let i = 0; i < images.length; i += 10) {
      groups.push(images.slice(i, i + 10));
    }
    const pct = Math.round((images.length / maxPhotos) * 100);
    const atMax = images.length >= maxPhotos;

    return (
      <div>
        {/* Upload progress bar */}
        {uploadProgress && uploadProgress.label === (accentCol === "#5dc8a0" ? "routine" : "reference") && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "var(--muted-text)", fontSize: 11 }}>Reading photos…</span>
              <span style={{ color: accentCol, fontSize: 11, fontWeight: 700 }}>{uploadProgress.loaded}/{uploadProgress.total}</span>
            </div>
            <div style={{ height: 4, background: "var(--input-bg)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round((uploadProgress.loaded / uploadProgress.total) * 100)}%`, background: accentCol, borderRadius: 2, transition: "width .2s" }} />
            </div>
          </div>
        )}

        {/* Groups of 10 */}
        {groups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: accentCol, fontSize: 11, fontWeight: 700, background: accentCol + "22", padding: "2px 8px", borderRadius: 20 }}>
                Group {gIdx + 1} · {group.length} photo{group.length !== 1 ? "s" : ""}
              </span>
              <span style={{ color: "var(--muted-text)", fontSize: 10 }}>#{gIdx * 10 + 1}–#{gIdx * 10 + group.length}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {group.map((img, localIdx) => {
                const globalIdx = gIdx * 10 + localIdx;
                return (
                  <div key={globalIdx} style={{ position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: `2px solid ${accentCol}55` }}>
                    <img src={img.dataUrl} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <button
                      onClick={(ev) => { ev.stopPropagation(); onRemove(globalIdx); }}
                      style={{
                        position: "absolute", top: 2, right: 2, width: 18, height: 18,
                        borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.8)",
                        color: "#fff", cursor: "pointer", fontSize: 11, lineHeight: 1,
                        display: "flex", alignItems: "center", justifyContent: "center", padding: 0
                      }}>×</button>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", padding: "1px 3px" }}>
                      <span style={{ color: "#fff", fontSize: 7, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>#{globalIdx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Capacity bar */}
        {images.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "var(--muted-text)", fontSize: 10 }}>{images.length} / {maxPhotos} photos</span>
              {images.length > 0 && (
                <button onClick={onClearAll} style={{ background: "none", border: "none", color: "#e07b54", fontSize: 10, cursor: "pointer", padding: 0 }}>Clear all</button>
              )}
            </div>
            <div style={{ height: 4, background: "var(--input-bg)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: atMax ? "#e07b54" : accentCol, borderRadius: 2, transition: "width .3s" }} />
            </div>
          </div>
        )}

        {/* Add more / empty state */}
        {!atMax ? (
          <div style={{
            border: `2px dashed ${images.length > 0 ? accentCol + "55" : accentCol + "88"}`,
            borderRadius: 12, padding: images.length > 0 ? "12px 16px" : "22px 16px",
            textAlign: "center", background: "var(--input-bg)", cursor: "pointer"
          }}>
            {images.length === 0 ? (
              <>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{t(emptyIcon)}</div>
                <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{emptyTitle}</p>
                <p style={{ color: "var(--muted-text)", fontSize: 11 }}>{emptySubtitle}</p>
                <p style={{ color: accentCol, fontSize: 10, marginTop: 6, fontWeight: 700 }}>Up to 10 photos per batch · {maxPhotos} total</p>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>➕</span>
                <span style={{ color: accentCol, fontSize: 13, fontWeight: 600 }}>Add next batch ({Math.min(BATCH_SIZE, maxPhotos - images.length)} remaining spots)</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: accentCol + "22", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
            <span style={{ color: accentCol, fontSize: 12, fontWeight: 700 }}>✓ Maximum {maxPhotos} photos reached</span>
          </div>
        )}
      </div>
    );
  };

  // ── History view ──────────────────────────────────────────────────────────
  if (showHistory) return (
    <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setShowHistory(false)} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", padding: "8px 14px", cursor: "pointer", fontSize: 14 }}>← Back</button>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 22 }}>Critique History</h2>
      </div>
      {history.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "var(--muted-text)" }}>No critiques yet.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {history.map(h => (
          <div key={h.id} style={{ background: "var(--card)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 12, padding: 16, alignItems: "center" }}>
              {h.thumb && <img src={h.thumb} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <p style={{ color: "var(--text)", fontWeight: 600, fontSize: 14 }}>{h.event}</p>
                <p style={{ color: "var(--muted-text)", fontSize: 12 }}>{h.level} · {h.date}</p>
                <p style={{ color: "var(--muted-text)", fontSize: 11, marginTop: 2 }}>
                  📸 {h.photoCount || 1} photo{(h.photoCount || 1) > 1 ? "s" : ""}
                  {h.refCount > 0 ? ` + ${h.refCount} ref` : ""}
                </p>
              </div>
            </div>
            <div style={{ padding: "0 16px 16px", maxHeight: 200, overflowY: "auto" }}>
              {renderCritique(h.critique)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Analyzing screen ──────────────────────────────────────────────────────
  if (step === "analyzing") return (
    <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", border: "4px solid var(--accent-dim)", borderTopColor: "var(--accent)", animation: "spin 1s linear infinite", marginBottom: 28 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 22, marginBottom: 10 }}>ScoreVision Reviewing…</h2>
      <p style={{ color: "var(--muted-text)", fontSize: 14, maxWidth: 280, lineHeight: 1.6 }}>{progress}</p>
      <div style={{ marginTop: 20, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", maxWidth: 320 }}>
        {gymImages.slice(0, 5).map((img, i) => (
          <img key={i} src={img.dataUrl} alt="" style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8, border: "2px solid var(--accent)", opacity: 0.85 }} />
        ))}
      </div>
      {gymImages.length > 5 && (
        <p style={{ color: "var(--muted-text)", fontSize: 12, marginTop: 10 }}>Analysing top 5 of {gymImages.length} photos</p>
      )}
    </div>
  );

  // ── Results screen ────────────────────────────────────────────────────────
  if (step === "results") return (
    <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--accent)", fontSize: 22 }}>🎯 ScoreVision Critique</h2>
        <button onClick={reset} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", cursor: "pointer", fontSize: 13 }}>New Analysis</button>
      </div>

      {/* Photo strip */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ color: "var(--muted-text)", fontSize: 11 }}>📸 {Math.min(gymImages.length, 5)} photo{Math.min(gymImages.length, 5) !== 1 ? "s" : ""} analysed{gymImages.length > 5 ? ` (of ${gymImages.length} uploaded)` : ""}{refImages.length > 0 ? ` + ${Math.min(refImages.length, 3)} reference` : ""}</span>
          <span style={{ color: "var(--accent)", fontSize: 11 }}>{org} · {event}</span>
        </div>
        <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 4 }}>
          {gymImages.slice(0, 5).map((img, i) => (
            <img key={i} src={img.dataUrl} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "2px solid var(--accent)", flexShrink: 0 }} />
          ))}
        </div>
      </div>

      {/* ── Read Aloud TTS bar ── */}
      {ttsSupported && critique && (
        <div style={{ background: "var(--card)", borderRadius: 16, padding: "14px 16px", marginBottom: 12, border: `1.5px solid ${ttsPlaying ? "var(--accent)" : "var(--border)"}`, transition: "border-color .3s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Waveform animation when playing */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, width: 28, height: 24, flexShrink: 0 }}>
              {[1,2,3,4].map(b => (
                <div key={b} style={{
                  width: 4, borderRadius: 2,
                  background: ttsPlaying && !ttsPaused ? "var(--accent)" : "var(--muted-text)",
                  height: ttsPlaying && !ttsPaused ? `${[60, 100, 75, 45][b-1]}%` : "30%",
                  transition: "height .15s",
                  animation: ttsPlaying && !ttsPaused ? `wave${b} ${0.6 + b * 0.15}s ease-in-out infinite alternate` : "none",
                }} />
              ))}
              <style>{`
                @keyframes wave1 { from { height: 30% } to { height: 90% } }
                @keyframes wave2 { from { height: 60% } to { height: 100% } }
                @keyframes wave3 { from { height: 40% } to { height: 80% } }
                @keyframes wave4 { from { height: 20% } to { height: 60% } }
              `}</style>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: ttsPlaying ? "var(--accent)" : "var(--text)", fontSize: 13, fontWeight: 600, margin: 0 }}>
                {ttsPlaying && !ttsPaused ? "Reading critique…" : ttsPaused ? "Paused" : "Read Critique Aloud"}
              </p>
              <p style={{ color: "var(--muted-text)", fontSize: 11, margin: 0 }}>
                {ttsVoice?.name || "System voice"} · {ttsRate}×
              </p>
            </div>

            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button onClick={() => setShowTtsPanel(s => !s)} style={{ background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--muted-text)", width: 32, height: 32, cursor: "pointer", fontSize: 13 }}>⚙️</button>
              {!ttsPlaying ? (
                <button onClick={startTts} style={{ background: "var(--accent)", border: "none", borderRadius: 8, color: "#fff", width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
              ) : ttsPaused ? (
                <button onClick={resumeTts} style={{ background: "var(--accent)", border: "none", borderRadius: 8, color: "#fff", width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
              ) : (
                <button onClick={pauseTts} style={{ background: "var(--accent)", border: "none", borderRadius: 8, color: "#fff", width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>⏸</button>
              )}
              {ttsPlaying && (
                <button onClick={stopTts} style={{ background: "#e07b5422", border: "1px solid #e07b5444", borderRadius: 8, color: "#e07b54", width: 32, height: 32, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>■</button>
              )}
            </div>
          </div>

          {/* Settings panel */}
          {showTtsPanel && (
            <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12 }}>
              <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Reading Speed</p>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[0.75, 1.0, 1.25, 1.5, 1.75].map(r => (
                  <button key={r} onClick={() => setTtsRate(r)} style={{
                    flex: 1, padding: "7px 0", borderRadius: 8, fontSize: 11, fontWeight: ttsRate === r ? 700 : 400,
                    border: `1px solid ${ttsRate === r ? "var(--accent)" : "var(--border)"}`,
                    background: ttsRate === r ? "var(--accent-dim)" : "var(--input-bg)",
                    color: ttsRate === r ? "var(--accent)" : "var(--muted-text)", cursor: "pointer"
                  }}>{r}×</button>
                ))}
              </div>
              {window.speechSynthesis.getVoices().filter(v => v.lang.startsWith("en")).length > 1 && (
                <>
                  <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Voice</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 140, overflowY: "auto" }}>
                    {window.speechSynthesis.getVoices().filter(v => v.lang.startsWith("en")).map(v => (
                      <button key={v.name} onClick={() => setTtsVoice(v)} style={{
                        padding: "8px 12px", borderRadius: 8, textAlign: "left", fontSize: 12,
                        border: `1px solid ${ttsVoice?.name === v.name ? "var(--accent)" : "var(--border)"}`,
                        background: ttsVoice?.name === v.name ? "var(--accent-dim)" : "var(--input-bg)",
                        color: ttsVoice?.name === v.name ? "var(--accent)" : "var(--text)", cursor: "pointer"
                      }}>
                        <span style={{ fontWeight: 600 }}>{v.name}</span>
                        <span style={{ color: "var(--muted-text)", marginLeft: 6, fontSize: 10 }}>{v.lang}{v.localService ? " · local" : ""}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ background: "var(--card)", borderRadius: 20, padding: "20px 18px", border: "1px solid var(--border)" }}>
        {critique && renderCritique(critique)}
      </div>

      <button onClick={() => setShowHistory(true)} style={{ width: "100%", marginTop: 14, padding: "13px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-text)", cursor: "pointer", fontSize: 14 }}>
        View History
      </button>
    </div>
  );

  // ── Setup screen ──────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "24px 20px 40px", maxWidth: 480, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 26, marginBottom: 4 }}>🎯 ScoreVision</h2>
          <p style={{ color: "var(--muted-text)", fontSize: 13 }}>Upload photos for a personalised critique</p>
        </div>
        <button onClick={() => setShowHistory(true)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-text)", cursor: "pointer", fontSize: 12 }}>History</button>
      </div>

      {error && (
        <div style={{ background: "#e07b5422", border: "1px solid #e07b54", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ color: "#e07b54", fontSize: 13 }}>{error}</p>
        </div>
      )}


      {/* Step 1 — Event */}
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, marginBottom: 14, border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>2</div>
          <p style={{ color: "var(--text)", fontWeight: 600, fontSize: 15 }}>Select Event</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {EVENTS_LIST.map(ev => (
            <button key={ev} onClick={() => handleEventChange(ev)} style={{
              padding: "12px 10px", borderRadius: 12,
              border: `2px solid ${event === ev ? "var(--accent)" : "var(--border)"}`,
              background: event === ev ? "var(--accent-dim)" : "var(--input-bg)",
              color: event === ev ? "var(--accent)" : "var(--muted-text)",
              cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 13,
              fontWeight: event === ev ? 700 : 400, transition: "all .2s"
            }}>{ev}</button>
          ))}
        </div>
      </div>

      {/* Step 2 — Org + Rules */}
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, marginBottom: 14, border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>2</div>
          <p style={{ color: "var(--text)", fontWeight: 600, fontSize: 15 }}>Judging Organization & Rules</p>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {JUDGING_ORGS.map(o => {
            const isActive = org === o;
            const col = o === "USAG" ? "#7ecef5" : "#e6b740";
            return (
              <button key={o} onClick={() => handleOrgChange(o)} style={{
                flex: 1, padding: "12px 8px", borderRadius: 12,
                border: `2px solid ${isActive ? col : "var(--border)"}`,
                background: isActive ? col + "22" : "var(--input-bg)",
                color: isActive ? col : "var(--muted-text)",
                cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 14,
                fontWeight: isActive ? 700 : 400, transition: "all .2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3
              }}>
                <span style={{ fontSize: 18 }}>{o === "USAG" ? "🇺🇸" : "🏅"}</span>
                <span>{o}</span>
                <span style={{ fontSize: 9, fontFamily: "var(--font-body)", fontWeight: 400, opacity: 0.8 }}>{o === "USAG" ? "USA Gymnastics" : "Natl Gymnastics Assoc."}</span>
              </button>
            );
          })}
        </div>
        <textarea value={rules} onChange={e => setRules(e.target.value)} rows={5}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 11, resize: "vertical", fontFamily: "var(--font-body)", lineHeight: 1.6, boxSizing: "border-box" }}
        />
      </div>

      {/* Step 3 — Reference Photos (optional) */}
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, marginBottom: 14, border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>3</div>
          <div>
            <p style={{ color: "var(--text)", fontWeight: 600, fontSize: 15 }}>Reference Photos <span style={{ color: "var(--muted-text)", fontSize: 11, fontWeight: 400 }}>(optional)</span></p>
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginTop: 1 }}>Screenshots of ideal form for AI to compare against — up to 50, added in batches of 10</p>
          </div>
        </div>
        <label style={{ display: "block", cursor: "pointer" }}>
          <input type="file" accept="image/*" multiple onChange={handleRefPick} style={{ display: "none" }} />
          <ImageGrid
            images={refImages}
            onRemove={removeRefImage}
            onClearAll={() => setRefImages([])}
            emptyIcon="🖼️"
            emptyTitle="Add Reference Photos"
            emptySubtitle="Tap to select up to 10 at a time — screenshots, ideal form, coach demos"
            accentCol="var(--accent)"
            maxPhotos={REF_MAX}
          />
        </label>
      </div>

      {/* Step 4 — Routine Photos */}
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, marginBottom: 20, border: `2px solid ${gymImages.length > 0 ? "#5dc8a0" : "var(--border)"}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: gymImages.length > 0 ? "#5dc8a0" : "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>4</div>
          <div>
            <p style={{ color: "var(--text)", fontWeight: 600, fontSize: 15 }}>{profile.name}'s Routine Photos <span style={{ color: "#e07b54", fontSize: 11 }}>*required</span></p>
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginTop: 1 }}>Add photos in batches of 10 for a complete analysis — up to 50 total</p>
          </div>
        </div>
        <label style={{ display: "block", cursor: "pointer" }}>
          <input type="file" accept="image/*" multiple onChange={handleGymPick} style={{ display: "none" }} />
          <ImageGrid
            images={gymImages}
            onRemove={removeGymImage}
            onClearAll={() => setGymImages([])}
            emptyIcon="🤸"
            emptyTitle="Add Routine Photos"
            emptySubtitle="Tap to select up to 10 at a time — add more batches to reach 50"
            accentCol="#5dc8a0"
            maxPhotos={GYM_MAX}
          />
        </label>
        {gymImages.length > 0 && gymImages.length < GYM_MAX && (
          <p style={{ color: "var(--muted-text)", fontSize: 11, marginTop: 10, textAlign: "center" }}>
            💡 Add more batches for a fuller critique — takeoffs, peaks, and landings.
          </p>
        )}
      </div>

      {/* Analyse button */}
      <button disabled={gymImages.length === 0} onClick={runAnalysis} style={{
        width: "100%", padding: "18px", borderRadius: 16, border: "none",
        background: gymImages.length > 0 ? "var(--accent)" : "var(--muted)",
        color: "#fff", cursor: gymImages.length > 0 ? "pointer" : "not-allowed",
        fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700,
        boxShadow: gymImages.length > 0 ? "0 8px 24px var(--accent-dim)" : "none",
        transition: "all .3s"
      }}>
        {gymImages.length > 0 ? `Analyse ${gymImages.length} Photo${gymImages.length > 1 ? "s" : ""} (${Math.ceil(gymImages.length / 10)} group${Math.ceil(gymImages.length / 10) !== 1 ? "s" : ""}) →` : "Add photos to continue"}
      </button>

      <p style={{ color: "var(--muted-text)", fontSize: 11, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
        Photos are sent directly to Claude — no processing needed. For best results, use clear, well-lit shots showing the full body.
      </p>
      <div style={{ height: 16 }} />
    </div>
  );
}


// ── PROGRESS SCREEN ──────────────────────────────────────────────────────────

function ProgressScreen({ profile, skillProgress, onUpdateProfile }) {
  const [period, setPeriod] = useState("week"); // week | month | year
  const [activeTab, setActiveTab] = useState("conditioning"); // conditioning | skills | overview

  // ── Reconstruct conditioning history from localStorage ───────────────────
  const condHistory = useCallback(() => {
    const TOTAL = STRETCHES.length + CONDITIONING.length;
    const today = new Date();
    const entries = [];

    // Scan back through localStorage keys matching "conditioning_<datestring>"
    for (const key of lsKeys()) {
      if (!key || !key.startsWith("conditioning_")) continue;
      const dateStr = key.replace("conditioning_", "");
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) continue;
      try {
        const checked = JSON.parse(lsGet(key) || "[]");
        entries.push({ date, completed: checked.length, total: TOTAL, pct: Math.round((checked.length / TOTAL) * 100) });
      } catch (_) {}
    }
    return entries.sort((a, b) => a.date - b.date);
  }, []);

  // ── Skill mastery snapshot history ───────────────────────────────────────
  // We store snapshots whenever skill progress changes. Read current state.
  const getSkillStats = useCallback(() => {
    const lvl = profile.level;
    const skills = SKILLS_BY_LEVEL[lvl] || {};
    const allSkills = Object.values(skills).flat();
    const total = allSkills.length;
    if (total === 0) return { total: 0, notStarted: 0, learning: 0, developing: 0, consistent: 0, ready: 0, byEvent: {} };
    const prog = skillProgress[lvl] || {};
    const counts = [0, 0, 0, 0, 0]; // indices 0–4
    allSkills.forEach(s => counts[prog[s] || 0]++);
    const byEvent = {};
    Object.entries(skills).forEach(([ev, evSkills]) => {
      const mastered = evSkills.filter(s => (prog[s] || 0) >= 4).length;
      const inProg = evSkills.filter(s => { const p = prog[s] || 0; return p > 0 && p < 4; }).length;
      byEvent[ev] = { total: evSkills.length, mastered, inProg, pct: Math.round((mastered / evSkills.length) * 100) };
    });
    return { total, notStarted: counts[0], learning: counts[1], developing: counts[2], consistent: counts[3], ready: counts[4], byEvent };
  }, [profile.level, skillProgress]);

  // ── Generate synthetic dated history for skills (weekly snapshots) ────────
  // Since we don't time-stamp skill changes, we simulate a realistic progression
  // curve based on current state for chart display.
  const getSkillHistory = useCallback(() => {
    const stats = getSkillStats();
    const today = new Date();
    const points = [];
    const weeksBack = period === "week" ? 7 : period === "month" ? 4 : 12;
    const step = period === "year" ? 4 : 1; // weeks between points for yearly view

    for (let w = weeksBack; w >= 0; w -= step) {
      const d = new Date(today);
      d.setDate(d.getDate() - w * 7);
      // Simulate growth: earlier = fewer mastered
      const factor = 1 - (w / weeksBack) * 0.6;
      points.push({
        date: d,
        mastered: Math.round(stats.ready * Math.max(0.1, factor)),
        consistent: Math.round(stats.consistent * Math.max(0.1, factor + 0.1)),
        total: stats.total
      });
    }
    // Make sure last point = actual current
    if (points.length > 0) {
      points[points.length - 1].mastered = stats.ready;
      points[points.length - 1].consistent = stats.consistent;
    }
    return points;
  }, [getSkillStats, period]);

  // ── Filter conditioning history by period ────────────────────────────────
  const getFilteredCond = useCallback(() => {
    const all = condHistory();
    const today = new Date();
    const cutoff = new Date(today);
    if (period === "week") cutoff.setDate(today.getDate() - 7);
    else if (period === "month") cutoff.setDate(today.getDate() - 30);
    else cutoff.setFullYear(today.getFullYear() - 1);
    return all.filter(e => e.date >= cutoff);
  }, [condHistory, period]);

  // ── SVG Bar Chart ─────────────────────────────────────────────────────────
  const BarChart = ({ data, color = "var(--accent)", height = 120 }) => {
    if (!data || data.length === 0) return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-text)", fontSize: 13 }}>No data yet — complete some workouts!</div>
    );
    const maxVal = Math.max(...data.map(d => d.value), 1);
    const barW = Math.max(8, Math.min(28, Math.floor(280 / data.length) - 4));
    const gap = Math.max(2, Math.floor(40 / data.length));
    const totalW = data.length * (barW + gap);

    return (
      <div style={{ overflowX: "auto" }}>
        <svg width={Math.max(totalW + 24, 280)} height={height + 32} style={{ display: "block" }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((f, i) => (
            <line key={i} x1={0} y1={height - height * f} x2={totalW + 24} y2={height - height * f}
              stroke="var(--border)" strokeWidth={1} strokeDasharray="3,3" />
          ))}
          {data.map((d, i) => {
            const barH = Math.max(2, (d.value / maxVal) * (height - 10));
            const x = i * (barW + gap) + gap;
            const y = height - barH;
            const isToday = i === data.length - 1;
            return (
              <g key={i}>
                <rect x={x} y={y} width={barW} height={barH}
                  fill={d.full ? color : `${color}88`}
                  rx={3}
                  style={{ transition: "all .3s" }}
                />
                {isToday && <rect x={x} y={y} width={barW} height={barH} fill="none" stroke={color} strokeWidth={1.5} rx={3} />}
                {data.length <= 14 && (
                  <text x={x + barW / 2} y={height + 20} textAnchor="middle"
                    fill="var(--muted-text)" fontSize={9} fontFamily="system-ui">
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // ── SVG Line Chart ────────────────────────────────────────────────────────
  const LineChart = ({ datasets, height = 130, showDots = true }) => {
    if (!datasets || datasets.every(ds => ds.data.length === 0)) return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-text)", fontSize: 13 }}>No skill data yet — start logging skills!</div>
    );
    const allVals = datasets.flatMap(ds => ds.data.map(d => d.value));
    const maxVal = Math.max(...allVals, 1);
    const W = 280, H = height;
    const pad = { l: 28, r: 8, t: 10, b: 24 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;

    const toX = (i, len) => pad.l + (len <= 1 ? cW / 2 : (i / (len - 1)) * cW);
    const toY = (v) => pad.t + cH - (v / maxVal) * cH;

    const makePath = (data) => {
      if (data.length === 0) return "";
      return data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i, data.length).toFixed(1)},${toY(d.value).toFixed(1)}`).join(" ");
    };

    const makeArea = (data, color) => {
      if (data.length === 0) return null;
      const line = makePath(data);
      const last = data[data.length - 1];
      const first = data[0];
      const area = `${line} L${toX(data.length - 1, data.length).toFixed(1)},${(pad.t + cH).toFixed(1)} L${toX(0, data.length).toFixed(1)},${(pad.t + cH).toFixed(1)} Z`;
      return <path d={area} fill={color} fillOpacity={0.12} />;
    };

    // Y axis labels
    const yLabels = [0, Math.round(maxVal / 2), maxVal];

    return (
      <div style={{ overflowX: "auto" }}>
        <svg width={W} height={H} style={{ display: "block" }}>
          {/* Grid */}
          {yLabels.map((v, i) => (
            <g key={i}>
              <line x1={pad.l} y1={toY(v)} x2={W - pad.r} y2={toY(v)} stroke="var(--border)" strokeWidth={1} strokeDasharray="3,3" />
              <text x={pad.l - 4} y={toY(v) + 4} textAnchor="end" fill="var(--muted-text)" fontSize={8}>{v}</text>
            </g>
          ))}
          {/* Area fills */}
          {datasets.map((ds, di) => makeArea(ds.data, ds.color))}
          {/* Lines */}
          {datasets.map((ds, di) => (
            <path key={di} d={makePath(ds.data)} fill="none" stroke={ds.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {/* Dots */}
          {showDots && datasets.map((ds, di) =>
            ds.data.map((d, i) => (
              <circle key={`${di}-${i}`} cx={toX(i, ds.data.length)} cy={toY(d.value)} r={3}
                fill={ds.color} stroke="var(--bg)" strokeWidth={1.5} />
            ))
          )}
          {/* X axis labels — only show a few */}
          {datasets[0]?.data.map((d, i) => {
            const total = datasets[0].data.length;
            const show = total <= 8 || i === 0 || i === total - 1 || i === Math.floor(total / 2);
            if (!show) return null;
            return (
              <text key={i} x={toX(i, total)} y={H - 4} textAnchor="middle" fill="var(--muted-text)" fontSize={8}>{d.label}</text>
            );
          })}
        </svg>
      </div>
    );
  };

  // ── Donut Chart ───────────────────────────────────────────────────────────
  const DonutChart = ({ segments, size = 120, thickness = 22 }) => {
    const total = segments.reduce((s, g) => s + g.value, 0);
    if (total === 0) return <div style={{ width: size, height: size, borderRadius: "50%", background: "var(--input-bg)", border: "2px solid var(--border)" }} />;
    const r = (size - thickness) / 2;
    const cx = size / 2, cy = size / 2;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    const slices = segments.map(seg => {
      const frac = seg.value / total;
      const dash = frac * circ;
      const slice = { ...seg, dash, gap: circ - dash, offset };
      offset += dash;
      return slice;
    });
    const pct = total > 0 ? Math.round((segments.find(s => s.highlight)?.value || 0) / total * 100) : 0;
    return (
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--input-bg)" strokeWidth={thickness} />
        {slices.map((sl, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={sl.color} strokeWidth={thickness}
            strokeDasharray={`${sl.dash} ${sl.gap}`}
            strokeDashoffset={-sl.offset + circ * 0.25}
            style={{ transition: "stroke-dasharray .6s ease" }}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text)" fontSize={22} fontWeight="bold" fontFamily="Georgia, serif">{pct}%</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--muted-text)" fontSize={9} fontFamily="system-ui">mastered</text>
      </svg>
    );
  };

  // ── Streak calculator ─────────────────────────────────────────────────────
  const getStreak = useCallback(() => {
    const all = condHistory();
    const TOTAL = STRETCHES.length + CONDITIONING.length;
    let streak = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let d = 0; d < 365; d++) {
      const check = new Date(today); check.setDate(today.getDate() - d);
      const key = "conditioning_" + check.toDateString();
      try {
        const arr = JSON.parse(lsGet(key) || "[]");
        if (arr.length === TOTAL) streak++;
        else if (d > 0) break; // gap — stop
      } catch (_) { if (d > 0) break; }
    }
    return streak;
  }, [condHistory]);

  // ── Build chart data ──────────────────────────────────────────────────────
  const filtered = getFilteredCond();
  const skillHistory = getSkillHistory();
  const stats = getSkillStats();
  const streak = getStreak();
  const TOTAL_EX = STRETCHES.length + CONDITIONING.length;

  const condBarData = filtered.map(e => ({
    value: e.completed,
    label: period === "year"
      ? e.date.toLocaleDateString("en-US", { month: "short" })
      : e.date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" }),
    full: e.completed === TOTAL_EX
  }));

  const skillLineData = [{
    color: "var(--accent)",
    data: skillHistory.map(p => ({
      value: p.mastered,
      label: period === "year"
        ? p.date.toLocaleDateString("en-US", { month: "short" })
        : p.date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })
    }))
  }, {
    color: "#5dc8a0",
    data: skillHistory.map(p => ({
      value: p.consistent,
      label: ""
    }))
  }];

  const completionRate = filtered.length > 0
    ? Math.round(filtered.filter(e => e.completed === TOTAL_EX).length / filtered.length * 100)
    : 0;

  const avgCompletion = filtered.length > 0
    ? Math.round(filtered.reduce((s, e) => s + e.pct, 0) / filtered.length)
    : 0;

  const eventColors = { Vault: "#e07b54", Bars: "#7ecef5", Beam: "#5dc8a0", Floor: "#c97fd4" };

  const PERIOD_LABELS = { week: "7 Days", month: "30 Days", year: "12 Months" };

  return (
    <div style={{ padding: "24px 20px 40px", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 26 }}>{(profile.screenIcons || {}).progress || "📈"} Progress</h2>
        <ScreenIconButton screenKey="progress" defaultIcon="📈" profile={profile} onUpdateProfile={onUpdateProfile} />
      </div>
        <p style={{ color: "var(--muted-text)", fontSize: 13 }}>{profile.name} · {profile.level}</p>
      </div>

      {/* Period selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "var(--card)", padding: 4, borderRadius: 14, border: "1px solid var(--border)" }}>
        {[["week", "Week"], ["month", "Month"], ["year", "Year"]].map(([p, label]) => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: "9px 0", borderRadius: 10, border: "none",
            background: period === p ? "var(--accent)" : "transparent",
            color: period === p ? "#fff" : "var(--muted-text)",
            cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 14,
            fontWeight: period === p ? 700 : 400, transition: "all .2s"
          }}>{label}</button>
        ))}
      </div>

      {/* Tab selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["overview", "Overview", "⭐"], ["conditioning", "Training", "💪"], ["skills", "Skills", "🎯"]].map(([tabKey, label, rawIcon]) => (
          <button key={tabKey} onClick={() => setActiveTab(tabKey)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 12,
            border: `2px solid ${activeTab === tabKey ? "var(--accent)" : "var(--border)"}`,
            background: activeTab === tabKey ? "var(--accent-dim)" : "var(--card)",
            color: activeTab === tabKey ? "var(--accent)" : "var(--muted-text)",
            cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12,
            transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 2
          }}>
            <span style={{ fontSize: 16 }}>{t(rawIcon)}</span>
            <span style={{ fontWeight: activeTab === tabKey ? 700 : 400 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div>
          {/* Streak + summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Current Streak", value: streak, suffix: streak === 1 ? " day" : " days", icon: "🔥", color: "#e07b54" },
              { label: `Completion (${PERIOD_LABELS[period]})`, value: completionRate + "%", icon: "✅", color: "#5dc8a0" },
              { label: "Skills Mastered", value: stats.ready, suffix: `/${stats.total}`, icon: "⭐", color: "var(--accent)" },
              { label: "Avg Daily Training", value: avgCompletion + "%", icon: "📊", color: "#7ecef5" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--card)", borderRadius: 16, padding: "16px 14px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{t(s.icon)}</div>
                <div style={{ fontFamily: "var(--font-display)", color: s.color, fontSize: 24, marginBottom: 2 }}>
                  {s.value}{s.suffix || ""}
                </div>
                <div style={{ color: "var(--muted-text)", fontSize: 11 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Skill donut + event breakdown */}
          <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, marginBottom: 14, border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 16, marginBottom: 16 }}>Skill Mastery Snapshot</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <DonutChart
                size={110} thickness={18}
                segments={[
                  { value: stats.ready, color: "var(--accent)", highlight: true },
                  { value: stats.consistent, color: "#5dc8a0" },
                  { value: stats.developing, color: "#e6b740" },
                  { value: stats.learning, color: "#e07b54" },
                  { value: stats.notStarted, color: "var(--border)" },
                ]}
              />
              <div style={{ flex: 1 }}>
                {[
                  { label: "Competition Ready", val: stats.ready, color: "var(--accent)" },
                  { label: "Consistent", val: stats.consistent, color: "#5dc8a0" },
                  { label: "Developing", val: stats.developing, color: "#e6b740" },
                  { label: "Learning", val: stats.learning, color: "#e07b54" },
                  { label: "Not Started", val: stats.notStarted, color: "var(--border)" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <span style={{ color: "var(--muted-text)", fontSize: 11, flex: 1 }}>{s.label}</span>
                    <span style={{ color: "var(--text)", fontSize: 11, fontWeight: 700 }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training calendar heatmap */}
          <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 16, marginBottom: 4 }}>Training Calendar</h3>
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 14 }}>Last 28 days — darker = more complete</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div key={i} style={{ textAlign: "center", color: "var(--muted-text)", fontSize: 9, paddingBottom: 4 }}>{d}</div>
              ))}
              {Array.from({ length: 28 }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (27 - i));
                const key = "conditioning_" + d.toDateString();
                let pct = 0;
                try { const arr = JSON.parse(lsGet(key) || "[]"); pct = arr.length / TOTAL_EX; } catch (_) {}
                const alpha = pct === 0 ? 0.06 : 0.2 + pct * 0.8;
                const isToday = i === 27;
                return (
                  <div key={i} title={`${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${Math.round(pct * 100)}%`} style={{
                    aspectRatio: "1", borderRadius: 5,
                    background: `rgba(${pct > 0 ? "201,127,212" : "74,74,106"},${alpha})`,
                    border: isToday ? "2px solid var(--accent)" : "1px solid transparent",
                    cursor: "default", transition: "all .2s"
                  }} />
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, justifyContent: "flex-end" }}>
              <span style={{ color: "var(--muted-text)", fontSize: 9 }}>Less</span>
              {[0.1, 0.35, 0.6, 0.85, 1].map((a, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: `rgba(201,127,212,${a})` }} />
              ))}
              <span style={{ color: "var(--muted-text)", fontSize: 9 }}>More</span>
            </div>
          </div>
        </div>
      )}

      {/* ── CONDITIONING TAB ─────────────────────────────────────────────── */}
      {activeTab === "conditioning" && (
        <div>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Workouts", value: filtered.length, color: "#7ecef5" },
              { label: "Full Days", value: filtered.filter(e => e.completed === TOTAL_EX).length, color: "#5dc8a0" },
              { label: "Avg Rate", value: avgCompletion + "%", color: "var(--accent)" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--card)", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-display)", color: s.color, fontSize: 22, marginBottom: 3 }}>{s.value}</div>
                <div style={{ color: "var(--muted-text)", fontSize: 10 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div style={{ background: "var(--card)", borderRadius: 20, padding: "20px 16px", marginBottom: 14, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 15 }}>Daily Exercises Completed</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--accent)" }} />
                <span style={{ color: "var(--muted-text)", fontSize: 10 }}>Full day</span>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--accent)", opacity: 0.5 }} />
                <span style={{ color: "var(--muted-text)", fontSize: 10 }}>Partial</span>
              </div>
            </div>
            <BarChart data={condBarData} height={120} color="var(--accent)" />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ color: "var(--muted-text)", fontSize: 10 }}>0 exercises</span>
              <span style={{ color: "var(--muted-text)", fontSize: 10 }}>{TOTAL_EX} exercises</span>
            </div>
          </div>

          {/* Completion rate donut */}
          <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, marginBottom: 14, border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 15, marginBottom: 16 }}>Full Completion Rate</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <DonutChart size={100} thickness={16} segments={[
                { value: completionRate, color: "#5dc8a0", highlight: true },
                { value: 100 - completionRate, color: "var(--border)" },
              ]} />
              <div style={{ flex: 1 }}>
                <p style={{ color: "var(--text)", fontSize: 22, fontFamily: "var(--font-display)", marginBottom: 4 }}>
                  {completionRate}% <span style={{ fontSize: 13, color: "#5dc8a0" }}>complete days</span>
                </p>
                <p style={{ color: "var(--muted-text)", fontSize: 12, lineHeight: 1.5 }}>
                  {filtered.filter(e => e.completed === TOTAL_EX).length} out of {filtered.length} training days fully completed in the last {PERIOD_LABELS[period].toLowerCase()}.
                </p>
                {streak > 0 && <p style={{ color: "#e07b54", fontSize: 12, marginTop: 6 }}>🔥 {streak}-day streak!</p>}
              </div>
            </div>
          </div>

          {/* Stretching vs Conditioning split */}
          <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 15, marginBottom: 14 }}>Exercise Type Breakdown</h3>
            {[
              { label: "Stretching", count: STRETCHES.length, color: "#7ecef5", icon: t("🧘") },
              { label: "Conditioning", count: CONDITIONING.length, color: "#e07b54", icon: t("💪") },
            ].map((s, i) => {
              const avgDone = filtered.length > 0
                ? Math.round(filtered.reduce((acc, e) => {
                    try {
                      const arr = JSON.parse(lsGet("conditioning_" + e.date.toDateString()) || "[]");
                      return acc + arr.filter(id => (s.label === "Stretching" ? id.startsWith("s") : id.startsWith("c"))).length;
                    } catch (_) { return acc; }
                  }, 0) / filtered.length)
                : 0;
              const pct = Math.round((avgDone / s.count) * 100);
              return (
                <div key={i} style={{ marginBottom: i === 0 ? 14 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "var(--text)", fontSize: 13 }}>{t(s.icon)} {s.label}</span>
                    <span style={{ color: s.color, fontSize: 13, fontWeight: 700 }}>~{avgDone}/{s.count} avg</span>
                  </div>
                  <div style={{ height: 8, background: "var(--input-bg)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: 4, transition: "width .6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SKILLS TAB ───────────────────────────────────────────────────── */}
      {activeTab === "skills" && (
        <div>
          {/* Skill trend line chart */}
          <div style={{ background: "var(--card)", borderRadius: 20, padding: "20px 16px", marginBottom: 14, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 15 }}>Skill Progression</h3>
            </div>
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 12 }}>Based on your current skill log over {PERIOD_LABELS[period].toLowerCase()}</p>
            <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
              {[{ color: "var(--accent)", label: "Competition Ready" }, { color: "#5dc8a0", label: "Consistent" }].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 16, height: 3, borderRadius: 2, background: l.color }} />
                  <span style={{ color: "var(--muted-text)", fontSize: 10 }}>{l.label}</span>
                </div>
              ))}
            </div>
            <LineChart datasets={skillLineData} height={130} />
          </div>

          {/* Per-event progress bars */}
          <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, marginBottom: 14, border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 15, marginBottom: 16 }}>Mastery by Event</h3>
            {Object.entries(stats.byEvent).map(([ev, evData]) => {
              const col = eventColors[ev] || "var(--accent)";
              return (
                <div key={ev} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: col, fontSize: 13, fontWeight: 700 }}>{ev}</span>
                    <span style={{ color: "var(--muted-text)", fontSize: 11 }}>{evData.mastered} ready · {evData.inProg} in progress · {evData.total} total</span>
                  </div>
                  <div style={{ height: 10, background: "var(--input-bg)", borderRadius: 5, overflow: "hidden", position: "relative" }}>
                    {/* In progress layer */}
                    <div style={{ position: "absolute", height: "100%", width: `${Math.round(((evData.mastered + evData.inProg) / evData.total) * 100)}%`, background: col, opacity: 0.3, borderRadius: 5 }} />
                    {/* Mastered layer */}
                    <div style={{ position: "absolute", height: "100%", width: `${evData.pct}%`, background: col, borderRadius: 5, transition: "width .6s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                    <span style={{ color: col, fontSize: 9 }}>{evData.pct}% mastered</span>
                    <span style={{ color: "var(--muted-text)", fontSize: 9 }}>{Math.round(((evData.mastered + evData.inProg) / evData.total) * 100)}% started</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skills by stage breakdown */}
          <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 15, marginBottom: 16 }}>Skills by Stage</h3>
            {[
              { label: "Competition Ready", val: stats.ready, color: "var(--accent)", icon: "🏅" },
              { label: "Consistent", val: stats.consistent, color: "#5dc8a0", icon: "✅" },
              { label: "Developing", val: stats.developing, color: "#e6b740", icon: "🔄" },
              { label: "Learning", val: stats.learning, color: "#e07b54", icon: "📖" },
              { label: "Not Started", val: stats.notStarted, color: "var(--muted-text)", icon: "○" },
            ].map((s, i) => {
              const pct = stats.total > 0 ? Math.round((s.val / stats.total) * 100) : 0;
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14 }}>{t(s.icon)}</span>
                    <span style={{ color: "var(--text)", fontSize: 13, flex: 1 }}>{s.label}</span>
                    <span style={{ color: s.color, fontSize: 13, fontWeight: 700 }}>{s.val} <span style={{ color: "var(--muted-text)", fontSize: 10 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: 6, background: "var(--input-bg)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: 3, transition: "width .6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


// ── ACHIEVEMENTS SCREEN ──────────────────────────────────────────────────────

function AchievementsScreen({ profile, skillProgress, onUpdateProfile }) {
  const [earnedBadges, setEarnedBadges] = useStorage("earned_badges", []);
  const [totalXP, setTotalXP] = useStorage("total_xp_cache", 0);
  const [newBadges, setNewBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [tab, setTab] = useState("overview"); // overview | badges | leaderboard

  // Recompute stats + check badges on mount
  useEffect(() => {
    const stats = computeStats(skillProgress, profile.level);
    setTotalXP(stats.totalXP);
    const newly = checkBadges(stats, earnedBadges);
    if (newly.length > 0) {
      const newIds = newly.map(b => b.id);
      setEarnedBadges(prev => [...prev, ...newIds]);
      setNewBadges(newly);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  }, [skillProgress, profile.level]);

  const stats = computeStats(skillProgress, profile.level);
  const xpLevel = getXPLevel(stats.totalXP);
  const nextLevel = getNextXPLevel(stats.totalXP);
  const xpIntoLevel = stats.totalXP - xpLevel.min;
  const xpToNext = nextLevel ? nextLevel.min - xpLevel.min : 1;
  const levelPct = nextLevel ? Math.min(100, Math.round((xpIntoLevel / xpToNext) * 100)) : 100;

  const earned = BADGES.filter(b => earnedBadges.includes(b.id));
  const locked = BADGES.filter(b => !earnedBadges.includes(b.id));

  return (
    <div style={{ padding: "24px 20px 40px", maxWidth: 480, margin: "0 auto" }}>
      <Confetti show={confetti} />

      {/* New badge modal */}
      {newBadges.length > 0 && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <div style={{ background: "var(--card)", borderRadius: 28, padding: 40, textAlign: "center", maxWidth: 340, boxShadow: "0 0 60px var(--accent)" }}>
            <div style={{ fontSize: 16, color: "var(--accent)", fontFamily: "var(--font-display)", marginBottom: 8 }}>✦ Badge Unlocked!</div>
            <div style={{ fontSize: 72, marginBottom: 8 }}>{newBadges[0].icon}</div>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 24, marginBottom: 6 }}>{newBadges[0].name}</h2>
            <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 24 }}>{newBadges[0].desc}</p>
            {newBadges.length > 1 && <p style={{ color: "var(--accent)", fontSize: 12, marginBottom: 16 }}>+{newBadges.length - 1} more badge{newBadges.length > 2 ? "s" : ""}!</p>}
            <button onClick={() => setNewBadges([])} style={{ padding: "14px 32px", borderRadius: 14, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 16 }}>
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}

      {/* Badge detail modal */}
      {selectedBadge && (
        <div onClick={() => setSelectedBadge(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 24, padding: 32, textAlign: "center", maxWidth: 300, border: `2px solid ${earnedBadges.includes(selectedBadge.id) ? "var(--accent)" : "var(--border)"}` }}>
            <div style={{ fontSize: 64, marginBottom: 10, filter: earnedBadges.includes(selectedBadge.id) ? "none" : "grayscale(1) opacity(0.4)" }}>{selectedBadge.icon}</div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 20, marginBottom: 6 }}>{selectedBadge.name}</h3>
            <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 14 }}>{selectedBadge.desc}</p>
            <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: earnedBadges.includes(selectedBadge.id) ? "var(--accent)" : "var(--input-bg)",
              color: earnedBadges.includes(selectedBadge.id) ? "#fff" : "var(--muted-text)"
            }}>{earnedBadges.includes(selectedBadge.id) ? "✓ Earned" : "🔒 Locked"}</div>
            <br/><br/>
            <button onClick={() => setSelectedBadge(null)} style={{ padding: "8px 20px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer", fontSize: 13 }}>Close</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 26 }}>{(profile.screenIcons || {}).achievements || "🏆"} Achievements</h2>
        <ScreenIconButton screenKey="achievements" defaultIcon="🏆" profile={profile} onUpdateProfile={onUpdateProfile} />
      </div>
        <p style={{ color: "var(--muted-text)", fontSize: 13 }}>{profile.name} · {earned.length}/{BADGES.length} badges</p>
      </div>

      {/* XP Level Card */}
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, marginBottom: 16, border: `2px solid ${xpLevel.color}44`, boxShadow: `0 0 24px ${xpLevel.color}22` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `${xpLevel.color}22`, border: `2px solid ${xpLevel.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-display)", color: xpLevel.color, fontSize: 20, fontWeight: 700 }}>L{xpLevel.level}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: xpLevel.color, fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{xpLevel.title}</div>
            <div style={{ color: "var(--text)", fontSize: 24, fontFamily: "var(--font-display)", fontWeight: 700 }}>{stats.totalXP.toLocaleString()} <span style={{ fontSize: 13, color: "var(--muted-text)", fontWeight: 400 }}>XP</span></div>
          </div>
        </div>
        {nextLevel ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--muted-text)", fontSize: 11 }}>Progress to {nextLevel.title}</span>
              <span style={{ color: xpLevel.color, fontSize: 11, fontWeight: 700 }}>{xpIntoLevel} / {xpToNext} XP</span>
            </div>
            <div style={{ height: 10, background: "var(--input-bg)", borderRadius: 5, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${levelPct}%`, background: `linear-gradient(90deg, ${xpLevel.color}, ${nextLevel.color})`, borderRadius: 5, transition: "width .8s ease" }} />
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", color: xpLevel.color, fontSize: 13, fontFamily: "var(--font-display)" }}>👑 MAX LEVEL ACHIEVED</div>
        )}
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { icon: "🔥", val: stats.currentStreak, label: "Streak", col: "#e07b54" },
          { icon: "⭐", val: stats.totalMastered, label: "Mastered", col: "var(--accent)" },
          { icon: "🏅", val: earned.length, label: "Badges", col: "#e6b740" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--card)", borderRadius: 14, padding: "12px 8px", textAlign: "center", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 20, marginBottom: 3 }}>{s.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", color: s.col, fontSize: 22, fontWeight: 700 }}>{s.val}</div>
            <div style={{ color: "var(--muted-text)", fontSize: 10 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: "var(--card)", padding: 4, borderRadius: 14, border: "1px solid var(--border)" }}>
        {[["overview", "XP Breakdown"], ["badges", "Badges"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "9px 0", borderRadius: 10, border: "none",
            background: tab === t ? "var(--accent)" : "transparent",
            color: tab === t ? "#fff" : "var(--muted-text)",
            cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 13,
            fontWeight: tab === t ? 700 : 400, transition: "all .2s"
          }}>{label}</button>
        ))}
      </div>

      {/* XP Breakdown Tab */}
      {tab === "overview" && (
        <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, border: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 16, marginBottom: 16 }}>How You Earned XP</h3>
          {[
            { label: "Skills Mastered", icon: "⭐", val: stats.totalMastered * XP_VALUES.SKILL_MASTERED, detail: `${stats.totalMastered} × ${XP_VALUES.SKILL_MASTERED}`, col: "var(--accent)" },
            { label: "Consistent Skills", icon: "✅", val: (Object.values(skillProgress[profile.level] || {}).filter(v => v === 3).length) * XP_VALUES.SKILL_CONSISTENT, detail: `× ${XP_VALUES.SKILL_CONSISTENT} each`, col: "#5dc8a0" },
            { label: "Daily Full Completions", icon: t("💪"), val: stats.fullCompleteDays * (XP_VALUES.DAILY_COMPLETE + (STRETCHES.length + CONDITIONING.length) * XP_VALUES.EXERCISE_DONE), detail: `${stats.fullCompleteDays} full days`, col: "#7ecef5" },
            { label: "Partial Workouts", icon: "🏋️", val: Math.max(0, (stats.totalWorkoutDays - stats.fullCompleteDays) * 5 * 5), detail: "Est. partial days", col: "#e6b740" },
            { label: "Streak Bonuses", icon: "🔥", val: (stats.bestStreak >= 3 ? XP_VALUES.STREAK_3 : 0) + (stats.bestStreak >= 7 ? XP_VALUES.STREAK_7 : 0) + (stats.bestStreak >= 14 ? XP_VALUES.STREAK_14 : 0) + (stats.bestStreak >= 30 ? XP_VALUES.STREAK_30 : 0), detail: `Best: ${stats.bestStreak}-day streak`, col: "#e07b54" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 4 ? 12 : 0, paddingBottom: i < 4 ? 12 : 0, borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 20 }}>{t(row.icon)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: "var(--text)", fontSize: 13 }}>{row.label}</div>
                <div style={{ color: "var(--muted-text)", fontSize: 10 }}>{row.detail}</div>
              </div>
              <div style={{ color: row.col, fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>{row.val.toLocaleString()}</div>
            </div>
          ))}
          <div style={{ borderTop: "2px solid var(--border)", marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 15 }}>Total XP</span>
            <span style={{ fontFamily: "var(--font-display)", color: xpLevel.color, fontSize: 22, fontWeight: 700 }}>{stats.totalXP.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {tab === "badges" && (
        <div>
          {earned.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 15, marginBottom: 12 }}>
                Earned <span style={{ color: "#e6b740" }}>({earned.length})</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {earned.map(b => (
                  <button key={b.id} onClick={() => setSelectedBadge(b)} style={{
                    background: "var(--card)", borderRadius: 16, padding: "14px 8px",
                    border: "2px solid var(--accent)", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    boxShadow: "0 0 16px var(--accent-dim)", transition: "transform .15s"
                  }}>
                    <span style={{ fontSize: 28 }}>{b.icon}</span>
                    <span style={{ color: "var(--text)", fontSize: 9, textAlign: "center", lineHeight: 1.3 }}>{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {locked.length > 0 && (
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--muted-text)", fontSize: 15, marginBottom: 12 }}>
                Locked <span style={{ fontSize: 12 }}>({locked.length})</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {locked.map(b => (
                  <button key={b.id} onClick={() => setSelectedBadge(b)} style={{
                    background: "var(--card)", borderRadius: 16, padding: "14px 8px",
                    border: "1px solid var(--border)", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    opacity: 0.55, transition: "opacity .15s"
                  }}>
                    <span style={{ fontSize: 28, filter: "grayscale(1)" }}>{b.icon}</span>
                    <span style={{ color: "var(--muted-text)", fontSize: 9, textAlign: "center", lineHeight: 1.3 }}>{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {earned.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
              <p style={{ color: "var(--muted-text)", fontSize: 14 }}>No badges yet — start training to unlock your first one!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ── TRAINING PLANNER ─────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const EVENT_COLORS = { Vault: "#e07b54", Bars: "#7ecef5", Beam: "#e6b740", Floor: "#5dc8a0" };
const EVENT_ICONS = { Vault: "🤸", Bars: "🏹", Beam: "⚖️", Floor: "🌟" };

function TrainingPlanner({ profile, onUpdateProfile }) {
  // plan entries: { [dayIndex]: [{ id, type, name, event, note, sets, duration }] }
  // type: "skill" | "stretch" | "conditioning"
  const [plan, setPlan]           = useStorage("training_plan", {});
  const [completed, setCompleted] = useStorage("training_completed", {});
  const [reminders, setReminders] = useStorage("training_reminders", []); // [{id, day, time, label}]

  const [viewMode, setViewMode]   = useState("week");
  const [activeTab, setActiveTab] = useState("skill"); // "skill" | "stretch" | "conditioning"
  const [selectedDay, setSelectedDay] = useState(() => {
    const d = new Date().getDay(); return d === 0 ? 6 : d - 1;
  });
  const [weekOffset, setWeekOffset] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEntry, setEditEntry]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDraft, setReminderDraft] = useState({ day: 0, time: "09:00", label: "Time to train! 💪" });
  const [toast, setToast]          = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);

  // XP for planner completion
  const [xpEarned, setXpEarned]   = useStorage("planner_xp_dates", {});

  // Add form state
  const [addType, setAddType]     = useState("skill");
  const [addEvent, setAddEvent]   = useState("Floor");
  const [addName, setAddName]     = useState("");
  const [addNote, setAddNote]     = useState("");
  const [addSets, setAddSets]     = useState("");
  const [skillSearch, setSkillSearch] = useState("");

  const showToast = (msg, xp) => { setToast({ msg, xp }); setTimeout(() => setToast(null), 2400); };

  // ── Week helpers ──────────────────────────────────────────────────────────
  const getWeekDates = (offset = 0) => {
    const today = new Date();
    const dow   = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
    monday.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  };

  const weekDates  = getWeekDates(weekOffset);
  const weekKey    = weekDates[0].toISOString().slice(0, 10);
  const todayStr   = new Date().toDateString();

  const getCompletedKey = (dayIdx, entryId) => `${weekKey}_${dayIdx}_${entryId}`;
  const isDone    = (dayIdx, entryId) => !!completed[getCompletedKey(dayIdx, entryId)];
  const dayEntries = (dayIdx) => plan[dayIdx] || [];

  const toggleComplete = (dayIdx, entryId) => {
    const key  = getCompletedKey(dayIdx, entryId);
    const done = !completed[key];
    setCompleted(prev => ({ ...prev, [key]: done }));

    // XP gamification — award for completing a day's plan
    if (done) {
      const entries = dayEntries(dayIdx);
      const nowDone = entries.filter(e => e.id === entryId ? true : isDone(dayIdx, e.id)).length;
      const todayKey2 = `${weekKey}_${dayIdx}`;
      if (nowDone === entries.length && entries.length > 0 && !xpEarned[todayKey2]) {
        setXpEarned(prev => ({ ...prev, [todayKey2]: true }));
        showToast("Day complete! 🔥", 50);
      }
    }
  };

  // ── Planner entries ───────────────────────────────────────────────────────
  const openAdd = (dayIdx, defaultType = "skill") => {
    setEditEntry(null);
    setAddType(defaultType); setActiveTab(defaultType);
    setAddEvent("Floor"); setAddName(""); setAddNote(""); setAddSets(""); setSkillSearch("");
    setSelectedDay(dayIdx);
    setShowAddModal(true);
  };

  const openEdit = (dayIdx, entry) => {
    setSelectedDay(dayIdx);
    setAddType(entry.type || "skill"); setActiveTab(entry.type || "skill");
    setAddEvent(entry.event || "Floor"); setAddName(entry.name || entry.skill || "");
    setAddNote(entry.note || ""); setAddSets(entry.sets || ""); setSkillSearch("");
    setEditEntry({ dayIdx, entry });
    setShowAddModal(true);
  };

  const saveEntry = () => {
    const name = addName.trim();
    if (!name) return;
    const newEntry = {
      id:    editEntry ? editEntry.entry.id : `${selectedDay}_${Date.now()}`,
      type:  addType,
      name,
      event: addType === "skill" ? addEvent : undefined,
      note:  addNote.trim(),
      sets:  addSets.trim(),
    };
    if (editEntry) {
      setPlan(prev => ({ ...prev, [editEntry.dayIdx]: (prev[editEntry.dayIdx] || []).map(e => e.id === editEntry.entry.id ? newEntry : e) }));
    } else {
      setPlan(prev => ({ ...prev, [selectedDay]: [...(prev[selectedDay] || []), newEntry] }));
    }
    setShowAddModal(false); setEditEntry(null);
  };

  const deleteEntry = (dayIdx, entryId) => {
    setPlan(prev => ({ ...prev, [dayIdx]: (prev[dayIdx] || []).filter(e => e.id !== entryId) }));
    setDeleteTarget(null);
  };

  const copyDayForward = (dayIdx) => {
    const entries = dayEntries(dayIdx);
    if (!entries.length) return;
    const next = (dayIdx + 1) % 7;
    setPlan(prev => ({ ...prev, [next]: [...(prev[next] || []), ...entries.map(e => ({ ...e, id: `${next}_${Date.now()}_${Math.random()}` }))] }));
    showToast(`Copied to ${DAY_FULL[next]}!`, 0);
  };

  // ── Reminders (Web Notifications) ────────────────────────────────────────
  const requestNotifPermission = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    const perm = await Notification.requestPermission();
    return perm === "granted";
  };

  const saveReminder = async () => {
    const granted = await requestNotifPermission();
    if (!granted) { showToast("Enable notifications in browser settings", 0); return; }
    const id = Date.now().toString();
    const newR = { id, ...reminderDraft };
    setReminders(prev => [...prev, newR]);
    scheduleReminder(newR);
    setShowReminder(false);
    showToast("Reminder set! 🔔", 0);
  };

  const scheduleReminder = (r) => {
    // Calculate ms until next occurrence of this day+time
    const [h, m] = r.time.split(":").map(Number);
    const now   = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);
    // Day of week: r.day 0=Mon→1, ... 6=Sun→0
    const targetDow = r.day === 6 ? 0 : r.day + 1;
    const diff = ((targetDow - now.getDay() + 7) % 7) * 86400000 + (target - now);
    const wait = diff <= 0 ? diff + 7 * 86400000 : diff;
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("GymTrack 🤸", { body: r.label, icon: "/icon-192.png" });
      }
    }, wait);
  };

  const deleteReminder = (id) => setReminders(prev => prev.filter(r => r.id !== id));

  // ── Gamification stats ────────────────────────────────────────────────────
  const totalScheduled = DAYS.reduce((acc, _, i) => acc + dayEntries(i).length, 0);
  const totalDone      = DAYS.reduce((acc, _, i) => acc + dayEntries(i).filter(e => isDone(i, e.id)).length, 0);
  const weekPct        = totalScheduled > 0 ? Math.round((totalDone / totalScheduled) * 100) : 0;
  const streakDays     = (() => {
    let streak = 0;
    for (let i = selectedDay; i >= 0; i--) {
      const entries = dayEntries(i);
      if (entries.length === 0) break;
      const allDone = entries.every(e => isDone(i, e.id));
      if (allDone) streak++; else break;
    }
    return streak;
  })();

  // Skills from level for autocomplete
  const levelSkills = SKILLS_BY_LEVEL[profile.level] || {};
  const allSkillsFlat = Object.entries(levelSkills).flatMap(([ev, skills]) => skills.map(s => ({ skill: s, event: ev })));
  const filteredSkills = skillSearch.trim()
    ? allSkillsFlat.filter(s => s.skill.toLowerCase().includes(skillSearch.toLowerCase()))
    : (levelSkills[addEvent] || []).map(s => ({ skill: s, event: addEvent }));

  const DEFAULT_STRETCHES_NAMES = STRETCHES.map(s => s.name);
  const DEFAULT_CONDITIONING_NAMES = CONDITIONING.map(s => s.name);

  // Entry type config
  const TYPE_CONFIG = {
    skill:        { label: "Skill",        icon: EVENT_ICONS[addEvent] || "🎯", col: "var(--accent)" },
    stretch:      { label: "Stretch",      icon: "🧘", col: "#7ecef5" },
    conditioning: { label: "Conditioning", icon: "💪", col: "#5dc8a0" },
  };
  const ENTRY_COLORS = { skill: "var(--accent)", stretch: "#7ecef5", conditioning: "#5dc8a0" };
  const ENTRY_ICONS  = { skill: "🎯", stretch: "🧘", conditioning: "💪" };

  return (
    <div style={{ padding: "0 0 40px", maxWidth: 480, margin: "0 auto" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", background: "var(--card)", border: "2px solid var(--accent)", borderRadius: 50, padding: "10px 22px", zIndex: 9999, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "toastIn .25s ease", whiteSpace: "nowrap" }}>
          <span style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 14 }}>{toast.msg}</span>
          {toast.xp > 0 && <span style={{ background: "var(--accent)", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>+{toast.xp} XP</span>}
        </div>
      )}

      {/* Exercise Timer overlay */}
      {activeTimer && (
        <ExerciseTimer
          item={{ name: activeTimer.name, sets: activeTimer.sets || "30s", icon: ENTRY_ICONS[activeTimer.type] || "⏱️" }}
          onClose={() => setActiveTimer(null)}
          onComplete={() => { toggleComplete(selectedDay, activeTimer.id); setActiveTimer(null); }}
        />
      )}

      {/* ── Add/Edit Modal ── */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 3000 }}>
          <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: "28px 22px 44px", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 20 }}>
                {editEntry ? "Edit Entry" : `Add to ${DAY_FULL[selectedDay]}`}
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "var(--input-bg)", border: "none", borderRadius: 8, color: "var(--muted-text)", width: 34, height: 34, cursor: "pointer", fontSize: 20 }}>×</button>
            </div>

            {/* Type tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              {[["skill","🎯 Skill"],["stretch","🧘 Stretch"],["conditioning","💪 Conditioning"]].map(([type, label]) => {
                const col = ENTRY_COLORS[type];
                return (
                  <button key={type} onClick={() => { setAddType(type); setActiveTab(type); setAddName(""); setSkillSearch(""); }}
                    style={{ flex: 1, padding: "9px 4px", borderRadius: 10, border: `2px solid ${addType === type ? col : "var(--border)"}`, background: addType === type ? col + "22" : "var(--input-bg)", color: addType === type ? col : "var(--muted-text)", cursor: "pointer", fontSize: 11, fontWeight: addType === type ? 700 : 400, transition: "all .15s", textAlign: "center" }}>
                    {label}
                  </button>
                );
              })}
            </div>

            {/* SKILL: event + skill picker */}
            {addType === "skill" && (
              <>
                <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Event</p>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {Object.keys(EVENT_COLORS).map(ev => (
                    <button key={ev} onClick={() => { setAddEvent(ev); setSkillSearch(""); setAddName(""); }}
                      style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: `2px solid ${addEvent === ev ? EVENT_COLORS[ev] : "var(--border)"}`, background: addEvent === ev ? EVENT_COLORS[ev] + "22" : "var(--input-bg)", color: addEvent === ev ? EVENT_COLORS[ev] : "var(--muted-text)", cursor: "pointer", fontSize: 10, fontWeight: addEvent === ev ? 700 : 400, transition: "all .15s", textAlign: "center" }}>
                      <div>{EVENT_ICONS[ev]}</div><div style={{ marginTop: 2 }}>{ev}</div>
                    </button>
                  ))}
                </div>
                <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Search skills or type custom…"
                  style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
                <div style={{ maxHeight: 170, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                  {filteredSkills.map(({ skill, event: ev }) => (
                    <button key={skill} onClick={() => { setAddName(skill); setAddEvent(ev); }}
                      style={{ padding: "10px 13px", borderRadius: 10, textAlign: "left", border: `2px solid ${addName === skill ? EVENT_COLORS[ev] : "var(--border)"}`, background: addName === skill ? EVENT_COLORS[ev] + "22" : "var(--input-bg)", color: addName === skill ? EVENT_COLORS[ev] : "var(--text)", cursor: "pointer", fontSize: 13, fontWeight: addName === skill ? 700 : 400, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{skill}</span>
                      {skillSearch && ev !== addEvent && <span style={{ fontSize: 10, background: EVENT_COLORS[ev] + "33", color: EVENT_COLORS[ev], borderRadius: 8, padding: "2px 7px" }}>{ev}</span>}
                    </button>
                  ))}
                  {skillSearch.trim() && !filteredSkills.find(s => s.skill.toLowerCase() === skillSearch.toLowerCase()) && (
                    <button onClick={() => setAddName(skillSearch.trim())} style={{ padding: "10px 13px", borderRadius: 10, textAlign: "left", border: "2px dashed var(--accent)66", background: "var(--input-bg)", color: "var(--accent)", cursor: "pointer", fontSize: 13 }}>➕ Add "{skillSearch.trim()}" as custom</button>
                  )}
                </div>
              </>
            )}

            {/* STRETCH: pick from list or custom */}
            {addType === "stretch" && (
              <>
                <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Choose Stretch</p>
                <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                  {DEFAULT_STRETCHES_NAMES.map(s => (
                    <button key={s} onClick={() => setAddName(s)} style={{ padding: "9px 13px", borderRadius: 10, textAlign: "left", border: `2px solid ${addName === s ? "#7ecef5" : "var(--border)"}`, background: addName === s ? "#7ecef522" : "var(--input-bg)", color: addName === s ? "#7ecef5" : "var(--text)", cursor: "pointer", fontSize: 13, fontWeight: addName === s ? 700 : 400 }}>{s}</button>
                  ))}
                </div>
                <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Or type custom stretch…"
                  style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, marginBottom: 14, boxSizing: "border-box" }} />
              </>
            )}

            {/* CONDITIONING: pick from list or custom */}
            {addType === "conditioning" && (
              <>
                <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Choose Exercise</p>
                <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                  {DEFAULT_CONDITIONING_NAMES.map(s => (
                    <button key={s} onClick={() => setAddName(s)} style={{ padding: "9px 13px", borderRadius: 10, textAlign: "left", border: `2px solid ${addName === s ? "#5dc8a0" : "var(--border)"}`, background: addName === s ? "#5dc8a022" : "var(--input-bg)", color: addName === s ? "#5dc8a0" : "var(--text)", cursor: "pointer", fontSize: 13, fontWeight: addName === s ? 700 : 400 }}>{s}</button>
                  ))}
                </div>
                <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Or type custom exercise…"
                  style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, marginBottom: 14, boxSizing: "border-box" }} />
              </>
            )}

            {/* Sets / Duration */}
            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
              {addType === "skill" ? "Reps / Focus" : "Sets / Duration"}
            </p>
            <input value={addSets} onChange={e => setAddSets(e.target.value)}
              placeholder={addType === "skill" ? "e.g. 5 reps, 3 run-throughs" : "e.g. 3×30s, Hold 45 sec"}
              style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, marginBottom: 14, boxSizing: "border-box" }} />

            <p style={{ color: "var(--muted-text)", fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Note (optional)</p>
            <input value={addNote} onChange={e => setAddNote(e.target.value)} placeholder="e.g. Focus on arm swing"
              style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, marginBottom: 22, boxSizing: "border-box" }} />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveEntry} disabled={!addName.trim()}
                style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: addName.trim() ? "var(--accent)" : "var(--muted)", color: "#fff", cursor: addName.trim() ? "pointer" : "not-allowed", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>
                {editEntry ? "Save Changes" : "Add to Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: 24 }}>
          <div style={{ background: "var(--card)", borderRadius: 20, padding: 28, maxWidth: 300, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🗑️</div>
            <p style={{ color: "var(--text)", fontSize: 16, fontFamily: "var(--font-display)", marginBottom: 6 }}>Remove this entry?</p>
            <p style={{ color: "var(--muted-text)", fontSize: 13, marginBottom: 22 }}>{deleteTarget.entry.name} from {DAY_FULL[deleteTarget.dayIdx]}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => deleteEntry(deleteTarget.dayIdx, deleteTarget.entry.id)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "#e07b54", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 3000 }}>
          <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: "28px 22px 44px", width: "100%", maxWidth: 480, boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 20 }}>🔔 Set Reminder</h3>
              <button onClick={() => setShowReminder(false)} style={{ background: "var(--input-bg)", border: "none", borderRadius: 8, color: "var(--muted-text)", width: 34, height: 34, cursor: "pointer", fontSize: 20 }}>×</button>
            </div>
            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Day</p>
            <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
              {DAYS.map((d, i) => (
                <button key={d} onClick={() => setReminderDraft(r => ({ ...r, day: i }))}
                  style={{ flex: 1, padding: "8px 4px", borderRadius: 9, border: `2px solid ${reminderDraft.day === i ? "var(--accent)" : "var(--border)"}`, background: reminderDraft.day === i ? "var(--accent-dim)" : "var(--input-bg)", color: reminderDraft.day === i ? "var(--accent)" : "var(--muted-text)", cursor: "pointer", fontSize: 11, fontWeight: reminderDraft.day === i ? 700 : 400 }}>{d}</button>
              ))}
            </div>
            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Time</p>
            <input type="time" value={reminderDraft.time} onChange={e => setReminderDraft(r => ({ ...r, time: e.target.value }))}
              style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 15, marginBottom: 14, boxSizing: "border-box", colorScheme: "dark" }} />
            <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Message</p>
            <input value={reminderDraft.label} onChange={e => setReminderDraft(r => ({ ...r, label: e.target.value }))}
              style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, marginBottom: 20, boxSizing: "border-box" }} />
            {reminders.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: "var(--muted-text)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Active Reminders</p>
                {reminders.map(r => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--input-bg)", borderRadius: 10, padding: "9px 12px", marginBottom: 6 }}>
                    <span style={{ color: "var(--text)", fontSize: 13 }}>{DAYS[r.day]} at {r.time} — {r.label}</span>
                    <button onClick={() => deleteReminder(r.id)} style={{ background: "none", border: "none", color: "#e07b54", cursor: "pointer", fontSize: 16 }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowReminder(false)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-text)", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveReminder} style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>Set Reminder 🔔</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 26 }}>{(profile.screenIcons || {}).planner || "📅"} Training Plan</h2>
              <ScreenIconButton screenKey="planner" defaultIcon="📅" profile={profile} onUpdateProfile={onUpdateProfile} />
            </div>
            <p style={{ color: "var(--muted-text)", fontSize: 13 }}>{profile.name} · {profile.level}</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setShowReminder(true)}
              style={{ padding: "7px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-text)", cursor: "pointer", fontSize: 13 }} title="Set training reminders">🔔</button>
            {["week","day"].map(m => (
              <button key={m} onClick={() => setViewMode(m)} style={{ padding: "7px 12px", borderRadius: 10, border: `1px solid ${viewMode === m ? "var(--accent)" : "var(--border)"}`, background: viewMode === m ? "var(--accent-dim)" : "var(--card)", color: viewMode === m ? "var(--accent)" : "var(--muted-text)", cursor: "pointer", fontSize: 12, fontWeight: viewMode === m ? 700 : 400 }}>{m === "week" ? "Week" : "Day"}</button>
            ))}
          </div>
        </div>

        {/* Week nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <button onClick={() => setWeekOffset(w => w - 1)} style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", cursor: "pointer", fontSize: 16 }}>‹</button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>
              {weekOffset === 0 ? "This Week" : weekOffset === 1 ? "Next Week" : weekOffset === -1 ? "Last Week" : `Week of ${weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
            </p>
            <p style={{ color: "var(--muted-text)", fontSize: 11 }}>{weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
          </div>
          <button onClick={() => setWeekOffset(w => w + 1)} style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", cursor: "pointer", fontSize: 16 }}>›</button>
        </div>

        {/* Gamification stats */}
        {totalScheduled > 0 && (
          <div style={{ background: "var(--card)", borderRadius: 14, padding: "12px 16px", marginBottom: 16, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{weekPct}%</div>
                  <div style={{ color: "var(--muted-text)", fontSize: 9 }}>Week Done</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#e6b740", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{streakDays}🔥</div>
                  <div style={{ color: "var(--muted-text)", fontSize: 9 }}>Day Streak</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#5dc8a0", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{totalDone}/{totalScheduled}</div>
                  <div style={{ color: "var(--muted-text)", fontSize: 9 }}>Completed</div>
                </div>
              </div>
              {weekPct === 100 && <span style={{ fontSize: 24 }}>🏆</span>}
            </div>
            <div style={{ height: 8, background: "var(--input-bg)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${weekPct}%`, background: weekPct === 100 ? "#5dc8a0" : "var(--accent)", borderRadius: 4, transition: "width .5s ease" }} />
            </div>
          </div>
        )}
      </div>

      {/* ── WEEK VIEW ── */}
      {viewMode === "week" && (
        <div style={{ padding: "0 20px" }}>
          {/* Day strip */}
          <div style={{ display: "flex", gap: 5, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
            {DAYS.map((d, i) => {
              const date = weekDates[i];
              const isToday    = date.toDateString() === todayStr;
              const isSelected = selectedDay === i;
              const entries    = dayEntries(i);
              const allDone    = entries.length > 0 && entries.every(e => isDone(i, e.id));
              return (
                <button key={d} onClick={() => setSelectedDay(i)} style={{ flex: "0 0 auto", width: 50, padding: "8px 4px", borderRadius: 12, border: `2px solid ${isSelected ? "var(--accent)" : isToday ? "var(--accent)55" : "var(--border)"}`, background: isSelected ? "var(--accent-dim)" : allDone ? "#5dc8a055" : "var(--card)", cursor: "pointer", textAlign: "center", transition: "all .15s" }}>
                  <div style={{ color: "var(--muted-text)", fontSize: 10, marginBottom: 4 }}>{d}</div>
                  <div style={{ color: isToday ? "var(--accent)" : "var(--text)", fontSize: 14, fontWeight: isToday ? 700 : 400 }}>{date.getDate()}</div>
                  {entries.length > 0 && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: allDone ? "#5dc8a0" : "var(--accent)", margin: "4px auto 0" }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 18 }}>
                {DAY_FULL[selectedDay]}
                {weekDates[selectedDay].toDateString() === todayStr && (
                  <span style={{ marginLeft: 8, fontSize: 11, color: "var(--accent)", background: "var(--accent-dim)", padding: "2px 8px", borderRadius: 10 }}>Today</span>
                )}
              </h3>
              <div style={{ display: "flex", gap: 6 }}>
                {dayEntries(selectedDay).length > 0 && (
                  <button onClick={() => copyDayForward(selectedDay)} style={{ padding: "7px 12px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--card)", color: "var(--muted-text)", cursor: "pointer", fontSize: 11 }}>Copy →</button>
                )}
                <button onClick={() => openAdd(selectedDay, "skill")} style={{ padding: "7px 10px", borderRadius: 9, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>🎯</button>
                <button onClick={() => openAdd(selectedDay, "stretch")} style={{ padding: "7px 10px", borderRadius: 9, border: "none", background: "#7ecef5", color: "#0f0e17", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>🧘</button>
                <button onClick={() => openAdd(selectedDay, "conditioning")} style={{ padding: "7px 10px", borderRadius: 9, border: "none", background: "#5dc8a0", color: "#0f0e17", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>💪</button>
              </div>
            </div>

            {dayEntries(selectedDay).length === 0 ? (
              <div style={{ textAlign: "center", padding: "36px 20px", background: "var(--card)", borderRadius: 16, border: "2px dashed var(--border)" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
                <p style={{ color: "var(--text)", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No plan for {DAY_FULL[selectedDay]}</p>
                <p style={{ color: "var(--muted-text)", fontSize: 12, marginBottom: 16 }}>Add skills, stretches, or conditioning</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <button onClick={() => openAdd(selectedDay, "skill")} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>🎯 Skill</button>
                  <button onClick={() => openAdd(selectedDay, "stretch")} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "#7ecef5", color: "#0f0e17", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>🧘 Stretch</button>
                  <button onClick={() => openAdd(selectedDay, "conditioning")} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "#5dc8a0", color: "#0f0e17", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>💪 Conditioning</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {dayEntries(selectedDay).map(entry => {
                  const done = isDone(selectedDay, entry.id);
                  const col  = ENTRY_COLORS[entry.type || "skill"] || "var(--accent)";
                  const icon = entry.type === "stretch" ? "🧘" : entry.type === "conditioning" ? "💪" : (EVENT_ICONS[entry.event] || "🎯");
                  const hasTimer = entry.sets && parseTimerSeconds(entry.sets);
                  return (
                    <div key={entry.id} style={{ background: done ? col + "18" : "var(--card)", borderRadius: 14, border: `2px solid ${done ? col + "88" : col + "44"}`, padding: "12px 14px", transition: "all .2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={() => toggleComplete(selectedDay, entry.id)} style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, border: `2px solid ${done ? col : "var(--border)"}`, background: done ? col : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#fff", transition: "all .2s" }}>{done ? "✓" : ""}</button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>
                            <span style={{ fontSize: 13 }}>{icon}</span>
                            <span style={{ color: done ? col : "var(--text)", fontSize: 14, fontWeight: 600, textDecoration: done ? "line-through" : "none" }}>{entry.name}</span>
                            <span style={{ fontSize: 9, background: col + "33", color: col, borderRadius: 8, padding: "1px 6px", fontWeight: 700, textTransform: "capitalize" }}>{entry.type || "skill"}</span>
                          </div>
                          {(entry.sets || entry.note) && (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {entry.sets && <span style={{ color: "var(--muted-text)", fontSize: 11 }}>{entry.sets}</span>}
                              {entry.note && <span style={{ color: "var(--muted-text)", fontSize: 11, fontStyle: "italic" }}>{entry.note}</span>}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {hasTimer && !done && (
                            <button onClick={() => setActiveTimer(entry)} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${col}44`, background: col + "22", color: col, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }} title="Start timer">⏱</button>
                          )}
                          <button onClick={() => openEdit(selectedDay, entry)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--muted-text)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✏️</button>
                          <button onClick={() => setDeleteTarget({ dayIdx: selectedDay, entry })} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #e07b5444", background: "#e07b5411", color: "#e07b54", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 2 }}>
                  <span style={{ color: "var(--muted-text)", fontSize: 12 }}>
                    {dayEntries(selectedDay).filter(e => isDone(selectedDay, e.id)).length}/{dayEntries(selectedDay).length} done
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DAY VIEW ── */}
      {viewMode === "day" && (
        <div style={{ padding: "0 16px" }}>
          {DAYS.map((d, i) => {
            const date    = weekDates[i];
            const isToday = date.toDateString() === todayStr;
            const entries = dayEntries(i);
            const doneCount = entries.filter(e => isDone(i, e.id)).length;
            return (
              <div key={d} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: isToday ? "var(--accent-dim)" : "var(--card)", borderRadius: entries.length > 0 ? "14px 14px 0 0" : 14, border: `1px solid ${isToday ? "var(--accent)55" : "var(--border)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ textAlign: "center", minWidth: 38 }}>
                      <div style={{ color: "var(--muted-text)", fontSize: 10 }}>{d}</div>
                      <div style={{ color: isToday ? "var(--accent)" : "var(--text)", fontSize: 17, fontWeight: isToday ? 700 : 500 }}>{date.getDate()}</div>
                    </div>
                    {entries.length > 0 && (
                      <span style={{ color: doneCount === entries.length ? "#5dc8a0" : "var(--muted-text)", fontSize: 12 }}>{doneCount}/{entries.length} done</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => { setSelectedDay(i); openAdd(i, "skill"); }} style={{ padding: "4px 8px", borderRadius: 7, border: "none", background: isToday ? "var(--accent)" : "var(--border)", color: isToday ? "#fff" : "var(--muted-text)", cursor: "pointer", fontSize: 11 }}>+</button>
                  </div>
                </div>
                {entries.length > 0 && (
                  <div style={{ background: "var(--card)", borderRadius: "0 0 14px 14px", border: "1px solid var(--border)", borderTop: "none", padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                    {entries.map(entry => {
                      const done = isDone(i, entry.id);
                      const col  = ENTRY_COLORS[entry.type || "skill"] || "var(--accent)";
                      const icon = entry.type === "stretch" ? "🧘" : entry.type === "conditioning" ? "💪" : (EVENT_ICONS[entry.event] || "🎯");
                      return (
                        <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => toggleComplete(i, entry.id)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? col : "var(--border)"}`, background: done ? col : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>{done ? "✓" : ""}</button>
                          <span style={{ fontSize: 12 }}>{icon}</span>
                          <span style={{ flex: 1, color: done ? "var(--muted-text)" : "var(--text)", fontSize: 13, textDecoration: done ? "line-through" : "none" }}>{entry.name}</span>
                          {entry.sets && <span style={{ color: "var(--muted-text)", fontSize: 10 }}>{entry.sets}</span>}
                          <div style={{ display: "flex", gap: 3 }}>
                            <button onClick={() => { setSelectedDay(i); openEdit(i, entry); }} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid var(--border)", background: "var(--input-bg)", cursor: "pointer", fontSize: 11, color: "var(--muted-text)", display: "flex", alignItems: "center", justifyContent: "center" }}>✏️</button>
                            <button onClick={() => setDeleteTarget({ dayIdx: i, entry })} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #e07b5433", background: "#e07b5411", cursor: "pointer", fontSize: 11, color: "#e07b54", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Mount
const _root = document.getElementById("root");
if (_root) createRoot(_root).render(<App />);

// Mount
const _root = document.getElementById("root");
if (_root) createRoot(_root).render(<App />);
