/**
 * Translate a chord name to an array of frequencies (Hz)
 *
 * @param {string} chordName - Chord name (e.g., "C", "Cmaj7", "Dm", "F#m7", "Gsus4")
 * @param {number} octave - Base octave for the root note (default: 4, middle C = C4 = 261.63 Hz)
 * @returns {number[]} Array of frequencies in Hz, or empty array if invalid
 *
 * Supported chord types:
 * - Major: "C", "D", etc.
 * - Minor: "Cm", "Dm", etc.
 * - Dominant 7th: "C7", "G7", etc.
 * - Major 7th: "Cmaj7", "Fmaj7", etc.
 * - Minor 7th: "Cm7", "Am7", etc.
 * - Diminished: "Cdim", "Bdim", etc.
 * - Augmented: "Caug", "Gaug", etc.
 * - Suspended 2nd: "Csus2", "Dsus2", etc.
 * - Suspended 4th: "Csus4", "Gsus4", etc.
 */

// A4 = 440 Hz (standard tuning)
const A4_FREQ = 440;
const A4_MIDI = 69;

// Root notes to semitone offset from C
const ROOT_TO_SEMITONE = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

// Chord intervals (semitones from root)
// Each array contains the intervals that make up the chord
const CHORD_INTERVALS = {
  "": [0, 4, 7], // Major: root, major 3rd, perfect 5th
  m: [0, 3, 7], // Minor: root, minor 3rd, perfect 5th
  7: [0, 4, 7, 10], // Dominant 7th: major + minor 7th
  maj7: [0, 4, 7, 11], // Major 7th: major + major 7th
  m7: [0, 3, 7, 10], // Minor 7th: minor + minor 7th
  dim: [0, 3, 6], // Diminished: root, minor 3rd, diminished 5th
  aug: [0, 4, 8], // Augmented: root, major 3rd, augmented 5th
  sus2: [0, 2, 7], // Suspended 2nd: root, major 2nd, perfect 5th
  sus4: [0, 5, 7], // Suspended 4th: root, perfect 4th, perfect 5th
};

/**
 * Convert MIDI note number to frequency
 * @param {number} midiNote - MIDI note number (0-127)
 * @returns {number} Frequency in Hz
 */
function midiToFreq(midiNote) {
  return A4_FREQ * Math.pow(2, (midiNote - A4_MIDI) / 12);
}

/**
 * Parse chord name into root note and quality suffix
 * @param {string} chordName - Full chord name (e.g., "F#m7")
 * @returns {{ root: string, suffix: string } | null}
 */
function parseChordName(chordName) {
  if (!chordName || typeof chordName !== "string") {
    return null;
  }

  // Extract root note (1 or 2 characters)
  let root = "";
  let suffix = "";

  if (chordName.length >= 2 && (chordName[1] === "#" || chordName[1] === "b")) {
    root = chordName.substring(0, 2);
    suffix = chordName.substring(2);
  } else if (chordName.length >= 1) {
    root = chordName[0];
    suffix = chordName.substring(1);
  }

  // Validate root note
  if (!(root in ROOT_TO_SEMITONE)) {
    return null;
  }

  // Validate suffix (chord quality)
  if (!(suffix in CHORD_INTERVALS)) {
    return null;
  }

  return { root, suffix };
}

/**
 * Main translate function
 * @param {string} chordName - Chord name (e.g., "Cmaj7", "Dm", "G7")
 * @param {number} octave - Base octave (default: 4)
 * @returns {number[]} Array of frequencies in Hz
 */
export default function translate(chordName, octave = 4) {
  const parsed = parseChordName(chordName);

  if (!parsed) {
    console.warn(`Invalid chord name: ${chordName}`);
    return [];
  }

  const { root, suffix } = parsed;
  const rootSemitone = ROOT_TO_SEMITONE[root];
  const intervals = CHORD_INTERVALS[suffix];

  // Calculate MIDI note for root (C4 = MIDI 60)
  const rootMidi = 12 + octave * 12 + rootSemitone;

  // Convert each interval to frequency
  const frequencies = intervals.map((interval) => {
    const midiNote = rootMidi + interval;
    const freq = midiToFreq(midiNote);
    // Round to 2 decimal places
    return Math.round(freq * 100) / 100;
  });

  return frequencies;
}

/**
 * Get chord name and frequencies as an object (utility function)
 * @param {string} chordName
 * @param {number} octave
 * @returns {{ name: string, frequencies: number[], notes: string[] }}
 */
export function getChordInfo(chordName, octave = 4) {
  const frequencies = translate(chordName, octave);
  const parsed = parseChordName(chordName);

  if (!parsed || frequencies.length === 0) {
    return { name: chordName, frequencies: [], notes: [] };
  }

  const { root, suffix } = parsed;
  const rootSemitone = ROOT_TO_SEMITONE[root];
  const intervals = CHORD_INTERVALS[suffix];

  // Note names for reference
  const NOTE_NAMES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const notes = intervals.map((interval) => {
    const noteIndex = (rootSemitone + interval) % 12;
    return NOTE_NAMES[noteIndex];
  });

  return {
    name: chordName,
    frequencies,
    notes,
  };
}
