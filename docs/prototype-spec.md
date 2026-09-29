# Word Picker — prototype spec (measured from the reference video)

All values are in CSS px on a **1280×720 stage** (the recording's resolution). The stage should be
scaled uniformly to fit the viewport; the dimmed background must cover the full viewport.

## Page

- Background: `#ffffff`.
- Text: "The timid dog jumped at the thundering sound".
  - Font: Helvetica Neue **Light** (300), **69px**, line-height **80px**, color `#000`.
  - Text box: left **208**, top **305** (first baseline at y≈371), width ≈ **960** (must fit
    "The elated dog jumped at the" on one line, but wrap "thundering" after "timid").
- Typing intro: typewriter at **~40 ms per character**, no caret.

## Toolbar

- Pill: left **360**, top **42**, **562×92**, radius 46, background `#d9d9d9`, no border or shadow.
- Icons: Material Icons (filled), **56px** (scale ≈2.33 of the 24-unit grid), color `#646464`.
  Order: bold, italic, underlined | bulleted, numbered | color_text, format_size | filter_tilt_shift.
  - Button width **57**, group gap **~22.5**, pill padding ≈ **15 left / 23 right**.
  - Vertically, each glyph is centered by its **ink bounds** on y≈88.5, not by its 24-unit box.
    Ink center Y (in 24-unit space): bold 11, italic 11, underlined 12, bulleted 11.75,
    numbered 12, color_text 13.5, format_size 11.5, tilt_shift 12.
  - color_text uses the **old** glyph: `M0 20h24v4H0z` (solid bar, full width) +
    `M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z`.
  - Other paths come from `@material-design-icons/svg` (filled).
- Buttons: `cursor: pointer`, no hover/active visuals. The pill background keeps the default cursor.
- The tilt-shift button toggles the **picker tool**.

## Picker tool

- Cursor: the filter_tilt_shift glyph at 56px, translucent dark (≈ `rgba(40,40,40,0.8)`),
  hotspot at the **center dot**. Active from the tool click until release (including over the toolbar).
- Hovering a word in picker mode makes it **`#D0021B`** instantly. The hit area includes the trailing
  space (hovering the gap after "timid" highlights "timid").

## Emotion wheel (opens on pointerdown on a word)

- Centered on the word's optical center (mid cap-height), ≈ (406, 347) for "timid" — about 2.5px
  below the center of the word's text box.
- Dimming: page bg → `#dadada` (218) and all page content (toolbar, other words) to **opacity ≈0.09**.
  The picked word stays black, above the dim.
- Center disc: opaque `#e9e9e9`, solid to r=76, feathering to transparent by r≈97.
  Alpha falloff: r76 1.0, r80 .83, r84 .6, r88 .37, r92 .13, r96 .03, r100 0.
- Segments: 6 separately outlined annular sectors, inner r **115**, outer r **253**, with **12px
  parallel gaps** (6px each side of each boundary ray). Stroke 1px ≈ `#aaaaaa`, no fill, sharp corners.
  Boundaries at -120, -60, 0, 60, 120, 180 degrees (SVG angles, y down).
- Emotions (center angle, fill/tick color):
  - anger -90° `#FF9EA1`* · disgust -30° `#90FEA1` · fear 30° `#8B8B8B` (tick `#777777`)
  - joy 90° `#FEED4F` · sad 150° `#B6B6FF`* · surprise 210° `#BEBEBE`*
  - (*) Estimated from tick color only; the video never fills these segments.
- Ticks: ~3.5px radial lines from r≈82 to r≈115 at each center angle, fading to transparent toward
  the inner end (r≈82–91), slightly soft (≈0.5px blur).
- Labels: Helvetica Neue Regular **33.5px**, `#444`, centered horizontally.
  Offsets from the wheel center (dx, baseline dy):
  anger (-6.5, -273) · disgust (277, -149.5) · fear (266, 144.5) · joy (-4, 290.5) ·
  sad (-257.5, 156.5) · surprise (-286.5, -138.5).
  **"fear" is stretched vertically ×1.25** in the design (scaleY about its baseline).
- Center word: same font as the text (69px Light, black), centered on the wheel center, swaps instantly.

## Dragging

- Pointer polar coords relative to the wheel center. Pointer inside a gap (perpendicular distance
  < 6px from a boundary ray) or r < **108** → no selection (original word, no fill).
- Intensity level = floor((r − 108) / 25), clamped to 0..3 (thresholds 108, 133, 158, 183).
- Fill: the selected segment's shape (flush with its outline, drawn **over** it) from r=115 to
  max(pointer r, 119), clamped to 253. It tracks the pointer with no visible lag.
- Synonyms for "timid" seen in the video (weak → strong):
  - disgust: unpalatable, offensive, impenitent, malodorus (sic)
  - fear: cowardly, unassertive, afraid, (4th unseen)
  - joy: philhellenic, joyful, playful, elated
  - anger / sad / surprise: unseen, so they need new content.

## Timing

- Press: dim fades in over **~70ms** (linear), then the wheel (disc, outlines, ticks, labels) fades in
  over **~270ms** (linear), starting at 70ms.
- Release: the cursor reverts to the default arrow immediately. After a **~110ms hold** the chosen word
  is committed into the sentence (text reflows), the center word disappears, and dim + wheel fade out
  over **~350ms** (linear). The committed word stays fully opaque throughout. The tool deactivates.

## Implementation notes

- These values live in code as `src/styles/tokens.css` (colors, type), `src/config/timing.ts`
  (durations), `src/features/word-picker/EmotionWheel/wheelModel.ts` (wheel geometry and bands)
  and `src/data/emotions.ts` (segment colors and label anchors).
- The implementation was verified against the recording by diffing headless-Chrome screenshots with
  video frames: layout, icons and labels land within ~1–3px, and fade timings match.
- Text weight renders slightly heavier than the recording (~5% more dark pixels); grayscale
  antialiasing overshoots in the other direction (~8% lighter), so the default smoothing is kept.
