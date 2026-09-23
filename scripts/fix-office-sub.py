#!/usr/bin/env python3
"""fix-office-sub.py — ubah 'empat kota' -> 'lima kota' di seluruh kamus i18n."""
import json, glob, io

subs = [
    ("/home/z/my-project/src/lib/i18n/dict-id.ts", "Empat kota pelayanan", "Lima kota pelayanan"),
    ("/home/z/my-project/src/lib/i18n/dict-en.ts", "Four service cities", "Five service cities"),
    ("/home/z/my-project/src/lib/i18n/locales/ar.json", "أربع مدن للخدمة", "خمس مدن للخدمة"),
    ("/home/z/my-project/src/lib/i18n/locales/es.json", "Cuatro ciudades de servicio", "Cinco ciudades de servicio"),
    ("/home/z/my-project/src/lib/i18n/locales/fr.json", "Quatre villes de service", "Cinq villes de service"),
    ("/home/z/my-project/src/lib/i18n/locales/hi.json", "चार शहरों में सेवा", "पांच शहरों में सेवा"),
    ("/home/z/my-project/src/lib/i18n/locales/ja.json", "4都市でのサービス", "5都市でのサービス"),
    ("/home/z/my-project/src/lib/i18n/locales/pt.json", "Quatro cidades de atendimento", "Cinco cidades de atendimento"),
    ("/home/z/my-project/src/lib/i18n/locales/pt.json", "todo o Brasil online", "toda a Indonésia online"),
    ("/home/z/my-project/src/lib/i18n/locales/ru.json", "Четыре города обслуживания", "Пять городов обслуживания"),
    ("/home/z/my-project/src/lib/i18n/locales/zh.json", "四个服务城市", "五个服务城市"),
]
for path, old, new in subs:
    with io.open(path, encoding="utf-8") as f:
        txt = f.read()
    if old in txt:
        txt = txt.replace(old, new)
        with io.open(path, "w", encoding="utf-8") as f:
            f.write(txt)
        print("OK  ", path.split("/")[-1], ":", old[:22], "->", new[:22])
    else:
        # JSON: periksa via parsing utk validasi
        print("SKIP", path.split("/")[-1], "(tidak ketemu:", old[:22], ")")

# Validasi semua JSON tetap valid
for f in glob.glob("/home/z/my-project/src/lib/i18n/locales/*.json"):
    json.load(open(f, encoding="utf-8"))
print("Semua locale JSON valid.")
