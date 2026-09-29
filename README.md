# Word Picker

A code recreation of the emotion word-picker prototype: type a sentence, pick the tool from the
toolbar, press a word, and drag across an emotion wheel to swap it for a synonym. The further you
drag from the center, the more intense the word.

Built with React 19, TypeScript and Vite. All measurements (layout, colors, typography, timing)
were taken from the reference recording and are documented in
[`docs/prototype-spec.md`](docs/prototype-spec.md).

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

- **Stage.** The prototype was authored on a 1280×720 canvas. `Stage` renders that canvas and
  scales it uniformly to fit the window, so every layout value can stay in the prototype's units.
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
  components/          Generic UI: Stage, Toolbar, Icon
  config/              Stage size and motion timings
  data/                Emotions and synonym tables
  features/word-picker WordPicker, Editor, EmotionWheel, reducer, picker cursor
  hooks/               useTypewriter, useFitScale, useMediaQuery
  lib/                 Geometry, tokenizing, stage coordinates
  styles/              Design tokens and global styles
```

## Notes

- Only "timid" has synonyms in the prototype (disgust, fear and joy). The other emotions for
  "timid", and the synonyms for "dog", "jumped", "thundering" and "sound", are new content.
  "The", "at" and "the" can't be picked.
- A few quirks of the original design are reproduced on purpose: the vertically stretched "fear"
  label, the raised text-color icon, and the spelling "malodorus".
- The formatting buttons (bold, lists, and so on) are visual only, as in the prototype.
- With `prefers-reduced-motion`, the typing intro is skipped. <kbd>Esc</kbd> cancels the tool or
  an open wheel.
