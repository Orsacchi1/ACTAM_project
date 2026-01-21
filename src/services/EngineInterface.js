import * as Tone from "tone";
import { Voice } from "./Voice.js";

export default class EngineInterface {
  //Generic variables always accessible (Mainly for low level sound manipulation)
  static SAMPLE_RATE = 44100;
  static MIN_FREQ = 0;
  static MAX_FREQ = 22050;
  wetGainDelay = 0.0;
  wetGainReverb = 0.0;

  dampType = 1; //Choose the DAMP TYPE [0=Linear, 1=Quadratic, 2=Exp]
  envType = 1; //Choose the type of envelope [0=Normal, 1=Pluck, 2=Pad]
  sparse = 1; //Flag for the spacing or not
  randFilt = 0; //Has priority on cluster
  cluster = 0;
  voices = []; //Contains the array with the spectra of the different voices [useful for expanded capabilities]
  //Default values for ADSR envelope
  a = 0.1;
  d = 0.2;
  s = 0.5;
  r = 0.2;

  constructor() {
    // Additional initialization code can go here
    this.audioCon = new AudioContext();
    this.ENV = this.audioCon.createGain();
    Tone.setContext(this.audioCon);
    this.GAIN_IN = this.audioCon.createGain();
    this.GAIN_OUT = this.audioCon.createGain();
    this.HI_PASS = this.audioCon.createBiquadFilter(); //Crea un filtro e lo imposta come passa alto
    this.HI_PASS.type = "highpass";
    this.LO_PASS = this.audioCon.createBiquadFilter(); //Crea un filtro e lo imposta come passa alto
    this.LO_PASS.type = "lowpass";
    this.VOICE1 = this.audioCon.createOscillator(); // Will be 4 voices in total for all the main tetrachords
    this.ENV = this.audioCon.createGain();
    this.WETDELAY = this.audioCon.createGain();
    this.DELAY = this.audioCon.createDelay();
    //this.REV = new Tone.Reverb({ decay: 3 }); //Assign the decay here in order to calculate the buffer and start the sound in real time
    this.REV = new Tone.FeedbackDelay({
      delayTime: 0.03,
      feedback: 0.5,
    });
    //---IS IT POSSIBLE TO INITIALIZE ADSR TO A DEFAULT VALUE?---

    // Array to store active oscillators for stopping sounds
    this.activeOscillators = [1, 0, 0];
    this.activeGainNodes = [1, 0, 0];
    this.detuneArray = [0, 0, 0];
    this.activeVoices = [1, 0, 0, 0]; //Don't know if I'll use them
    this.oscArray = [];
    this.oscArrayGain = [];

    this.generator = Math; //Using Math.random() for now, can be replaced with a better RNG if needed

    this.createDelay();
    this.createReverb();
    this.setupConnections();
    this.initializeValues();
    console.log("ActiveOsc:", this.activeOscillators);
    console.log("AudioCon:", this.audioCon);
    //Pass the audio context and connect the voice to the envelope
    this.voices[0] = new Voice(this.audioCon, this.ENV); //An array of voices allows for a more complex audio generation
    //Just to be sure
    this.VOICE1.start();
  }

  setEnvelopeAttack(attack) {
    // Example method to set envelope attack
    this.a = attack;
    // TODO: Implementation for setting envelope attack
    console.log(`Envelope attack set to: ${this.a}`);
  }

  setEnvelopeDecay(decay) {
    // TODO: Implementation for setting envelope decay
    this.d = decay;
    console.log(`Setting envelope decay to: ${this.d}`);
  }

  setEnvelopeSustain(sustain) {
    // TODO: Implementation for setting envelope sustain
    this.s = sustain;
    console.log(`Setting envelope sustain to: ${this.s}`);
  }

  setEnvelopeRelease(release) {
    // TODO: Implementation for setting envelope release
    this.r = release;
    console.log(`Setting envelope release to: ${this.r}`);
  }

