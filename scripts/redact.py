#!/usr/bin/env python3
import json, os, re
from PIL import Image, ImageFilter

INC = "incoming"
OCR = "incoming/ocr"
OUT = "public/recent-wins"
os.makedirs(OUT, exist_ok=True)

# Header band + dynamic-island contact photo — same iPhone layout on every shot.
ISLAND = (275, 16, 472, 124)      # contact face in the dynamic island
HEADER = (440, 150, 905, 432)     # avatar circle + contact name

# Explicit fixed-rect blurs for PII the OCR missed (verified visually).
RECTS = {
  "IMG_8603": [(95, 905, 470, 985)],    # Adam Kamran name + home address block in the UVA letter
  "IMG_8606": [(338, 1078, 585, 1228)], # name + student ID inside the UT "MyStatus" card (safety)
}

# Global PII tokens to scrub anywhere they appear (substring, case-insensitive)
GLOBAL = ["dear", "vasamsetti", "gallegos", "fremont", "emplid", "sv33327",
          "kamran", "logou"]

# Per-image extra blur targets.
#   plain  -> substring match (lowercased)
#   "=x"   -> exact match on the whole OCR line (for short ambiguous tokens)
CFG = {
  "IMG_8598": (["send letter"], "northwestern-ishmeet"),
  "IMG_8599": (["makes my life easier", "cause it comes out", "should of applied", "=cracked"], "cornell-ilr-adrian"),
  "IMG_8600": (["you should be extremely proud", "=bet", "=ty", "did letter come out", "=yeppp", "it seems like nyu", "first two rounds"], "nyu-adrian"),
  "IMG_8601": (["full acceptance letter", "no tweaker", "randomly updated", "email no nothing", "happened to refresh", "=then", "thank you so much", "secured columbia", "bloodline", "made it out the streets", "=baruch", "lmfaoo", "not annna miss", "you have all"], "columbia"),
  "IMG_8602": (["=no"], "emory-adam"),
  "IMG_8603": (["thing is still", "=ok", "lmk if u get into uva", "=lmfao", "lowkey thought i got rejected", "no confetti", "=yea", "my b did u call", "ijs saw it"], "uva-adam"),
  "IMG_8604": (["holy shit", "fucking", "2 mans", "full commited to uga"], "cornell-adam"),
  "IMG_8605": (["congratulations, adam", "=yo", "did umich come out", "=for u"], "michigan-adam"),
  "IMG_8606": (["=samanyu", "(sv", "congratulations, sa", "=lmfao", "=yo", "whya the fuck", "fuck", "=wtf", "can you send the full letter"], "utaustin-samanyu"),
  "IMG_8607": (["hopefully some uva", "how did it go"], "uva-samanyu"),
  "IMG_8608": (["when did it come out"], "nyu-samanyu"),
}

def matches(text, target):
    t = text.strip().lower()
    if target.startswith("="):
        return t == target[1:]
    return target in t

def blur_box(img, x0, y0, x1, y1, radius=None):
    W, H = img.size
    x0 = max(0, int(x0)); y0 = max(0, int(y0)); x1 = min(W, int(x1)); y1 = min(H, int(y1))
    if x1 <= x0 or y1 <= y0:
        return
    region = img.crop((x0, y0, x1, y1))
    r = radius if radius else max(16, (y1 - y0) * 0.9)
    # double pass for guaranteed illegibility of names/IDs
    region = region.filter(ImageFilter.GaussianBlur(r)).filter(ImageFilter.GaussianBlur(r * 0.6))
    img.paste(region, (x0, y0))

count = 0
for stem, (targets, outname) in CFG.items():
    src = f"{INC}/{stem}.png"
    ocr = json.load(open(f"{OCR}/{stem}.json"))
    img = Image.open(src).convert("RGB")
    # fixed regions
    blur_box(img, *ISLAND)
    blur_box(img, *HEADER)
    for r in RECTS.get(stem, []):
        blur_box(img, *r)
    # text-matched regions
    all_targets = GLOBAL + targets
    hit = []
    for ln in ocr["lines"]:
        txt = ln["text"]
        if any(matches(txt, tg) for tg in all_targets):
            pad = 16
            blur_box(img, ln["x"] - pad, ln["y"] - 12, ln["x"] + ln["w"] + pad, ln["y"] + ln["h"] + 12)
            hit.append(txt.strip())
    out = f"{OUT}/{outname}.jpg"
    img.save(out, "JPEG", quality=88)
    count += 1
    print(f"{stem} -> {outname}.jpg  | blurred: {hit}")
print(f"\nDone: {count} images -> {OUT}/")
