# EngineInterface.js Documentation、

This document will help you understand the structure of `EngineInterface.js` and what you need to do. Feel free to reach out if you have any questions!

---

## 📋 Overview

`EngineInterface.js` serves as the bridge between the UI and the underlying audio engine. It defines a set of methods that the UI calls to control sound playback and parameter adjustments.

Currently, most methods only have interface definitions and `console.log` outputs. Your task is to implement the actual audio processing logic.

### 🔗 UI Already Connected

I've already bound an instance of this class and its corresponding functions to the UI. You can interact with the interface directly (e.g., adjust knobs, click play buttons, etc.) and see the corresponding output in the browser console (F12 → Console). This should make testing and debugging easier for you.

### Available Infrastructure

- **AudioContext** (`this.audioCon`): Web Audio API audio context, already initialized in the constructor
- **Tone.js**: Already imported, feel free to use it for audio implementation
- **MersenneTwister** (`this.generator`): Random number generator, used for generating random harmonics, etc.

---

## 🎯 Methods to Implement

### 1. ADSR Envelope Control

These methods are used to set the synthesizer's envelope parameters, corresponding to the Envelope knobs on the Sound Design page.

| Method                        | Parameter | Description       |
| ----------------------------- | --------- | ----------------- |
| `setEnvelopeAttack(attack)`   | attack    | Set attack time   |
| `setEnvelopeDecay(decay)`     | decay     | Set decay time    |
| `setEnvelopeSustain(sustain)` | sustain   | Set sustain level |
| `setEnvelopeRelease(release)` | release   | Set release time  |

---

### 2. Filter Control

These methods are used to set filter parameters, corresponding to the Filters section on the Sound Design page.

| Method                  | Parameter     | Description                                |
| ----------------------- | ------------- | ------------------------------------------ |
| `setFiltersHiCut(freq)` | freq: Hz      | High-cut filter cutoff frequency (lowpass) |
| `setFiltersLoCut(freq)` | freq: Hz      | Low-cut filter cutoff frequency (highpass) |
| `setFiltersRes(freq)`   | freq: Q value | Filter resonance/Q factor                  |

---

### 3. Reverb Control

| Method                    | Parameter     | Description                       |
| ------------------------- | ------------- | --------------------------------- |
| `setReverbDecay(time)`    | time: seconds | Reverb decay time                 |
| `setReverbAmount(amount)` | amount: 0-1   | Reverb mix amount (dry/wet ratio) |

---

### 4. Harmonics/Timbre Control

| Method            | Parameter | Description                                              |
| ----------------- | --------- | -------------------------------------------------------- |
| `setPartitions()` | none      | Randomly generate 12 harmonic ratios and apply to timbre |
| `getHarmonics()`  | none      | Return current harmonics array                           |

**Current Status**: `setPartitions()` already implements the logic for randomly generating a harmonics array. You can also modify it to control the timbre, but you still need to **actually apply** these harmonic ratios to the synthesizer's sound.

---

### 5. Note/Chord Playback ⭐ Core Feature

| Method                                         | Parameters                                    | Description                                 |
| ---------------------------------------------- | --------------------------------------------- | ------------------------------------------- |
| `playChordWithDuration(frequencies, duration)` | frequencies: Hz array, duration: milliseconds | Play a chord for a specified duration       |
| `playNoteWithDuration(frequency, duration)`    | frequency: Hz, duration: milliseconds         | Play a single note for a specified duration |
| `playNote(frequency)`                          | frequency: Hz                                 | Start playing a note (doesn't auto-stop)    |
| `releaseNote()`                                | none                                          | Release the currently playing note          |
| `stopSound()`                                  | none                                          | Stop all sounds                             |

**Current Status**:

- `playChordWithDuration` and `stopSound` have a **test implementation** (only plays a random single sine wave). You need to replace it with actual chord playback logic
- Other methods only have `console.log`

**Implementation Requirements**:

- `playChordWithDuration` should **play all notes** in the frequency array simultaneously
- The timbre should be affected by the ADSR, filter, harmonics and other parameters above
- Playback should be smooth, avoiding clicks/pops (use fade in/out)

---

### 6. Test Playback

| Method           | Parameter | Description                                                             |
| ---------------- | --------- | ----------------------------------------------------------------------- |
| `playTestNote()` | none      | Play a test melody, used for the LISTEN button on the Sound Design page |

**Suggestion**: You could play a simple scale or chord progression to let users hear the effect of the current timbre settings.

---

## ✅ Checklist

After completing the implementation, please make sure the following features work properly:

- [ ] Clicking Play on the Chord Progression page produces chord sounds
- [ ] Transitions between chords are smooth, no clicks/pops
- [ ] Clicking Pause immediately stops the sound
- [ ] Adjusting knobs on the Sound Design page affects parameters in real-time
- [ ] Clicking the GENERATE button produces a noticeable change in timbre
- [ ] Clicking the LISTEN button plays test audio
