"""Cek transparansi & info logo, lalu siapkan versi web."""
from PIL import Image
import os

UP = "/home/z/my-project/upload"
files = [
    "MASTER LOGO GOLD TRANSPARANT PT DIGITAL BISNIS MANAJEMEN copy.png",
    "MASTER LOGO GOLD TRANSPARANT PT DIGITAL BISNIS MANAJEMEN DIGIMAN ONLY.png",
    "MASTER LOGO DIGIMAN PT DIGITAL BISNIS MANAJEMEN.png",
]

for f in files:
    p = os.path.join(UP, f)
    im = Image.open(p)
    print(f"\n{f}")
    print("  mode:", im.mode, "size:", im.size)
    if im.mode in ("RGBA", "LA"):
        alpha = im.getchannel("A")
        vals = list(alpha.getdata())
        transparent = sum(1 for v in vals if v < 10)
        print(f"  pixel transparan: {transparent/len(vals)*100:.1f}%")
    else:
        print("  TIDAK ada alpha channel (background solid)")
        # cek warna pojok
        px = im.convert("RGB")
        print("  pojok kiri-atas:", px.getpixel((2, 2)))
        print("  pojok kanan-bawah:", px.getpixel((im.width - 3, im.height - 3)))
