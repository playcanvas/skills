#!/bin/bash -e

TYPE=$1

if [[ ! " major minor patch " =~ " $TYPE " ]]; then
    echo "Usage: $0 (major|minor|patch)"
    exit 1
fi

git fetch --tags

if [[ $(git branch --show-current) != "main" ]] || [[ -n $(git status --porcelain) ]]; then
    echo "Release requires a clean main branch."
    exit 1
fi

git fetch origin main
if [[ $(git rev-parse HEAD) != $(git rev-parse origin/main) ]]; then
    echo "Release requires main to match origin/main."
    exit 1
fi

node --test test/*.test.mjs
for SKILL in plugins/engine/skills/*; do
    uvx --from skills-ref==0.1.1 agentskills validate "$SKILL"
done
claude plugin validate --strict .
node scripts/audit-packages.mjs

CURRENT=$(node -p "require('./plugins/engine/.claude-plugin/plugin.json').version")
NEXT=$(node scripts/version.mjs "$TYPE" --dry-run)

read -p "Release v$NEXT (from v$CURRENT)? (y/N) " -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Release cancelled."
    exit 1
fi

node scripts/version.mjs "$TYPE"    # bump every manifest in lockstep
node scripts/check-release.mjs "v$NEXT"
node --test test/*.test.mjs         # the versions test is the sync backstop

git commit -am "chore: release v$NEXT"
git tag "v$NEXT"

echo "Tagged v$NEXT. Push to publish: git push origin main && git push origin v$NEXT"
