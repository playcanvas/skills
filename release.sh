#!/bin/bash -e

TYPE=$1

if [[ ! " major minor patch " =~ " $TYPE " ]]; then
    echo "Usage: $0 (major|minor|patch)"
    exit 1
fi

if [[ -n $(git status --porcelain) ]]; then
    echo "Working tree must be clean."
    exit 1
fi

if [[ $(git branch --show-current) != "main" ]]; then
    echo "Releases must be created from main."
    exit 1
fi

git fetch origin main --tags

if [[ $(git rev-parse HEAD) != $(git rev-parse origin/main) ]]; then
    echo "Local main must match origin/main."
    exit 1
fi

CURRENT=$(npm pkg get version | tr -d '"')
IFS=. read -r MAJOR MINOR PATCH <<< "$CURRENT"
case "$TYPE" in
    major) NEXT="$((MAJOR + 1)).0.0" ;;
    minor) NEXT="$MAJOR.$((MINOR + 1)).0" ;;
    patch) NEXT="$MAJOR.$MINOR.$((PATCH + 1))" ;;
esac

if git rev-parse -q --verify "refs/tags/v$NEXT" > /dev/null; then
    echo "Tag v$NEXT already exists."
    exit 1
fi

read -p "About to release 'v$NEXT'. Continue? (y/N) " -r
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Release cancelled."
    exit 1
fi

npm version "$TYPE" -m "v%s"

echo "Tagged v$NEXT. Push to publish: git push origin main && git push origin v$NEXT"
