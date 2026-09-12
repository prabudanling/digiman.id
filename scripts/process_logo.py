"""Proses logo DIGIMAN untuk web: trim alpha, buat emblem persegi + logo penuh + favicon."""
from PIL import Image
import os

UP = "/home/z/my-project/upload"
PUB = "/home/z/my-project/public"
os.makedirs(PUB, exist_ok=True)

SRC = os.path.join(UP, "MASTER LOGO GOLD TRANSPARANT PT DIGITAL BISNIS MANAJEMEN DIGIMAN ONLY.png")

im = Image.open(SRC).convert("RGBA")

# Trim ke bounding box alpha
bbox = im.getchannel("A").getbbox()
im_trim = im.crop(bbox)
print("trimmed size:", im_trim.size)

# 1) Logo penuh (emblem + teks DIGIMAN) — max lebar 900px
w, h = im_trim.size
scale = 900 / w
full = im_trim.resize((900, int(h * scale)), Image.LANCZOS)
full.save(os.path.join(PUB, "logo-digiman.png"), optimize=True)
print("logo-digiman.png:", full.size)

# 2) Emblem persegi (potong bagian emblem atas, tanpa teks) — untuk navbar & favicon
# Cari bbox bagian atas: emblem mengisi ~tengah-atas. Potong dari atas sampai ~72% tinggi
emb_h = int(h * 0.72)
emblem = im_trim.crop((0, 0, w, emb_h))
# trim ulang bagian ini
eb = emblem.getchannel("A").getbbox()
emblem = emblem.crop(eb)
# jadikan persegi (padding transparan)
ew, eh = emblem.size
side = max(ew, eh)
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.paste(emblem, ((side - ew) // 2, (side - eh) // 2), emblem)
emb512 = square.resize((512, 512), Image.LANCZOS)
emb512.save(os.path.join(PUB, "logo-emblem.png"), optimize=True)
print("logo-emblem.png:", emb512.size)

# 3) Favicon 64px
fav = square.resize((64, 64), Image.LANCZOS)
fav.save(os.path.join(PUB, "favicon-digiman.png"), optimize=True)
print("favicon-digiman.png: 64x64")

# 4) Watermark besar untuk CTA (resize full 1200)
wm = im_trim.resize((1200, int(h * 1200 / w)), Image.LANCZOS)
wm.save(os.path.join(PUB, "logo-watermark.png"), optimize=True)
print("logo-watermark.png:", wm.size)
