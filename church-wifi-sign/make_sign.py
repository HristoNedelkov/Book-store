"""Builds the A4 sign PDF (wifi-sign-A4.pdf).

Usage:  python3 make_sign.py [URL]
Needs:  pip install qrcode   (and Playwright with Chromium for the PDF)
"""
import sys, subprocess, pathlib, qrcode, qrcode.image.svg

URL = sys.argv[1] if len(sys.argv) > 1 else "https://church-wifi-bg.netlify.app"
here = pathlib.Path(__file__).parent

qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=0)
qr.add_data(URL)
svg = qr.make_image(image_factory=qrcode.image.svg.SvgPathImage).to_string(encoding="unicode")

html = f"""<!DOCTYPE html><html lang="bg"><head><meta charset="UTF-8"><style>
@page {{ size: A4; margin: 0; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ width: 210mm; height: 297mm; font-family: "DejaVu Serif", Georgia, serif; color: #1c1a17;
  display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }}
.frame {{ position: absolute; inset: 12mm; border: 1.2mm solid #b8914a; border-radius: 6mm; }}
.frame::after {{ content: ""; position: absolute; inset: 2.5mm; border: 0.4mm solid #b8914a; border-radius: 4mm; }}
.icon {{ width: 30mm; height: 30mm; fill: none; stroke: #b8914a; stroke-width: 7; stroke-linecap: round; margin-bottom: 8mm; }}
h1 {{ font-size: 46pt; line-height: 1.15; font-weight: bold; margin-bottom: 4mm; }}
h1 span {{ color: #b8914a; }}
.qr {{ width: 130mm; height: 130mm; margin: 12mm 0; }}
.qr svg {{ width: 100%; height: 100%; }}
.qr path {{ fill: #000; }}
.sub {{ font-size: 18pt; color: #6b5f4d; font-style: italic; }}
</style></head><body>
<div class="frame"></div>
<svg class="icon" viewBox="0 0 120 120">
  <path d="M14 58a66 66 0 0 1 92 0"/><path d="M30 74a43 43 0 0 1 60 0"/><path d="M46 90a20 20 0 0 1 28 0"/>
  <path d="M60 92v26M51 101h18" stroke="#1c1a17" stroke-width="6"/>
</svg>
<h1>Сканирайте за<br><span>Wi-Fi</span> в църквата</h1>
<div class="qr">{svg}</div>
<p class="sub">Насочете камерата на телефона към кода</p>
</body></html>"""

(here / "sign.html").write_text(html, encoding="utf-8")

js = f"""
const {{ chromium }} = require('playwright');
(async () => {{
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://{(here / "sign.html").resolve()}');
  await p.pdf({{ path: '{(here / "wifi-sign-A4.pdf").resolve()}', format: 'A4', printBackground: true, preferCSSPageSize: true }});
  await b.close();
}})();
"""
subprocess.run(["node", "-e", js], check=True)
print("Saved wifi-sign-A4.pdf ->", URL)