  /**
   * Enable or disable a specific oscillator
   * @param {number} index - The oscillator index (1, 2, or 3)
   * @param {boolean} state - True to enable, false to disable
   */
  setOscActive(index, state) {
    console.log(`Setting Oscillator ${index} active state to: ${state}`);
    // TODO: Implementation for enabling/disabling oscillator
    if (state == "true") {
      this.activeOscillators[index - 1] = 1;
      this.activeGainNodes[index - 1] = 1;
    } else {
      this.activeOscillators[index - 1] = 0;
      this.activeGainNodes[index - 1] = 0;
    }
  }

  /**
   * Set the detune amount for a specific oscillator
   * @param {number} index - The oscillator index (1, 2, or 3)
   * @param {number} amount - Detune amount (0.0 to 1.0)
   */
  setOscDetune(index, amount) {
    console.log(`Setting Oscillator ${index} detune to: ${amount}`);
    // TODO: Implementation for setting oscillator detune
    const minCents = -1200;
    const maxCents = 1200;
    const res = amount * (maxCents - minCents) + maxCents;
    //Find a way to set those values
    //this.voices[0].setDetune(index-1, res);
    this.detuneArray[index - 1] = res;
  }

  /**
   * Set the volume level for a specific oscillator
   * @param {number} index - The oscillator index (1, 2, or 3)
   * @param {number} volume - Volume level (0.0 to 1.0)
   */
  setOscVolume(index, volume) {
    this.activeGainNodes[index - 1] = volume;
    console.log(`Setting Oscillator ${index} volume to: ${volume}`);

    // TODO: Implementation for setting oscillator volume
  }

  setFiltersHiCut(freq) {
    // TODO: Implementation for setting filters hi-cut frequency
    const minVal = 20; // Min audible
    const maxVal = 22050;
    const normVal = freq / maxVal;
    freq = minVal * Math.pow(maxVal / minVal, normVal);
    this.HI_PASS.frequency.value = freq;
    console.log(`Setting filters hi-cut frequency to: ${freq}`);
    return freq;
  }

  getFiltersHiCut() {
    return this.HI_PASS.frequency.value;
  }

  setFiltersLoCut(freq) {
    // TODO: Implementation for setting filters lo-cut frequency
    const minVal = 20; // Min audible
    const maxVal = 22050;
    const normVal = freq / maxVal;
    freq = minVal * Math.pow(maxVal / minVal, normVal);
    this.LO_PASS.frequency.value = freq;
    console.log(`Setting filters lo-cut frequency to: ${freq}`);
    return freq;
  }

  getFiltersLoCut() {
    return this.LO_PASS.frequency.value;
  }

  setFiltersRes(res) {
    // TODO: Implementation for setting filters resonance frequency
    const maxRes = 20;
    res = res * maxRes;
    this.HI_PASS.Q.value = res;
    this.LO_PASS.Q.value = res;
    console.log(`Setting filters resonance frequency to: ${res}`);
  }

  getFiltersRes() {
    return this.HI_PASS.Q.value;
  }

  // TODO: There should be more methods here to set other parameters.

  setReverbDecay(time) {
    // TODO: Implementation for setting reverb decay time
    this.REV.feedback.rampTo(time, 0.5);
    console.log(`Setting reverb decay time to: ${time}`);
  }

  setReverbMix(amount) {
    // TODO: Implementation for setting reverb amount
    this.REV.wet.value = amount;
    console.log(`Setting reverb amount to: ${amount}`);
  }

  setDelayTime(time) {
    this.DELAY.delayTime.value = time;
    // TODO: Implementation for setting delay time
    console.log(`Setting delay time to: ${time}`);
  }

  setDelayMix(amount) {
    this.WETDELAY.gain.value = amount;
    console.log(`Setting delay mix to: ${amount}`);
  }

  setGainIn(amount) {
    // TODO: Implementation for setting gain in
    this.GAIN_IN.gain.value = amount;
    console.log(`Setting gain in to: ${amount}`);
  }

  setGainOut(amount) {
    // TODO: Implementation for setting gain out
    this.GAIN_OUT.gain.value = amount;
    console.log(`Setting gain out to: ${amount}`);
  }

