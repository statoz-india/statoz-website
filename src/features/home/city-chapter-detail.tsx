'use client';

import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { CityIcon } from './city-icons';
import { JOURNEY_GAMES, type JourneyChapterId } from './city-journey-config';
import c from './city-chapter-detail.module.css';

// Archived match and quiz result: official sources and verification dates in
// docs/CITY-CHAPTER-DETAILS.md. The forecast is deliberately illustrative.
const MATCH_SOURCE = 'https://www.iplt20.com/matches/bd7c710f-ce79-40fc-93d9-fbf4bf83a794/More/scorecard';
const NBA_SOURCE = 'https://www.nba.com/news/2026-nba-finals-schedule';
const contenders = [
  { name:'Lamine Yamal', label:'Yamal', color:'cyan', values:[24,26,23,30,29,35,34,39,37,44] },
  { name:'Kylian Mbappé', label:'Mbappé', color:'gold', values:[38,37,41,36,39,33,36,31,35,34] },
  { name:'Erling Haaland', label:'Haaland', color:'violet', values:[38,37,36,34,32,32,30,30,28,22] },
] as const;
const answers = ['Boston Celtics','New York Knicks','Oklahoma City Thunder','San Antonio Spurs'];
const SPORTS = new Set(JOURNEY_GAMES.map(game => game.sport)).size;
// 15–50% spans the chart's full height, so the three lines separate instead of bunching at the top.
const y = (value:number) => 4 + (50 - value) * 1.6;
const point = (value:number,index:number) => `${index*56},${y(value)}`;

type DockProps = { id: JourneyChapterId; label: string; className: string; labelledBy?: string; status?: ReactNode; action: ReactNode; children: ReactNode };

/** One broadcast lower-third: the chapter's proof on top, its status and next step in the footer. */
function Dock({ id, label, className, labelledBy, status, action, children }: DockProps) {
  return <section className={c.dock + ' ' + className} data-chapter-detail={id} aria-label={labelledBy ? undefined : label} aria-labelledby={labelledBy}>
    {children}
    <div className={c.footer}><div className={c.status}>{status}</div>{action}</div>
  </section>;
}

function MatchDetail({ action }: { action: ReactNode }) {
  return <Dock id="follow" label="RCB versus CSK match result" className={c.match} action={action} status={<p className={c.result}><i aria-hidden="true" />RCB won by <b>2 runs</b></p>}>
    <div className={c.meta}><span>IPL · 3 May 2025 · Result</span><a href={MATCH_SOURCE} target="_blank" rel="noreferrer" aria-label="Read the official RCB versus CSK scorecard">Scorecard<CityIcon name="external" /></a></div>
    <div className={c.scoreboard}>
      <div className={c.team} data-winner><span className={c.badge} data-team="rcb">RCB</span><span className={c.teamName}><b>Royal Challengers</b><small>Bengaluru</small></span><span className={c.score}><strong>213<span>/5</span></strong><small>20.0 ov</small></span></div>
      <div className={c.team}><span className={c.badge} data-team="csk">CSK</span><span className={c.teamName}><b>Chennai Super Kings</b><small>Chennai</small></span><span className={c.score}><strong>211<span>/5</span></strong><small>20.0 ov</small></span></div>
    </div>
  </Dock>;
}

