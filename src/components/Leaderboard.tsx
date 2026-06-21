"use client";

import { useState } from "react";
import { BOARDS, LB_SPORTS, type Move } from "@/lib/data";

const MOVE: Record<Move, { cls: string; sym: string }> = {
  up: { cls: "mv--up", sym: "▲" },
  down: { cls: "mv--down", sym: "▼" },
  hold: { cls: "mv--hold", sym: "—" },
  new: { cls: "mv--new", sym: "NEW" },
};

function Mv({ mv, by }: { mv: Move; by?: number }) {
  const m = MOVE[mv];
  return (
    <span className={`mv ${m.cls}`}>
      {mv === "new" ? "NEW" : mv === "hold" ? "—" : `${m.sym}${by ?? ""}`}
    </span>
  );
}

export default function Leaderboard() {
  const [active, setActive] = useState(BOARDS[0].key);
  const board = BOARDS.find((b) => b.key === active) ?? BOARDS[0];
  const podium = board.rows.slice(0, 3);
  const rest = board.rows.slice(3);
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd

  return (
    <section className="section leaderboard" id="leaderboard">
      <div className="wrap">
        <header className="sec-head sec-head--row reveal">
          <div>
            <span className="sec-head__tag">// GLOBAL LEADERBOARD · LIVE</span>
            <h2 className="sec-head__title">
              KNOW WHERE YOU <span className="grad">STAND.</span>
            </h2>
          </div>
          <p className="sec-head__lead sec-head__lead--right">
            Four boards, one ladder. Match Day XP, tourneys, Oz Coins and game
            wins -with live movement and your rank wherever you land.
          </p>
        </header>

        <div className="lb__tabs reveal" role="tablist">
          {BOARDS.map((b) => (
            <button
              key={b.key}
              className={`lb__tab${b.key === active ? " is-active" : ""}`}
              onClick={() => setActive(b.key)}
              role="tab"
              aria-selected={b.key === active}
            >
              {b.label}
              {b.live && b.key === active && <i className="live-dot" />}
            </button>
          ))}
        </div>

        <div className="lb__sports reveal">
          {LB_SPORTS.map((s, i) => (
            <span
              key={s}
              className={`pill pill--sm${i === 0 ? " is-active" : ""}`}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="lb__panel reveal" data-hud>
          {/* podium */}
          <ol className="podium">
            {podiumOrder.map((idx, slot) => {
              const r = podium[idx];
              const place = idx + 1;
              return (
                <li
                  key={r.tag}
                  className={`pod pod--${place} pod--slot${slot + 1}`}
                >
                  <span className="pod__rank">{place}</span>
                  <span className="pod__av">
                    <img src={`/assets/avatars/${r.av}.webp`} alt="" />
                  </span>
                  <span className="pod__tag">{r.tag}</span>
                  <span className="pod__val">
                    {r.val} <small>{board.unit}</small>
                  </span>
                  <Mv mv={r.mv} by={r.by} />
                </li>
              );
            })}
          </ol>

          {/* ranked rows */}
          <ol className="lb__list" start={4}>
            {rest.map((r, i) => (
              <li className="lbrow" key={r.tag}>
                <span className="lbrow__rank">{i + 4}</span>
                <span className="lbrow__av">
                  <img src={`/assets/avatars/${r.av}.webp`} alt="" />
                </span>
                <span className="lbrow__who">
                  <span className="lbrow__tag">{r.tag}</span>
                  <span className="lbrow__loc">{r.loc}</span>
                </span>
                <Mv mv={r.mv} by={r.by} />
                <span className="lbrow__val">
                  {r.val} <small>{board.unit}</small>
                </span>
              </li>
            ))}
          </ol>

          {/* sticky you */}
          <div className="lbrow lbrow--you">
            <span className="lbrow__rank">{board.you.rank}</span>
            <span className="lbrow__av lbrow__av--you">YOU</span>
            <span className="lbrow__who">
              <span className="lbrow__tag">YOU</span>
              <span className="lbrow__loc">{board.you.loc}</span>
            </span>
            <Mv mv={board.you.mv} by={board.you.by} />
            <span className="lbrow__val">
              {board.you.val} <small>{board.unit}</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
