#!/usr/bin/env bash
set -euo pipefail

# deploy-standalone.sh
# Packages the Next.js standalone output and supporting files into a tarball
# suitable for uploading to cPanel/WHM (File Manager or SFTP).

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -d ".next/standalone" ]; then
  echo "Error: .next/standalone not found. Run 'npm run build' locally first." >&2
  exit 1
fi

TAR_NAME="relocationlogic-standalone-$(date +%F).tgz"
echo "Creating $TAR_NAME from available artifacts..."

# Build list of files to include
FILES=(".next/standalone" ".next/static" "public" "package.json" "package-lock.json" "yarn.lock")
INCLUDE=()
for f in "${FILES[@]}"; do
  if [ -e "$f" ]; then
    INCLUDE+=("$f")
  fi
done

# Include production env file if present (do not commit secrets to git)
if [ -f .env.production ]; then
  INCLUDE+=(".env.production")
fi

if [ ${#INCLUDE[@]} -eq 0 ]; then
  echo "No files found to package." >&2
  exit 1
fi

tar -czf "$TAR_NAME" "${INCLUDE[@]}"

echo "Created: $ROOT/$TAR_NAME"
echo "Upload $TAR_NAME to your cPanel File Manager or SFTP and extract to your desired app directory."
echo "If using cPanel Application Manager, point the App's startup file to .next/standalone/server.js"
