#!/usr/bin/env python3
"""Create a new video folder from the template and register its composition.

usage:
    python new_video.py --project PATH --slug my-video [--size 1920x1080] [--fps 30] [--seconds 60]

* copies assets/template/* to PATH/src/<slug>/ (never overwrites existing files)
* creates PATH/public/<slug>/ for music, SFX and voiceover
* writes a placeholder timeline.ts (--seconds long) if parse_input.py has not run yet
* registers <Composition id="MyVideo"> in src/Root.tsx (at the toonflow markers if
  present, otherwise just before the closing fragment of the root component)
"""
import argparse
import json
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(os.path.dirname(HERE), "assets", "template")


def pascal(slug):
    p = "".join(w.capitalize() for w in re.split(r"[^A-Za-z0-9]+", slug) if w)
    return p if p and p[0].isalpha() else "V" + p


def placeholder_timeline(path, seconds, fps):
    sys.path.insert(0, HERE)
    from parse_input import TS_HEADER  # same types as the real timeline

    tl = {"fps": fps, "durationInFrames": int(seconds * fps), "seconds": seconds, "cues": [], "chapters": []}
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(TS_HEADER + json.dumps(tl, indent=2) + ";\n")


def register(root_path, slug, comp, w, h, fps):
    with open(root_path, encoding="utf-8") as fh:
        s = fh.read()
    if f'id="{comp}"' in s:
        return "already registered"
    imp = f'import {{ Video as {comp}, DURATION as {comp}_DURATION }} from "./{slug}/Video";'
    block = (
        f"      <Composition\n"
        f'        id="{comp}"\n'
        f"        component={{{comp}}}\n"
        f"        durationInFrames={{{comp}_DURATION}}\n"
        f"        fps={{{fps}}}\n"
        f"        width={{{w}}}\n"
        f"        height={{{h}}}\n"
        f'        defaultProps={{{{ music: 0.35, sfx: 0.8, voice: "", captions: false }}}}\n'
        f"      />\n"
    )
    if "// toonflow:imports" in s:
        s = s.replace("// toonflow:imports", imp + "\n// toonflow:imports")
    else:
        last_import = list(re.finditer(r"^import .*;\s*$", s, re.M))
        pos = last_import[-1].end() if last_import else 0
        s = s[:pos] + "\n" + imp + s[pos:]
    if "{/* toonflow:compositions */}" in s:
        s = s.replace("      {/* toonflow:compositions */}", block + "      {/* toonflow:compositions */}")
    else:
        i = s.rfind("</>")
        if i < 0:
            return "could not find where to register: add the <Composition> by hand:\n" + imp + "\n" + block
        s = s[:i] + block.replace("      ", "  ", 0) + "    " + s[i:]
    if "Composition" not in s.split("export")[0] or 'import { Composition' not in s and "Composition," not in s and " Composition " not in s:
        if not re.search(r"import\s*\{[^}]*\bComposition\b", s):
            s = 'import { Composition } from "remotion";\n' + s
    with open(root_path, "w", encoding="utf-8") as fh:
        fh.write(s)
    return "registered"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--slug", required=True)
    ap.add_argument("--size", default="1920x1080")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--seconds", type=float, default=60)
    a = ap.parse_args()
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", a.slug):
        sys.exit("slug: lowercase letters, digits and dashes only (e.g. petrodollar-explainer)")
    w, h = (int(x) for x in a.size.lower().split("x"))
    proj = os.path.abspath(a.project)
    if not os.path.isdir(os.path.join(proj, "src", "stickman")):
        sys.exit("engine missing: run setup_project.py --dir " + proj + " first")
    dst = os.path.join(proj, "src", a.slug)
    os.makedirs(dst, exist_ok=True)
    for fn in os.listdir(TEMPLATE):
        out = os.path.join(dst, fn)
        if os.path.exists(out):
            continue
        with open(os.path.join(TEMPLATE, fn), encoding="utf-8") as fh:
            body = fh.read().replace("__SLUG__", a.slug)
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(body)
    tl = os.path.join(dst, "timeline.ts")
    if not os.path.exists(tl):
        placeholder_timeline(tl, a.seconds, a.fps)
    os.makedirs(os.path.join(proj, "public", a.slug), exist_ok=True)
    comp = pascal(a.slug)
    status = register(os.path.join(proj, "src", "Root.tsx"), a.slug, comp, w, h, a.fps)
    print(json.dumps({"folder": dst, "public": os.path.join(proj, "public", a.slug), "composition": comp, "root": status}, indent=2))


if __name__ == "__main__":
    main()
