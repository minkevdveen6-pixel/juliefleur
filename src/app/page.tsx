import { SiteLink as Link } from "@/components/site-link";
import { products } from "@/data/catalog";
import { ProductCard } from "@/components/catalog";
import { PhotoSpace } from "@/components/placeholder";
import { pages } from "@/data/pages";
import { photoAt } from "@/lib/photography";
import styles from "./home.module.css";
import { ecwid } from "@/lib/site";
import { EcwidStore } from "@/components/ecwid-store";

export const metadata = { alternates: { canonical: "/" } };
const collections = [
  { slot: "category:sieraden-graveren", href: "/collecties/sieraden-graveren", label: "Sieraden & graveren" },
  { slot: "category:bagcharms", href: "/collecties/bagcharms", label: "Bagcharms" },
  { slot: "category:punniken", href: "/collecties/punniken", label: "Punniken" },
  { slot: "category:borduren", href: "/collecties/borduren", label: "Borduren" },
  { slot: "category:vilten-kroon", href: "/collecties/vilten-kroon", label: "Vilten kroon" },
];
const bestsellerSlugs = ["bar-bracelet-engraved", "persoonlijke-bagcharm", "poppy-necklace", "punniknaam-rieten-tasje"];

export default function Home() {
  const braceletPhoto = photoAt("gallery:bar-bracelet-engraved");
  const braceletImage = braceletPhoto?.variants.find(variant => variant.width === 960)?.src || braceletPhoto?.src;
  const bestsellers = bestsellerSlugs.flatMap(slug => products.filter(product => product.slug === slug)).map(product => product.slug === "bar-bracelet-engraved" && braceletImage ? { ...product, image: braceletImage } : product);
  return <div className={styles.home}>
    <section className={styles.hero} aria-labelledby="home-heading">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <h1 id="home-heading">Persoonlijk &amp; handgemaakt.</h1>
          <p>Gepersonaliseerde sieraden, bagcharms, punnik- &amp; borduurwerk</p>
          <Link className="button" href="#collections-heading">Ontdek de collecties</Link>
        </div>
        <Link className={styles.heroImage} href="/collecties/bagcharms/" aria-label="Bekijk de bagcharms">
          <picture>
            <source type="image/webp" srcSet="/images/hero/pantertas-bagcharm-480.webp 480w, /images/hero/pantertas-bagcharm-768.webp 768w, /images/hero/pantertas-bagcharm-1200.webp 1200w" sizes="(max-width: 600px) min(100vw - 36px, 320px), (max-width: 824px) calc(50vw - 32px), 380px" />
            <img src="/images/hero/pantertas-bagcharm-1200.webp" width="1200" height="1600" alt="Tas met panterprint en een gepersonaliseerde groen-blauwe bagcharm" fetchPriority="high" decoding="async" />
          </picture>
        </Link>
      </div>
    </section>

    <section className={styles.collections} aria-labelledby="collections-heading">
      <div className={styles.container}>
        <h2 id="collections-heading" className={styles.sectionTitle}>De collecties</h2>
        <div className={styles.collectionGrid}>
          {collections.map(collection => <Link className={styles.category} href={collection.href} key={collection.slot}>
            <div className={styles.collectionImage}><PhotoSpace slot={collection.slot} kind="home-category" fit="cover" /></div>
            <div className={styles.categoryCaption}><h3>{collection.label}</h3></div>
          </Link>)}
        </div>
      </div>
    </section>

    {(!ecwid.enabled || ecwid.categoryIds.bestsellers) && <section className={styles.bestsellers} aria-labelledby="bestsellers-heading">
      <div className={styles.container}>
        <div className={styles.sectionHeader}><h2 id="bestsellers-heading" className={styles.sectionTitle}>Bestsellers</h2><Link className={styles.editorialLink} href={ecwid.enabled ? "/bestsellers/" : "/collecties/"}>{ecwid.enabled ? "Bekijk alle bestsellers" : "Bekijk alle producten"}</Link></div>
        <div className={styles.bestsellerGrid}>{ecwid.enabled ? <div style={{gridColumn:"1 / -1"}}><EcwidStore categoryId={ecwid.categoryIds.bestsellers} featured /></div> : bestsellers.map(product => <ProductCard key={product.slug} product={product} />)}</div>
      </div>
    </section>}

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
    <section className={styles.reviews} aria-labelledby="reviews-heading"><div><h2 id="reviews-heading">Lieve woorden</h2><p>Heb je iets van Julie Fleur in huis? Fleur hoort graag hoe het bevalt.</p></div><Link className={styles.editorialLink} href="/reviews/">Deel je ervaring</Link></section>
    <section className={styles.orderSteps} aria-labelledby="order-heading"><h2 id="order-heading">Zo werkt bestellen</h2><ol><li><span>01</span><h3>Kies jouw favoriet</h3><p>Ontdek de collectie en selecteer je product.</p></li><li><span>02</span><h3>Maak het persoonlijk</h3><p>Kies de beschikbare kleuren, letters of andere personalisaties.</p></li><li><span>03</span><h3>Rond je bestelling af</h3><p>Controleer je keuzes en rond je bestelling af via de beschikbare betaalmethoden.</p></li></ol></section>
    <nav className={styles.practical} aria-label="Goed om te weten"><Link href="/over-fleur/">Handgemaakt door Fleur</Link><Link href="/collecties/">Personaliseren naar jouw wens</Link><Link href="/verzenden-bezorgen/">Verzending &amp; afhalen</Link></nav>
  </div>;
}
