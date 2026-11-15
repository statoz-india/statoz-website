import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreIcon from '@/components/StoreIcon';
import { appStores, featuredGames, homeFaq, products } from './content';
import { LegacyAnchorNavigation } from './stadium-interactions';
import s from './stadium-home.module.css';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} /></svg>;
}
function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className={s.eyebrow}><span>{number}</span>{children}</p>;
}
export default function StadiumHome() {
  return <div className={s.home} id="top">
    <a className={s.skipLink} href="#main">Skip to content</a>
    <Header stadium />
    <LegacyAnchorNavigation />
    <main id="main">
      <section className={s.hero} id="home" aria-labelledby="hero-title">
        <picture className={s.heroImage}>
          <source media="(max-width: 600px)" srcSet="/statoz-website/assets/stadium/stadium-mobile.avif" type="image/avif" />
          <source media="(max-width: 600px)" srcSet="/statoz-website/assets/stadium/stadium-mobile.webp" />
          <source srcSet="/statoz-website/assets/stadium/stadium-desktop.avif" type="image/avif" />
          <img src="/statoz-website/assets/stadium/stadium-desktop.webp" width="1672" height="941" alt="" fetchPriority="high" />
        </picture>
        <div className={s.heroShade} />
        <div className={s.heroContent}>
          <p className={s.welcome}><span /> THE LIGHTS ARE ON. YOU’RE HOME.</p>
          <h1 id="hero-title">Your daily home<br /> for <em>sport.</em></h1>
          <p className={s.heroIntro}>For the calls you make. The games you play.<br className={s.desktopBreak} /> And the love of sport that brings you back.</p>
          <div className={s.actions}>
            <a className={s.primary} href="#play" data-analytics-event="product_select" data-analytics-cta-location="hero" data-analytics-product="web">Play on web <Arrow /></a>
            <a className={s.secondary} href="#download" data-analytics-event="product_select" data-analytics-cta-location="hero" data-analytics-product="app">Get the app <Arrow /></a>
          </div>
          <div className={s.heroNote}><span>SPORTS</span><i /> <span>GAMES</span><i /> <span>YOUR EVERYDAY ESCAPE</span></div>
        </div>
        <div className={s.heroBottom}><span>EVERY FAN HAS A HOME GROUND.</span><a href="#play">FIND YOURS <span aria-hidden="true">↓</span></a></div>
      </section>

      <section className={s.gates} id="play" aria-label="Choose your StatOz experience">
        <a href="#sports" className={s.gate} data-analytics-event="product_select" data-analytics-product="sports" data-analytics-cta-location="entry">
          <span className={s.gateNumber}>01</span><div><span className={s.micro}>FOR THE FAN IN YOU</span><h2>StatOz <strong>Sports</strong></h2><p>Follow it. Read it. Call it.</p></div><Arrow diagonal />
        </a>
        <a href="#games" className={s.gate} data-analytics-event="product_select" data-analytics-product="games" data-analytics-cta-location="entry">
          <span className={s.gateNumber}>02</span><div><span className={s.micro}>FOR THE PLAYER IN YOU</span><h2>StatOz <strong>Games</strong></h2><p>A little competition. One more round.</p></div><Arrow diagonal />
        </a>
      </section>

      <section className={`${s.section} ${s.sports}`} id="sports" aria-labelledby="sports-title">
        <div className={s.sportsCopy}>
          <SectionLabel number="01">STATOZ SPORTS</SectionLabel>
          <h2 id="sports-title">You don’t just<br />watch the game.<br /><span>You read it.</span></h2>
          <p>That feeling before kick-off. The stat everyone missed. The call you knew you had to make. Give your sporting instinct a place to play.</p>
          <ul className={s.featureList}><li><b>Follow the action</b><span>Discover matches and explore the stats.</span></li><li><b>Back your knowledge</b><span>Make predictions and explore Oz Coin picks.</span></li><li><b>Stay sharp</b><span>Put your sporting memory to the quiz.</span></li></ul>
          <a className={s.primary} href={products.sports.href} data-analytics-event="web_launch" data-analytics-product="sports" data-analytics-cta-location="sports">Explore Sports <Arrow diagonal /></a>
          <p className={s.previewNote}>WEB PREVIEW · Includes example match data</p>
        </div>
        <figure className={s.productFrame}>
          <div className={s.frameBar}><span><i /> INSIDE STATOZ SPORTS</span><span>PREVIEW</span></div>
          <Image src="/statoz-website/assets/stadium/sports-preview.webp" alt="StatOz Sports preview showing match discovery, prediction cards and sports navigation" width={1200} height={900} sizes="(max-width: 850px) 92vw, 55vw" />
          <figcaption>The matchday view. Your next call starts here.<span>Product preview · Sample data</span></figcaption>
        </figure>
      </section>

      <section className={`${s.section} ${s.games}`} id="games" aria-labelledby="games-title">
        <div className={s.sectionHeading}><div><SectionLabel number="02">STATOZ GAMES</SectionLabel><h2 id="games-title">The final whistle?<br /><span>Just the beginning.</span></h2></div><div className={s.sectionAside}><p>From the blacktop to the back nine. Find a game, chase a personal best, and make time for one more round.</p><a className={s.textLink} href={products.games.href} data-analytics-event="web_launch" data-analytics-product="games" data-analytics-cta-location="games">Explore the arcade <Arrow diagonal /></a><span className={s.previewNote}>WEB PREVIEW</span></div></div>
        <div className={s.gameGrid}>{featuredGames.map((game, i) => <a key={game.slug} className={s.gameCard} href={`${products.games.href}play/${game.slug}/`} data-analytics-event="web_launch" data-analytics-product="games" data-analytics-game={game.slug} data-analytics-cta-location="game_card">
          <div className={s.gameArt}><Image src={`/statoz-website/assets/stadium/${game.image}.webp`} alt={`${game.name} artwork`} width={720} height={480} sizes="(max-width: 600px) 92vw, (max-width: 1000px) 45vw, 30vw" /><span className={s.playBadge}>PLAY PREVIEW <Arrow diagonal /></span></div>
          <div className={s.gameMeta}><span>{game.sport}</span><span>0{i + 1}</span></div><h3>{game.name}</h3><p>{game.description}</p>
        </a>)}</div>
      </section>

      <section className={s.routine} id="how-it-works" aria-labelledby="routine-title">
        <div className={s.section}><SectionLabel number="03">A LITTLE SPORT. EVERY DAY.</SectionLabel><h2 id="routine-title">Make it your ritual.</h2><div className={s.routineGrid}>
          <article><span>01 / THE INSTINCT</span><h3>Make your call.</h3><p>Open Sports, find a fixture and put your read of the match to the test.</p><a href={products.sports.href} data-analytics-event="web_launch" data-analytics-product="sports" data-analytics-cta-location="routine">Explore predictions <Arrow /></a></article>
          <article><span>02 / THE KNOWLEDGE</span><h3>Test yourself.</h3><p>Remember that player? Know that stat? Take a quiz and find out.</p><a href={`${products.sports.href}quiz/`} data-analytics-event="web_launch" data-analytics-product="sports" data-analytics-cta-location="routine">Find a sports quiz <Arrow /></a></article>
          <article><span>03 / THE COMPETITOR</span><h3>Play another round.</h3><p>Pick your arena. Learn the game. Come back for your next personal best.</p><a href={products.games.href} data-analytics-event="web_launch" data-analytics-product="games" data-analytics-cta-location="routine">Find your game <Arrow /></a></article>
        </div></div>
      </section>

      <section className={`${s.section} ${s.download}`} id="download" aria-labelledby="download-title">
        <div className={s.ticket}><div className={s.ticketMain}><p className={s.eyebrow}>YOUR HOME GROUND. TO GO.</p><h2 id="download-title">Sport stays with you.</h2><p>On the commute. At half-time. Wherever the conversation turns to sport. Take the current StatOz app with you.</p><div className={s.storeLinks}>{appStores.map(store => <a key={store.store} href={store.href} className={s.storeButton} data-analytics-event="download_cta_click" data-analytics-store={store.store} data-analytics-cta-location="home_download" data-analytics-cta-label={store.name}><StoreIcon store={store.store} /><span><small>{store.platform}</small><b>{store.name}</b></span><Arrow diagonal /></a>)}</div><p className={s.purchaseNote}>Current StatOz app · Optional in-app purchases<br />Features may differ from the Sports and Games web previews.</p></div><div className={s.ticketStub}><Image src="/icon-192.png" alt="StatOz app icon" width={84} height={84} /><span>STATOZ</span><b>HOME<br />ADVANTAGE.</b><div className={s.barcode} aria-hidden="true" /><small>MADE FOR THE LOVE OF SPORT</small></div></div>
      </section>

      <section className={`${s.section} ${s.faq}`} id="faq" aria-labelledby="faq-title"><div><p className={s.eyebrow}>BEFORE YOU STEP INSIDE</p><h2 id="faq-title">Good to know.</h2><Link href="/faq" className={s.textLink}>More about StatOz <Arrow /></Link></div><div className={s.questions}>{homeFaq.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>
    </main>
    <Footer />
  </div>;
}