  /**
   * Set the damping type for harmonic generation
   * @param {string} type - Possible values: "linear", "quadratic", "exponential"
   */
  setDampingType(type) {
    // TODO: Implementation for setting damping type
    switch (type) {
      case "linear":
        this.dampType = 0;
        break;
      case "quadratic":
        this.dampType = 1;
        break;
      case "exponential":
        this.dampType = 2;
        break;
    }
    console.log(`Setting damping type to: ${type}`);
  }

  /**
   * Set the spectral amplitude quality for harmonic generation
   * @param {string} quality - Possible values: "random", "cluster", "none"
   */
  setSpectralQuality(quality) {
    // TODO: Implementation for setting spectral quality
    switch (quality) {
      case "random":
        this.randFilt = 1;
        this.cluster = 0;
        break;
      case "cluster":
        this.randFilt = 0;
        this.cluster = 1;
        break;
      case "none":
        this.randFilt = 0;
        this.cluster = 0;
    }
    console.log(`Setting spectral quality to: ${quality}`);
  }

  setPartitions() {
    this.VOICE1.stop();
    this.VOICE1 = this.audioCon.createOscillator();
    this.VOICE1.connect(this.ENV);
    // Make sure audio context is active
    if (this.audioCon.state === "suspended") {
      this.audioCon.resume();
      console.log("Audio Context resumed...");
    }

    // Initialize active Oscillators if necessary
    if (!Array.isArray(this.activeOscillators)) {
      this.activeOscillators = [1, 0, 0];
      console.log(
        "activeOscillators array initialized at default values [1, 0, 0]"
      );
    }

    // Safe copy
    const actOsc = [...this.activeOscillators];
    console.log("actOsc:", this.activeOscillators);
    //Values passed in soundGeneration

    console.log(actOsc);
    const harmonics = this.voices[0].generateSound(
      this.sparse,
      this.randFilt,
      this.cluster,
      this.dampType,
      actOsc
    );
    //Save the spectra into voices
    this.voices[0].setHarmonics(harmonics);
    console.log(harmonics.length, harmonics);
    //Automatically initialized to 0
    const imag = new Float32Array(harmonics.length);
    const real = new Float32Array(harmonics);
    //Create the periodic wave and assign it to the voice
    const periodicWave = this.audioCon.createPeriodicWave(real, imag, {
      disableNormalization: false,
    });
    this.VOICE1.setPeriodicWave(periodicWave);
    this.VOICE1.start();
    generateOscArray(harmonics);
    //console.log(this.voices[0]);
    return harmonics;
  }

  //BETA FUNCTION
  generateOscArray(harmonics) {
    const imag = new Float32Array(harmonics.length);
    const real = new Float32Array(harmonics);
    //Check if the oscillators are already istantiated
    if (this.oscArray[i] != null) {
      for (let i = 0; i < 4; i++) {
        this.oscArray[i].stop();
      }
    }
    for (let i = 0; i < 4; i++) {
      const osc = this.audioCon.createOscillator();
      const periodicWave = this.audioCon.createPeriodicWave(real, imag, {
        disableNormalization: false,
      });
      osc.setPeriodicWave(periodicWave);
      osc.connect(this.ENV);
      osc.start();
      this.oscArray.push(osc);
    }
  }

  getHarmonics() {
    return this.voices[0].getHarmonics;
  }

  createDelay(val = 0.0) {
    const DELAY = this.DELAY;
    DELAY.delayTime.value = 0.2; //200 ms
    const FEEDBACK = this.audioCon.createGain();
    FEEDBACK.gain.value = 0.6; //# repeats
    const WET = this.WETDELAY;
    WET.gain.value = val;
    const DRY = this.audioCon.createGain();
    DRY.gain.value = 0.8;
    //Create a closed loop
    DELAY.connect(FEEDBACK);
    FEEDBACK.connect(DELAY);
    this.GAIN_IN.connect(DELAY);
    this.GAIN_IN.connect(DRY);
    DELAY.connect(WET);
    //WET.connect(REV);
    Tone.connect(WET, this.REV);
    //DRY.connect(GAIN_OUT);
    Tone.connect(DRY, this.REV);
  }

  createReverb(val = 0.0) {
    this.REV.wet.value = val;
  }

