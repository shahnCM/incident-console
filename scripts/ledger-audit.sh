#!/usr/bin/env bash
#
# scripts/ledger-audit.sh
#
# Written by Claude at direct request on Day 2 (2026-07-27), not built by hand.
# Logging that here because it's the convention this repo already uses for
# Claude-authored files (see docs/gates/toolchain.md) — this one's a utility
# script though, not a comprehension gate, so the "not derived cold" caveat
# matters a lot less here than it would for a gate file.
#
# What it does: reads docs/section-inventory.csv (the canonical list of
# tool+section pairs from the master plan's §6) and docs/coverage-ledger.csv
# (what's actually been logged as read), and prints every inventory row with
# no matching ledger row.
#
# Known limitation, stated plainly: this only works because Day 2 onward logs
# ledger rows using the SAME doc_section wording as section-inventory.csv
# (e.g. "Reference: rules", not a specific page title). Day 1's ledger rows
# predate that convention and use finer-grained page titles ("The Basics",
# "Getting Started") instead of section-inventory's coarser category names
# ("Handbook v2", "Guide") — so some TypeScript/Vite sections will print as
# "uncovered" below even though related reading already happened on Day 1.
# That's an honest reflection of the mismatch, not a bug. Two ways to close
# it, your call, not done here: rename Day 1's ledger rows to the coarser
# category names, or expand section-inventory.csv to page-level granularity
# to match how the ledger's actually been used. Either works; pick one before
# it matters at a consolidation day.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INVENTORY="$ROOT/docs/section-inventory.csv"
LEDGER="$ROOT/docs/coverage-ledger.csv"

if [[ ! -f "$INVENTORY" ]]; then
  echo "Missing $INVENTORY" >&2
  exit 1
fi
if [[ ! -f "$LEDGER" ]]; then
  echo "Missing $LEDGER" >&2
  exit 1
fi

# Build the set of "tool|doc_section" keys already logged in the ledger
# (skip the header row, take columns 1 and 2 exactly as written).
covered_keys="$(tail -n +2 "$LEDGER" | awk -F',' '{print $1 "|" $2}')"

total=0
uncovered=0

while IFS=',' read -r tool section; do
  [[ -z "$tool" ]] && continue
  total=$((total + 1))
  key="${tool}|${section}"
  if grep -qxF "$key" <<< "$covered_keys"; then
    continue
  fi
  uncovered=$((uncovered + 1))
  printf "UNCOVERED  %-14s %s\n" "$tool" "$section"
done < <(tail -n +2 "$INVENTORY")

echo "---"
echo "$uncovered of $total inventory sections uncovered."