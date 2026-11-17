// Leading emoji (with variation selectors / skin tones / joiners) and the space after it
const LEADING = /^(?:[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{2190}-\u{21FF}\u{25A0}-\u{25FF}](?:\u{FE0F}|\u{200D}|\p{Emoji_Modifier})*)+\s*/u

/** Text without its decorative leading emoji ("📍 Pinpoint Country" → "Pinpoint Country"). */
export const plain = (s) => (typeof s === 'string' ? s.replace(LEADING, '') : s)
