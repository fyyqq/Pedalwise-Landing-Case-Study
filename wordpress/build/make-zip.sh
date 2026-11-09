#!/usr/bin/env bash
# Rebuilds ../pedalwise-theme.zip from ../theme/pedalwise (run after changing the theme or re-running generate.cjs).
set -euo pipefail
cd "$(dirname "$0")/../theme"
rm -f ../pedalwise-theme.zip
zip -qr ../pedalwise-theme.zip pedalwise
echo "wrote wordpress/pedalwise-theme.zip"
