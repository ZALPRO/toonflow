#!/usr/bin/env python3
"""Prepare a Remotion project for stick-figure videos.

Usage:
    python setup_project.py --dir PATH [--create] [--update-engine] [--no-install]

* If PATH already is a Remotion project: installs the extra packages the engine
  needs (pinned to the project's Remotion version), copies the engine into
  src/stickman/ and the contact-sheet helper into the project root.
* If PATH is not a Remotion project and --create is given: scaffolds a minimal
  Remotion project there (latest Remotion), runs npm install, then does the above.
  Without --create it exits with code 2 so the caller can ask the user first.
* If PATH has a package.json WITHOUT Remotion it refuses (exit 3): adding
  Remotion to someone else's app should be the user's explicit decision.

Never deletes or overwrites user files except the engine copy when --update-engine is set.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)
ENGINE_SRC = os.path.join(SKILL, "assets", "engine")
SHEET_SRC = os.path.join(SKILL, "assets", "stickman-sheet.mjs")
EXTRA = ["@remotion/google-fonts", "@remotion/bundler", "@remotion/renderer"]

ROOT_TSX = """import "./index.css";
import React from "react";
import { Composition } from "remotion";
// toonflow:imports

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* toonflow:compositions */}
    </>
  );
};
"""

INDEX_TS = """import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
"""

CONFIG_TS = """import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
"""

TSCONFIG = {
    "compilerOptions": {
        "target": "ES2018",
        "module": "commonjs",
        "jsx": "react-jsx",
        "strict": True,
        "noEmit": True,
        "lib": ["es2015", "DOM"],
        "esModuleInterop": True,
        "skipLibCheck": True,
        "forceConsistentCasingInFileNames": True,
        "noUnusedLocals": True,
        "resolveJsonModule": True,
    },
    "exclude": ["remotion.config.ts"],
}


def npm(args, cwd):
    exe = shutil.which("npm") or shutil.which("npm.cmd")
    if not exe:
        sys.exit("npm not found: install Node.js (https://nodejs.org) and retry.")
    print("$ npm " + " ".join(args), flush=True)
    r = subprocess.run([exe, *args], cwd=cwd)
    if r.returncode != 0:
        sys.exit(f"npm {' '.join(args)} failed ({r.returncode})")


def npm_out(args, cwd):
    exe = shutil.which("npm") or shutil.which("npm.cmd")
    return subprocess.run([exe, *args], cwd=cwd, capture_output=True, text=True).stdout.strip()


def read_pkg(d):
    p = os.path.join(d, "package.json")
    if not os.path.isfile(p):
        return None
    with open(p, encoding="utf-8") as fh:
        return json.load(fh)


def deps_of(pkg):
    return {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}


def installed_version(d, name):
    p = os.path.join(d, "node_modules", *name.split("/"), "package.json")
    if os.path.isfile(p):
        with open(p, encoding="utf-8") as fh:
            return json.load(fh).get("version")
    return None


def write_if_missing(path, content):
    if os.path.exists(path):
        return False
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(content if isinstance(content, str) else json.dumps(content, indent=2) + "\n")
    print("created", os.path.relpath(path))
    return True


def scaffold(d, install):
    os.makedirs(d, exist_ok=True)
    version = npm_out(["view", "remotion", "version"], d) or "latest"
    print("Remotion version:", version)
    pkg = {
        "name": os.path.basename(os.path.abspath(d)).lower().replace(" ", "-") or "videos",
        "version": "1.0.0",
        "private": True,
        "scripts": {"dev": "remotion studio", "render": "remotion render", "lint": "tsc"},
        "sideEffects": ["*.css"],
    }
    write_if_missing(os.path.join(d, "package.json"), pkg)
    write_if_missing(os.path.join(d, "tsconfig.json"), TSCONFIG)
    write_if_missing(os.path.join(d, "remotion.config.ts"), CONFIG_TS)
    write_if_missing(os.path.join(d, "src", "index.ts"), INDEX_TS)
    write_if_missing(os.path.join(d, "src", "Root.tsx"), ROOT_TSX)
    write_if_missing(os.path.join(d, "src", "index.css"), "body { margin: 0; }\n")
    write_if_missing(os.path.join(d, ".gitignore"), "node_modules\nout\n")
    os.makedirs(os.path.join(d, "public"), exist_ok=True)
    if install:
        v = version
        npm(["install", "--save-exact", f"remotion@{v}", f"@remotion/cli@{v}", *[f"{p}@{v}" for p in EXTRA], "react@19", "react-dom@19"], d)
        npm(["install", "--save-dev", "typescript@5", "@types/react@19"], d)


def ensure_extras(d, install):
    v = installed_version(d, "remotion") or deps_of(read_pkg(d)).get("remotion", "").lstrip("^~")
    missing = [p for p in EXTRA if not installed_version(d, p)]
    if missing and install:
        if not v:
            sys.exit("Cannot determine the project's Remotion version; run npm install in the project first.")
        npm(["install", "--save-exact", *[f"{p}@{v}" for p in missing]], d)
    elif missing:
        print("NOTE: missing packages (run with install):", missing)
    return v


def copy_engine(d, update):
    dst = os.path.join(d, "src", "stickman")
    if os.path.isdir(dst) and not update:
        print("engine already present:", dst, "(use --update-engine to refresh)")
    else:
        os.makedirs(dst, exist_ok=True)
        for fn in os.listdir(ENGINE_SRC):
            shutil.copy2(os.path.join(ENGINE_SRC, fn), os.path.join(dst, fn))
        print("engine copied to", dst)
    sheet = os.path.join(d, "stickman-sheet.mjs")
    if update or not os.path.exists(sheet):
        shutil.copy2(SHEET_SRC, sheet)
        print("contact-sheet helper:", sheet)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--create", action="store_true", help="scaffold a new Remotion project if none exists")
    ap.add_argument("--update-engine", action="store_true")
    ap.add_argument("--no-install", action="store_true")
    a = ap.parse_args()
    d = os.path.abspath(a.dir)
    install = not a.no_install

    pkg = read_pkg(d)
    if pkg is None:
        if not a.create:
            print(f"No Remotion project in {d}. Re-run with --create to scaffold one (asks npm to download ~300 MB).")
            return 2
        scaffold(d, install)
    elif "remotion" not in deps_of(pkg) and "@remotion/cli" not in deps_of(pkg):
        print(f"{d} has a package.json without Remotion: not touching it. Choose another folder or add Remotion yourself.")
        return 3
    elif install and not installed_version(d, "remotion"):
        npm(["install"], d)

    v = ensure_extras(d, install)
    copy_engine(d, a.update_engine)
    print(json.dumps({"dir": d, "remotion": v, "engine": os.path.join(d, "src", "stickman")}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
