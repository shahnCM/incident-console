# Reading Protocol

_Goes at `docs/reading-protocol.md`_

## The three-pass method

Every doc page gets three passes, not one:

1. **Skim.** Headings and code blocks only, about a minute. Predict what the page will say before
   reading a word of prose.
2. **Read.** Linearly, start to finish. Every API name and every "gotcha"/"note"/"pitfall" callout
   gets transcribed into notes in my own words — not copied.
3. **Retrieve.** Close the page. Write the one sentence I'd tell a teammate about it. If that
   sentence won't come, the second pass gets redone for that section only — a page that produces no
   note and no retrievable sentence wasn't read, it was scrolled.

## Note format

One Markdown file per tool, `notes/<tool>.md`, growing across all 30 days — not one file per day.
Per page:

```
## <page title> — <url> — <date>
- claim / API: ...
- footgun: ...
- Q (unanswered): ...
```

The unanswered-question line is load-bearing, not decoration: an open question is a debt, and the
escalation ladder below is what pays it off. If a question never gets chased down, it goes in the
Gate as an honest gap — not filled in with something that sounds plausible.

## The escalation ladder

Five rungs, in order. Each one exists because the rung below it sometimes doesn't have the answer.

1. **Docs.** Default starting point — the published guide/reference. Answers "what" and often "how."
2. **Changelog / release announcement.** Reach for this when docs describe current behavior but not
   _why_ it changed, or when a version number in the docs feels like it might be stale.
3. **RFC / discussion.** Reach for this when the changelog states a decision but not the reasoning,
   or when I want to know what alternative was on the table and got rejected.
4. **Source.** Reach for this when the discussion references something docs never fully explain, or
   when I just don't trust a claim enough to take it secondhand. Doesn't always mean cloning a
   whole repo — sometimes it's one file, fetched directly.
5. **Issue tracker.** Reach for this when I hit a footgun in practice and want to know if it's
   known, already fixed, or still open.

**A real example from today**, not a made-up drill: the React Router v8 discussion (rung 3) said
three design goals; the release announcement (rung 2) quoted four; fetching `GOVERNANCE.md`
directly (rung 4 — one file, no clone) showed the real, current answer is five. Two out of three
sources on the same claim were each incomplete in a different direction. Checking only one of them
would have meant confidently repeating a wrong number.

## Bundle staleness

`llms-full.txt` bundles in `docs-corpus/` are downloaded once and go stale the moment the live site
updates. When a bundle and the live page disagree, the live page wins — always. Worth checking a
bundle's age before trusting it for anything that matters (a version number, a specific claim), not
just at consolidation days.
