#!/usr/bin/env python3
"""postprocess-idea-book.py — perbaikan kompatibilitas WPS/Office:
1. Hapus <w:pgNumType/> kosong (membingungkan WPS).
2. Patch instrText footer: PAGE -> PAGE \\* arabic \\* MERGEFORMAT.
"""
import zipfile, shutil, re, sys, os

SRC = "/home/z/my-project/download/Idea-Book-Monetisasi-DIGIMAN.docx"
TMP = SRC + ".tmp"

with zipfile.ZipFile(SRC, "r") as zin:
    items = {n: zin.read(n) for n in zin.namelist()}

changed = []
for name in list(items):
    if name.startswith("word/") and name.endswith(".xml"):
        xml = items[name].decode("utf-8")
        orig = xml
        # 1. strip empty pgNumType
        xml = re.sub(r"<w:pgNumType\s*/>", "", xml)
        # 2. patch bare PAGE instrText (hindari yang sudah ada switch)
        def patch(m):
            inner = m.group(1)
            if "\\*" in inner:
                return m.group(0)
            return '<w:instrText xml:space="preserve"> PAGE \\* arabic \\* MERGEFORMAT </w:instrText>'
        xml = re.sub(r"<w:instrText[^>]*>\s*(PAGE)\s*</w:instrText>", patch, xml)
        if xml != orig:
            items[name] = xml.encode("utf-8")
            changed.append(name)

with zipfile.ZipFile(TMP, "w", zipfile.ZIP_DEFLATED) as zout:
    for n, data in items.items():
        zout.writestr(n, data)
shutil.move(TMP, SRC)
print("diubah:", changed if changed else "tidak ada (sudah bersih)")