function PredictionDetail({ action }: { action: ReactNode }) {
  const [selected,setSelected] = useState(0);
  const gradient=useId().replace(/:/g,'');
  const current=contenders[selected];
  return <Dock id="predict" label="Ballon d’Or forecast" labelledBy="city-prediction-question" className={c.prediction} action={action}
    status={<div className={c.contenders} role="group" aria-label="Highlight a Ballon d’Or prediction">
      {contenders.map((candidate,index)=><button type="button" key={candidate.name} aria-pressed={selected===index} aria-label={`${candidate.name}, ${candidate.values[9]} percent illustrative forecast`} onClick={()=>setSelected(index)} style={{'--series-color':`var(--ds-color-accent-${candidate.color})`} as CSSProperties}><span>{candidate.label}</span><b>{candidate.values[9]}<small>%</small></b></button>)}
    </div>}>
    <div className={c.question}><h3 id="city-prediction-question">Who wins the Ballon d’Or 2027?</h3><span className={c.tag}>Illustrative forecast</span></div>
    <div className={c.chartFrame} style={{'--series-color':`var(--ds-color-accent-${current.color})`,'--end':`${y(current.values[9])/64*100}%`} as CSSProperties}>
    <svg className={c.chart} viewBox="0 0 504 64" preserveAspectRatio="none" role="img" aria-label={`Illustrative forecast, not live probabilities. Lamine Yamal 44 percent, Kylian Mbappé 34 percent, Erling Haaland 22 percent. Highlighting ${current.name}.`}>
      <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={`var(--ds-color-accent-${current.color})`} stopOpacity=".2" /><stop offset="1" stopColor={`var(--ds-color-accent-${current.color})`} stopOpacity="0" /></linearGradient></defs>
      <path className={c.chartGrid} d="M0 63.5H504" />
      <path d={`M${current.values.map(point).join(' L')} L504 64 L0 64 Z`} fill={`url(#${gradient})`} />
      {contenders.map((candidate,index)=><polyline key={candidate.name} points={candidate.values.map(point).join(' ')} className={c.chartLine} data-highlighted={selected===index} style={{'--series-color':`var(--ds-color-accent-${candidate.color})`} as CSSProperties} />)}
    </svg>
    <span className={c.chartEnd} aria-hidden="true" />
    </div>
  </Dock>;
}

function QuizDetail({ action }: { action: ReactNode }) {
  const [answer,setAnswer]=useState<number|null>(null);
  const correct=answer===1;
  return <Dock id="knowledge" label="NBA quiz" labelledBy="city-quiz-question" className={c.quiz} action={action}
    status={<p className={c.feedback} role="status" aria-live="polite" data-result={answer===null?undefined:correct?'correct':'incorrect'}>{answer===null?'Pick your champion.':correct?<>Correct. New York won the series 4–1. <a href={NBA_SOURCE} target="_blank" rel="noreferrer" aria-label="Read the 2026 NBA Finals result"><CityIcon name="external" /></a></>:'Not quite. Try another team.'}</p>}>
    <h3 id="city-quiz-question">Who were the NBA champions of 2026?</h3>
    <div className={c.answers} role="group" aria-labelledby="city-quiz-question">
      {answers.map((team,index)=><button type="button" key={team} aria-pressed={answer===index} data-result={answer===index ? correct?'correct':'incorrect':undefined} onClick={()=>setAnswer(index)}><span>{team}</span>{answer===index && <CityIcon name={correct?'check':'close'} className={c.answerMark} />}</button>)}
    </div>
  </Dock>;
}

function GamesDetail({ action }: { action: ReactNode }) {
  return <Dock id="games" label="Discover StatOz games" className={c.games} action={action} status={<p className={c.count}><b>{JOURNEY_GAMES.length}</b> games · <b>{SPORTS}</b> sports</p>}>
    <ul className={c.gameStrip} aria-label="Games to play">
      {JOURNEY_GAMES.slice(0,6).map(game=><li key={game.slug}><a href={'https://games.statoz.in/play/'+game.slug} aria-label={'Play '+game.name}><span className={c.gameArt}><img src={game.image} alt="" width="180" height="240" loading="lazy" /></span><span className={c.gameCaption}><small>{game.sport}</small><b>{game.name}</b></span></a></li>)}
    </ul>
  </Dock>;
}

export function CityChapterDetail({ id, action }: { id: JourneyChapterId; action: ReactNode }) {
  if(id==='follow') return <MatchDetail action={action} />;
  if(id==='predict') return <PredictionDetail action={action} />;
  if(id==='knowledge') return <QuizDetail action={action} />;
  if(id==='games') return <GamesDetail action={action} />;
  return null;
}
