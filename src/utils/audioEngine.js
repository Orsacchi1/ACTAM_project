// Audio Engine for playing chord root notes
// Uses Web Audio API for sound synthesis
// test
class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.initialized = false;
  }

  // Initialize the audio context (must be called after user interaction)
  init() {
    if (this.initialized) return;

    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.3; // Master volume
    this.masterGain.connect(this.audioContext.destination);
    this.initialized = true;
  }

  // Map note names to frequencies (A4 = 440Hz)
  getNoteFrequency(noteName) {
    const noteFrequencies = {
      C: 261.63, // C4
      "C#": 277.18, // C#4
      D: 293.66, // D4
      "D#": 311.13, // D#4
      E: 329.63, // E4
      F: 349.23, // F4
      "F#": 369.99, // F#4
      G: 392.0, // G4
      "G#": 415.3, // G#4
      A: 440.0, // A4
      "A#": 466.16, // A#4
      B: 493.88, // B4
    };

    return noteFrequencies[noteName] || 440;
  }

  // Play a single note for a specified duration
  playNote(noteName, durationInSeconds = 0.5) {
    if (!this.initialized) {
      this.init();
    }

    const now = this.audioContext.currentTime;
    const frequency = this.getNoteFrequency(noteName);

    // Create oscillator for the note
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = "sine"; // Smooth sine wave tone
    oscillator.frequency.setValueAtTime(frequency, now);

    // Create envelope for natural sound (ADSR)
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.01); // Attack
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1); // Decay to sustain
    gainNode.gain.setValueAtTime(0.3, now + durationInSeconds - 0.1); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, now + durationInSeconds); // Release

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    // Start and stop
    oscillator.start(now);
    oscillator.stop(now + durationInSeconds);
  }

  // Play chord root note based on BPM
  playChordRoot(noteName, bpm) {
    // Calculate duration of one beat in seconds
    const beatDuration = 60 / bpm;
    this.playNote(noteName, beatDuration * 0.8); // Play for 80% of beat duration
  }

  // Set master volume (0.0 to 1.0)
  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  // Clean up
  close() {
    if (this.audioContext) {
      this.audioContext.close();
      this.initialized = false;
    }
  }
}

// Export singleton instance
export const audioEngine = new AudioEngine();
