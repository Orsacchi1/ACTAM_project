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
      `Playing note at frequency: ${frequency} Hz for duration: ${duration} seconds`
    );
  }

  playChordWithDuration(frequencies, duration) {
    // duration is in milliseconds
    //chord is an array of frequencies

    // TODO: Implementation for playing a chord with the given frequencies
    console.log(
      `Playing chord at frequencies: ${frequencies} Hz for duration: ${duration} seconds`
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
    // TODO: Implementation for stopping all sounds
    console.log("Stopping all sounds");
  }

  playTestNote() {
    console.log("Playing test note");
    // This function is used to play a demo melody when click the LISTEN button in Sound Design page
    // TODO: Implementation for playing a test note with current settings
  }

}
