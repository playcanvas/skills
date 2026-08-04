#!/bin/bash -e

TYPE=$1

if [[ ! " major minor patch " =~ " $TYPE " ]]; then
    echo "Usage: $0 (major|minor|patch)"
    exit 1
fi

git fetch --tags

CURRENT=$(node -p "require('./plugins/engine/.claude-plugin/plugin.json').version")
NEXT=$(node scripts/version.mjs "$TYPE" --dry-run)

read -p "Release v$NEXT (from v$CURRENT)? (y/N) " -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Release cancelled."
    exit 1
fi

node scripts/version.mjs "$TYPE"    # bump every manifest in lockstep
node --test test/*.test.mjs         # the "versions match across hosts" test is the sync backstop

git commit -am "v$NEXT"
git tag "v$NEXT"

echo "Tagged v$NEXT. Push to publish: git push origin main && git push origin v$NEXT"
