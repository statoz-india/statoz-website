import { Fragment } from "react";

const ITEMS = [
  "FREE TO PLAY",
  "PREDICT EVERY FIXTURE",
  "EARN XP & OZ COINS",
  "BUILD YOUR STREAK",
  "CLIMB THE GLOBAL BOARD",
  "GAMES COMING SOON",
];

export default function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[...ITEMS, ...ITEMS].map((t, i) => (
          <Fragment key={i}>
            <span>{t}</span>
            <i>◆</i>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
