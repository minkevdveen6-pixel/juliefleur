import { SiteLink as Link } from "@/components/site-link";
import { HomeCollections } from "@/components/home-collections";
import { pages } from "@/data/pages";
import styles from "./home.module.css";

export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return <div className={styles.home}>
    <section className={styles.hero} aria-labelledby="home-heading">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <h1 id="home-heading">Persoonlijk &amp;<br /><span>handgemaakt.</span></h1>
          <p>Gepersonaliseerde sieraden, bagcharms, punnik- &amp; borduurwerk</p>
          <Link className="button" href="#collections-heading">Ontdek de collecties</Link>
        </div>
        <Link className={styles.heroImage} href="/collecties/bagcharms/" aria-label="Bekijk de bagcharms">
          <picture>
            <source type="image/webp" srcSet="/images/hero/pantertas-bagcharm-480.webp 480w, /images/hero/pantertas-bagcharm-768.webp 768w, /images/hero/pantertas-bagcharm-1200.webp 1200w" sizes="(max-width: 600px) calc(100vw - 36px), (max-width: 1100px) 50vw, 560px" />
            <img src="/images/hero/pantertas-bagcharm-1200.webp" width="1200" height="1600" alt="Tas met panterprint en een gepersonaliseerde groen-blauwe bagcharm" fetchPriority="high" decoding="async" />
          </picture>
        </Link>
      </div>
    </section>

    <section className={styles.collections} aria-labelledby="collections-heading">
      <div className={styles.container}>
        <h2 id="collections-heading" className={styles.sectionTitle}>De collecties</h2>
        <HomeCollections />
      </div>
    </section>

    <section className={styles.reviewSection} aria-labelledby="reviews-heading"><div className={`${styles.container} ${styles.reviews}`}><h2 id="reviews-heading">Lieve woorden</h2><div><p>Heb je iets van Julie Fleur in huis? Fleur hoort graag hoe het bevalt.</p><Link className={styles.editorialLink} href="/reviews/">Deel je ervaring</Link></div></div></section>
    <section className={styles.about} aria-labelledby="home-fleur-heading">
      <div className={styles.aboutInner}>
        <div className={styles.portrait}>
          <picture><source type="image/webp" srcSet="/images/portraits/fleur-cutout-400.webp 400w, /images/portraits/fleur-cutout-800.webp 800w, /images/portraits/fleur-cutout-1066.webp 1066w" sizes="(max-width: 600px) 45vw, 400px" /><img src="/images/portraits/fleur-cutout-1066.webp" width="1066" height="1600" alt="Fleur, de maker achter Julie Fleur, lachend op een stoel." loading="lazy" decoding="async" /></picture>
        </div>
        <div className={styles.aboutHeading}><h2 id="home-fleur-heading">Over Fleur</h2></div>
        <p className={styles.aboutText}>{pages["over-fleur"].sections[0].paragraphs[0]}</p>
        <Link className={`${styles.editorialLink} ${styles.aboutLink}`} href="/over-fleur">Lees mijn verhaal</Link>
      </div>
    </section>
    <nav className={styles.practical} aria-label="Goed om te weten"><Link href="/over-fleur/">Handgemaakt door Fleur</Link><Link href="/collecties/">Personaliseren naar jouw wens</Link><Link href="/verzenden-bezorgen/">Verzending &amp; afhalen</Link></nav>
  </div>;
}
