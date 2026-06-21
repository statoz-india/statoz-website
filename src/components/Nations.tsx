import { Fragment } from "react";

const NATIONS = [
  "CANADA",
  "MEXICO",
  "USA",
  "ARGENTINA",
  "BRAZIL",
  "COLOMBIA",
  "ECUADOR",
  "PARAGUAY",
  "URUGUAY",
  "FRANCE",
  "ENGLAND",
  "SPAIN",
  "PORTUGAL",
  "GERMANY",
  "NETHERLANDS",
  "BELGIUM",
  "CROATIA",
  "NORWAY",
  "AUSTRIA",
  "BOSNIA AND HERZEGOVINA",
  "CZECHIA",
  "SCOTLAND",
  "SWEDEN",
  "SWITZERLAND",
  "T\u00dcRK\u0130YE",
  "JAPAN",
  "AUSTRALIA",
  "IR IRAN",
  "IRAQ",
  "JORDAN",
  "KOREA REPUBLIC",
  "QATAR",
  "SAUDI ARABIA",
  "UZBEKISTAN",
  "MOROCCO",
  "SENEGAL",
  "ALGERIA",
  "CABO VERDE",
  "CONGO DR",
  "C\u00d4TE D'IVOIRE",
  "EGYPT",
  "GHANA",
  "SOUTH AFRICA",
  "TUNISIA",
  "CURA\u00c7AO",
  "HAITI",
  "PANAMA",
  "NEW ZEALAND",
];

export default function Nations() {
  return (
    <section className="nations" id="nations">
      <div className="nations__label">
        <span>48 NATIONS · WORLD CUP 2026 · A QUIZ ON EVERY MATCH</span>
      </div>
      <div className="marquee">
        <div className="marquee__track">
          {[...NATIONS, ...NATIONS].map((n, i) => (
            <Fragment key={i}>
              <span>{n}</span>
              <b>{"\u2605"}</b>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
