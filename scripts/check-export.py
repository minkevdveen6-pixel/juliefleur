"""Controleer echte exportpagina's, metadata en alle lokale linkdoelen."""
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit

ecwid_preview = "--ecwid-preview" in sys.argv
root = Path(__file__).resolve().parent.parent / "out"
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.h1 = 0
        self.canonical = None
        self.robots = None
        self.external_scripts = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "h1": self.h1 += 1
        if tag == "a" and a.get("href"): self.links.append(a["href"])
        if tag == "link" and a.get("rel") == "canonical": self.canonical = a.get("href")
        if tag == "meta" and a.get("name") == "robots": self.robots = a.get("content")
        if tag == "script" and a.get("src", "").startswith("http"): self.external_scripts.append(a["src"])

assert (root / "index.html").exists(), "Productie-export ontbreekt"
files = sorted(root.rglob("*.html"))
for file in files:
    page = Page()
    page.feed(file.read_text())
    if "embeds" not in file.parts:
        assert page.h1 == 1, f"{file}: precies één h1 verwacht"
    assert "noindex" in (page.robots or ""), f"{file}: conceptversie moet noindex zijn"
    assert not page.external_scripts, f"{file}: geen externe winkel/tracking actief"
    if file.name != "404.html" and "404" not in file.parts and "_not-found" not in file.parts and "embeds" not in file.parts:
        assert page.canonical and page.canonical.startswith("https://juliefleur.nl/"), f"{file}: canonical ontbreekt"
    html=file.read_text()
    if not ecwid_preview:
        assert 'app.ecwid.com/script.js' not in html, f"{file}: Ecwid moet uit blijven"
    else:
        assert not any(price in html for price in ['€', '€&nbsp;', 'Vanaf €']), f"{file}: handmatige prijs in Ecwid Preview"
        assert 'product-price' not in html and 'detail-price' not in html, f"{file}: handmatige productweergave in Ecwid Preview"
    assert 'julie-fleur-boutique.minkevanderveen.chatgpt.site' not in html, f"{file}: oude origin in export"
    for link in page.links:
        parsed = urlsplit(link)
        if parsed.scheme or parsed.netloc or not parsed.path: continue
        relative = unquote(parsed.path).lstrip("/")
        target = root / relative if parsed.path.startswith("/") else file.parent / relative
        assert target.is_file() or (target / "index.html").is_file(), f"{file}: kapotte link {link}"
assert "Disallow: /" in (root / "robots.txt").read_text()
assert "<loc>" not in (root / "sitemap.xml").read_text()
print(f"Exportcontrole geslaagd: {len(files)} HTML-bestanden, alle lokale links, h1, canonicals, noindex, robots en geen externe scripts in HTML.")
