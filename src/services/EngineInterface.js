import * as Tone from "tone";
import MersenneTwister from "mersenne-twister";

class EngineInterface {
  constructor() {
    this.audioCon = new AudioContext();
    this.generator = new MersenneTwister();
    // Additional initialization code can go here

    // this.envelope_attack property was an example to show how to use the class
    this.envelope_attack = 0.01;
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

  setPartitions() {
    /*
      This method randomly sets the ratios of the first 12 harmonics (including the fundamental frequency) of the timbre,
      and returns an array containing these 12 harmonic ratio values.
    */

    const harmonics = [];
    for (let i = 0; i < 12; i++) {
      const ratio = this.generator.random();
      harmonics.push(ratio);
    }

    // TODO: Implementation for applying harmonic ratios to the sound engine

    console.log("Harmonic ratios set to:", harmonics);
    return harmonics;
  }
}
