/** Motion timings, measured from the reference recording (30fps). */
export const TIMING = {
  /** Delay before the intro typewriter starts. */
  typewriterStartDelayMs: 300,
  /** Time between typed characters in the prototype. */
  typewriterCharMs: 40,
  /** Longer text types faster, so the intro never takes longer than this. */
  typewriterMaxDurationMs: 2400,
  /** The paragraphs after the first fade in once the typing intro finishes. */
  restRevealMs: 400,
  /** Page dims as soon as a word is pressed. */
  dimInMs: 70,
  /** The wheel fades in once the page has dimmed. */
  wheelFadeInMs: 270,
  /** After release, the wheel holds on the chosen word before committing it. */
  releaseHoldMs: 110,
  /** The dim and the wheel fade out together after the word is committed. */
  fadeOutMs: 350,
} as const