  generateEnvelope() {
    const now = this.audioCon.currentTime;
    const g = this.ENV.gain;
    // 1. Cancella vecchie programmazioni e ancora il valore al tempo attuale
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    // 2. ATTACK: sale al massimo (1.0)
    // Usiamo linearRamp per l'attacco per precisione, o exponential per morbidezza
    g.linearRampToValueAtTime(1.0, now + this.a);
    // 3. DECAY: scende al livello di SUSTAIN
    // Usiamo exponentialRamp perché suona più naturale per il decadimento
    g.exponentialRampToValueAtTime(this.s + 0.001, now + this.a + this.d);
  }

  releaseNote() {
    // if there is an active note, release it
    // TODO: Implementation for releasing a note
    console.log("audioContext:", this.audioContext);
    console.log("type:", typeof this.audioContext);
    console.log("Releasing note");
    const now = this.audioCon.currentTime;
    const g = this.ENV.gain;

    // 4. RELEASE: dal livello attuale (Sustain) torna a zero
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.exponentialRampToValueAtTime(0.001, now + this.r);

    // Opzionale: fissa lo zero assoluto alla fine (per evitare micro-rumori)
    g.setValueAtTime(0, now + this.r + 0.01);
  }

  playNoteWithDuration(frequency, duration) {
    // duration is in milliseconds
    // TODO: Implementation for playing a note at the given frequency
    console.log(
      `Playing note at frequency: ${frequency} Hz for duration: ${duration} milliseconds`
    );
    this.playNote(frequency);
    setTimeout(() => this.releaseNote(), duration);
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
    /*
    // TEST IMPLEMENTATION: Play a random frequency from the chord as a sine wave
    if (!frequencies || frequencies.length === 0) return;

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioCon.state === "suspended") {
      this.audioCon.resume();
    }

    // Pick a random frequency from the chord
    const randomIndex = Math.floor(
      this.generator.random() * frequencies.length
    );
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
*/
    console.log(
      `Playing chord at frequencies: ${frequencies} Hz for duration: ${duration} milliseconds`
    );
    //Generate the oscillators for every note
  }

  playNote(frequency) {
    // TODO: Implementation for playing a note at the given frequency
    this.VOICE1.frequency.value = frequency;
    this.generateEnvelope();
    console.log(`Playing note at frequency: ${frequency} Hz`);
  }

  stopSound() {
    /* IMPORTANT:

      Logic here is just a test implementation to simulate stopping sound.
      The final implementation should properly stop all currently playing sounds
      in the sound engine.

    */

    // TODO: Implementation for stopping all sounds
    // You can delete the test implementation below and replace it with actual sound stopping logic.
    /*
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
    //this.activeOscillators = [];
    //this.activeGainNodes = [];
*/
    this.releaseNote();
    console.log("Stopping all sounds");
  }

  playTestNote() {
    console.log("Playing test note");
    this.VOICE1.frequency.value = 220;
    this.generateEnvelope();
    setTimeout(() => this.releaseNote(), this.a * 1000 + this.d * 1000 + 2000);
    // This function is used to play a demo melody when click the LISTEN button in Sound Design page
    // TODO: Implementation for playing a test note with current settings
  }

  setupConnections() {
    this.VOICE1.connect(this.ENV)
      .connect(this.LO_PASS)
      .connect(this.HI_PASS)
      .connect(this.GAIN_IN);
    //GainIn is connected to the delay inside the createDelay function
    Tone.connect(this.REV, this.GAIN_OUT);
    //this.GAIN_IN.connect(this.GAIN_OUT);
    this.GAIN_OUT.connect(this.audioCon.destination);
  }

  initializeValues() {
    this.initFilters();
    this.initGains();
  }

  initFilters() {
    this.LO_PASS.frequency.value = 22050; //Filtered frequency
    this.LO_PASS.Q.value = 2; //Resonance
    this.HI_PASS.frequency.value = 0;
    this.HI_PASS.Q.value = 2;
  }

  initGains() {
    this.GAIN_IN.gain.value = 0.8;
    this.GAIN_OUT.gain.value = 0.8;
    this.ENV.gain.value = 0;
  }
}
//test
