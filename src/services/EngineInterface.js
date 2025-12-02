import * as Tone from "tone";
import MersenneTwister from "mersenne-twister";

export default class EngineInterface {
  constructor() {
    this.audioCon = new AudioContext();
    this.generator = new MersenneTwister();
    // Additional initialization code can go here

    // this.envelope_attack property was an example to show how to use the class
    this.envelope_attack = 0.01;
    this.harmonics = [
      1.0, 0.5, 0.3, 0.2, 0.15, 0.1, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02,
    ];
    
    // Array to store active oscillators for stopping sounds
    this.activeOscillators = [];
    this.activeGainNodes = [];
  }

  setEnvelopeAttack(attack) {
    // Example method to set envelope attack
    this.envelope_attack = attack;
    // TODO: Implementation for setting envelope attack

    console.log(`Envelope attack set to: ${this.envelope_attack}`);
  }

  setEnvelopeDecay(decay) {
    // TODO: Implementation for setting envelope decay
    console.log(`Setting envelope decay to: ${decay}`);
  }

  setEnvelopeSustain(sustain) {
    // TODO: Implementation for setting envelope sustain
    console.log(`Setting envelope sustain to: ${sustain}`);
  }

  setEnvelopeRelease(release) {
    // TODO: Implementation for setting envelope release
    console.log(`Setting envelope release to: ${release}`);
  }

  setFiltersHiCut(freq) {
    // TODO: Implementation for setting filters hi-cut frequency
    console.log(`Setting filters hi-cut frequency to: ${freq}`);
  }

  setFiltersLoCut(freq) {
    // TODO: Implementation for setting filters lo-cut frequency
    console.log(`Setting filters lo-cut frequency to: ${freq}`);
  }

  setFiltersRes(freq) {
    // TODO: Implementation for setting filters resonance frequency
    console.log(`Setting filters resonance frequency to: ${freq}`);
  }

  // TODO: There should be more methods here to set other parameters.

  setReverbDecay(time) {
    // TODO: Implementation for setting reverb decay time
    console.log(`Setting reverb decay time to: ${time}`);
  }

  setReverbAmount(amount) {
    // TODO: Implementation for setting reverb amount
    console.log(`Setting reverb amount to: ${amount}`);
  }

  setPartitions() {
    /*
      This method randomly sets the ratios of the first 12 harmonics (including the fundamental frequency) of the timbre,
      and returns an array containing these 12 harmonic ratio values.
    */

    const harmonics = [];
    for (let i = 0; i < 12; i++) {
      const ratio = Math.round(this.generator.random() * 100) / 100;
      harmonics.push(ratio);
    }
    this.harmonics = harmonics;

    // TODO: Implementation for applying harmonic ratios to the sound engine

    console.log("Harmonic ratios set to:", harmonics);
    return harmonics;
  }

  getHarmonics() {
    return this.harmonics;
  }

  playNoteWithDuration(frequency, duration) {
    // duration is in milliseconds
    // TODO: Implementation for playing a note at the given frequency

    console.log(
      `Playing note at frequency: ${frequency} Hz for duration: ${duration} milliseconds`
    );
  }

  playChordWithDuration(frequencies, duration) {

    /* IMPORTANT:

      Logic here is just a test implementation to simulate chord playing.
      The final implementation should play all frequencies in the 'frequencies' array simultaneously
      for the specified duration using proper synthesis techniques.

    */

    // TODO: Implementation for playing a chord
    // You can delete the test implementation below and replace it with actual chord playing logic.

    // duration is in milliseconds
    // chord is an array of frequencies

    // TEST IMPLEMENTATION: Play a random frequency from the chord as a sine wave
    if (!frequencies || frequencies.length === 0) return;

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioCon.state === "suspended") {
      this.audioCon.resume();
    }

    // Pick a random frequency from the chord
    const randomIndex = Math.floor(this.generator.random() * frequencies.length);
    const frequency = frequencies[randomIndex];

    // Create oscillator and gain node
    const oscillator = this.audioCon.createOscillator();
    const gainNode = this.audioCon.createGain();

    // Configure oscillator
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, this.audioCon.currentTime);

    // Configure gain (volume) with a simple envelope to avoid clicks
    const now = this.audioCon.currentTime;
    const durationSec = duration / 1000;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Quick attack
    gainNode.gain.linearRampToValueAtTime(0.3, now + durationSec - 0.05); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, now + durationSec); // Release

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioCon.destination);

    // Store references for stopping
    this.activeOscillators.push(oscillator);
    this.activeGainNodes.push(gainNode);

    // Start and schedule stop
    oscillator.start(now);
    oscillator.stop(now + durationSec);

    // Clean up after oscillator stops
    oscillator.onended = () => {
      const oscIndex = this.activeOscillators.indexOf(oscillator);
      if (oscIndex > -1) {
        this.activeOscillators.splice(oscIndex, 1);
      }
      const gainIndex = this.activeGainNodes.indexOf(gainNode);
      if (gainIndex > -1) {
        this.activeGainNodes.splice(gainIndex, 1);
      }
    };

    console.log(
      `Playing chord at frequencies: ${frequencies} Hz for duration: ${duration} milliseconds`
    );
  }

  playNote(frequency) {
    // TODO: Implementation for playing a note at the given frequency
    console.log(`Playing note at frequency: ${frequency} Hz`);
  }

  releaseNote() {
    // if there is an active note, release it
    // TODO: Implementation for releasing a note
    console.log("Releasing note");
  }

  stopSound() {

    /* IMPORTANT:

      Logic here is just a test implementation to simulate stopping sound.
      The final implementation should properly stop all currently playing sounds
      in the sound engine.

    */

    // TODO: Implementation for stopping all sounds
    // You can delete the test implementation below and replace it with actual sound stopping logic.

    // Stop all active oscillators immediately
    const now = this.audioCon.currentTime;

    // Fade out quickly to avoid clicks
    this.activeGainNodes.forEach((gainNode) => {
      try {
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.02);
      } catch {
        // Ignore errors if gain node is already disconnected
      }
    });

    // Stop all oscillators
    this.activeOscillators.forEach((oscillator) => {
      try {
        oscillator.stop(now + 0.02);
      } catch {
        // Ignore errors if oscillator is already stopped
      }
    });

    // Clear arrays
    this.activeOscillators = [];
    this.activeGainNodes = [];

    console.log("Stopping all sounds");
  }

  playTestNote() {
    console.log("Playing test note");
    // This function is used to play a demo melody when click the LISTEN button in Sound Design page
    // TODO: Implementation for playing a test note with current settings
  }

}
