# Word Picker

An emotion word picker for editorial text: pick the tool from the toolbar, press a highlighted
word, and drag across an emotion wheel to swap it for a synonym. The further you drag from the
center, the more intense the word.

Built with React 19, TypeScript and Vite. The interaction (wheel shape, intensity bands, motion
timing) comes from the original prototype recording, measured in
[`docs/prototype-spec.md`](docs/prototype-spec.md). The layout and typography are a conventional
responsive web page: a floating toolbar with 24px icons over a reading column set in Newsreader.

## Getting started

```bash
pnpm install
pnpm dev
```

## Scripts

| Script           | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Start the Vite dev server                         |
| `pnpm build`     | Type-check and build for production               |
| `pnpm preview`   | Serve the production build                        |
| `pnpm test`      | Run the unit and component tests (Vitest)         |
| `pnpm typecheck` | Type-check without building                       |
| `pnpm lint`      | Lint with oxlint                                  |
| `pnpm format`    | Format with Prettier                              |
| `pnpm check`     | Typecheck, lint, format check and tests in one go |

## How it works

- **Layout.** `Page` owns the background (which dims while the wheel is open) and the tool
  cursor. The reading column is capped at 560px (about 64 characters per line), and the wheel is
  positioned inside it, so it scrolls with the text.
- **Text.** `lib/tokens.ts` splits text into words, attaching punctuation and spaces to the word
  before them ("way—in" becomes "way" + "—" and "in"). Replacements keep the original's
  capitalization, so "Light" becomes "Sunshine", not "sunshine".
- **State machine.** `editorState.ts` is a pure reducer holding the text and the picker state:
  `idle → armed → open → releasing → closing → idle`. Timers in `WordPicker.tsx` advance the
  release hold and the fade-out.
- **Wheel model.** `wheelModel.ts` turns a pointer position (relative to the wheel center) into an
  emotion and an intensity: segments by angle (with dead zones in the gaps between them), four
  intensity bands by distance.
- **Rendering.** The wheel is SVG; the center word is HTML so it renders exactly like the text.
  Fades are CSS transitions (with `@starting-style` for the entrance), with durations passed in
  from `config/timing.ts`.

## Project structure

```
src/
  app/                 App root
  components/          Generic UI: Page, Toolbar, Headline, Icon
  config/              Motion timings
  data/                Document text, emotions and synonym tables
  features/word-picker WordPicker, Editor, EmotionWheel, reducer, picker cursor
  hooks/               useTypewriter, useMediaQuery
  lib/                 Geometry, tokenizing, coordinates
  styles/              Design tokens, global styles, shared dimming
```

## Notes

- The body text is chapter 1 of Charles Dickens's _A Tale of Two Cities_, one string per paragraph
  in `src/data/document.ts`. The picker covers twelve words from the first paragraph: best, worst,
  wisdom, foolishness, belief, incredulity, Light, Darkness, hope, despair, noisiest and
  authorities (plus "light" later in the chapter, which shares Light's synonyms). Each has four
  synonyms per emotion in `src/data/synonyms.ts`, written to fit the word's place in the sentence.
- The formatting buttons (bold, lists, and so on) are visual only, as in the prototype.
- The intro types out the first paragraph, sped up from the prototype's 40ms per character so it
  never takes more than 2.4s, then fades in the rest of the chapter. With `prefers-reduced-motion`
  everything shows at once. <kbd>Esc</kbd> cancels the tool or an open wheel.
