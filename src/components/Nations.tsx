import { Fragment } from "react";

/* Leagues that get quizzes in the app. Keep in step with what the app
   actually covers (last checked against the 1 Nov 2026 backup). */
const LEAGUES = [
  "PREMIER LEAGUE",
  "LA LIGA",
  "SERIE A",
  "CHAMPIONS LEAGUE",
  "BUNDESLIGA",
  "LIGUE 1",
  "NBA",
  "IPL",
  "ISL",
  "MLS",
  "SAUDI PRO LEAGUE",
  "F1",
];

/* Section id stays "nations" so existing /nations and /#nations links work. */
export default function Nations() {
  return (
    <section className="nations" id="nations">
      <div className="nations__label">
        <span>FOOTBALL · BASKETBALL · CRICKET · F1 · A QUIZ ON EVERY BIG MATCH</span>
      </div>
      <div className="marquee">
        <div className="marquee__track">
          {[...LEAGUES, ...LEAGUES].map((n, i) => (
            <Fragment key={i}>
              <span>{n}</span>
              <b>{"★"}</b>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
