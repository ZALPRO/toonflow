#!/usr/bin/env python3
"""Locate existing Remotion projects.

Usage:
    python find_remotion.py [--path DIR] [--deep]

Looks, in order, at:
  1. --path (if given)
  2. the current directory and its parents
  3. sub-folders of the current directory (2 levels)
  4. the home folder (2 levels) and, on Windows, every drive root (1 level),
     plus common names such as remotion/, video/, videos/
With --deep it scans one level more everywhere (slower).

Prints JSON: {"node": "...", "npm": "...", "projects": [{"dir", "remotion", "installed", "has_engine"}]}
A project is a folder whose package.json lists "remotion" or "@remotion/cli".
"""
import argparse
import json
import os
import shutil
import string
import subprocess
import sys

SKIP = {"node_modules", ".git", "$RECYCLE.BIN", "System Volume Information", "AppData", "Library", ".cache", "venv", ".venv"}


def tool_version(cmd):
    exe = shutil.which(cmd)
    if not exe:
        return None
    try:
        out = subprocess.run([exe, "--version"], capture_output=True, text=True, timeout=20, shell=False)
        return out.stdout.strip() or out.stderr.strip()
    except Exception:
        return "found"


def inspect(d):
    pj = os.path.join(d, "package.json")
    if not os.path.isfile(pj):
        return None
    try:
        with open(pj, encoding="utf-8") as fh:
            data = json.load(fh)
    except Exception:
        return None
    deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
    if "remotion" not in deps and "@remotion/cli" not in deps:
        return None
    installed = None
    ipj = os.path.join(d, "node_modules", "remotion", "package.json")
    if os.path.isfile(ipj):
        try:
            with open(ipj, encoding="utf-8") as fh:
                installed = json.load(fh).get("version")
        except Exception:
            pass
    return {
        "dir": os.path.abspath(d),
        "remotion": deps.get("remotion") or deps.get("@remotion/cli"),
        "installed": installed,
        "has_engine": os.path.isfile(os.path.join(d, "src", "stickman", "stick.tsx")),
        "has_src": os.path.isdir(os.path.join(d, "src")),
    }


def walk(root, depth):
    """yield directories under root up to `depth` levels (root included)"""
    if not os.path.isdir(root):
        return
    yield root
    if depth <= 0:
        return
    try:
        entries = list(os.scandir(root))
    except (PermissionError, OSError):
        return
    for e in entries:
        if e.is_dir(follow_symlinks=False) and e.name not in SKIP and not e.name.startswith("."):
            yield from walk(e.path, depth - 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--path")
    ap.add_argument("--deep", action="store_true")
    a = ap.parse_args()
    extra = 1 if a.deep else 0

    candidates = []
    if a.path:
        candidates += list(walk(a.path, 1 + extra))
    cwd = os.getcwd()
    d = cwd
    for _ in range(6):
        candidates.append(d)
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    candidates += list(walk(cwd, 2 + extra))
    home = os.path.expanduser("~")
    candidates += list(walk(home, 2 + extra))
    roots = []
    if os.name == "nt":
        roots = [f"{c}:\\" for c in string.ascii_uppercase if os.path.exists(f"{c}:\\")]
    else:
        roots = ["/opt", "/srv"]
    for r in roots:
        candidates += list(walk(r, 1 + extra))
    for r in roots + [home]:
        for name in ("remotion", "video", "videos", "progetti", "projects"):
            candidates += list(walk(os.path.join(r, name), 1 + extra))

    seen, projects = set(), []
    for c in candidates:
        key = os.path.normcase(os.path.abspath(c))
        if key in seen:
            continue
        seen.add(key)
        info = inspect(c)
        if info:
            projects.append(info)

    print(
        json.dumps(
            {"cwd": cwd, "node": tool_version("node"), "npm": tool_version("npm"), "ffmpeg": bool(shutil.which("ffmpeg")), "projects": projects},
            indent=2,
        )
    )


if __name__ == "__main__":
    sys.exit(main())
