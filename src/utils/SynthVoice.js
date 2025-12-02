//IMPORT PACKAGES
//RUN npm install tone
import * as Tone from "tone"
//RUN npm install mersenne-twister
import MersenneTwister from "mersenne-twister";  //For random generation


//GLOBAL VARIABLES
const SAMPLE_RATE = 44100;
const DURATION_SEC = 1.0; // 1 secondo => 44100 samples
const NUM_SAMPLES = SAMPLE_RATE * DURATION_SEC;
const MIN_FREQ = 40;
const MAX_FREQ = 22050;
const GEN = new MersenneTwister();
const C = new AudioContext();
//Tone.setContext(C); //Forces tone.js to use my context in order to make the two node types able to communicate
//const GAIN_IN = C.createGain();
//const GAIN_OUT = C.createGain();
//const HI_PASS = C.createBiquadFilter(); //Crea un filtro e lo imposta come passa alto
//HI_PASS.type = "highpass";
//const LO_PASS = C.createBiquadFilter(); //Crea un filtro e lo imposta come passa alto
//LO_PASS.type = "lowpass";
//const OSC = C.createOscillator();
//const ENV = C.createGain();
//const REV = new Tone.Reverb({ decay: 3 }); //Assign the decay here in order to calculate the buffer and start the sound in real time
let wetGain = 0.0;
let wetGainReverb = 0.0;
let lastI = 0; //LAST INDEX INSERTED, USED FOR HARMONIC SPACING
let dampType = 1; //Choose the DAMP TYPE [0=Linear, 1=Quadratic, 2=Exp]
let envType = 1; //Choose the type of envelope [0=Normal, 1=Pluck, 2=Pad]
const K = 0.3; //DAMP factor for the exponential one
let sparse = 1; //Flag for the spacing or not
let randFilt = 0; //Has priority on cluster
let cluster = 0;


class SynthVoice {

    //ISTANTIATE A COSTUCTOR
    constructor() {
        Tone.setContext(C); //Forces tone.js to use my context in order to make the two node types able to communicate
        this.GAIN_IN = C.createGain();
        this.GAIN_OUT = C.createGain();
        this.HI_PASS = C.createBiquadFilter(); //Crea un filtro e lo imposta come passa alto
        HI_PASS.type = "highpass";
        this.LO_PASS = C.createBiquadFilter(); //Crea un filtro e lo imposta come passa alto
        LO_PASS.type = "lowpass";
        this.OSC = C.createOscillator();
        this.ENV = C.createGain();
        this.REV = new Tone.Reverb({ decay: 3 }); //Assign the decay here in order to calculate the buffer and start the sound in real time
    }

    //SOUND CREATION
    generateSpectra() {
        let bands = new Float32Array(128);
        let imag = new Float32Array(128);
        let val;
        let base;
        const CL = 4; //The harmonics are grouped by 4
        const p = 0.7; //Probability of getting an active partial

        bands[0] = 0; //DC component is always zero
        imag[0] = 0;

        if (cluster === 1) {
            base = GEN.random_incl();
        }

        for (let i = 1; i < bands.length; i++) {

            //GENERATE VALUE FILTERED OR NOT
            if (randFilt === 1) {
                val = Math.abs(0.5 + ((GEN.random_incl() - 0.5) * 2)); //Default: -0.5
            } else if (cluster === 1) {
                val = Math.abs(0.5 + ((GEN.random_incl() - 0.5) * 2));
                if (i % CL == 0) {
                    base = GEN.random_incl();
                }
            } else {
                val = GEN.random_incl();
            }

            //GENERATE THE PARTIAL ACCORDING TO THE DAMP SELECTED AND THE SPARSENESS
            //GENERATE SPARSE HARMONICS
            if (sparse === 1) {
                let insert = Math.random() < p ? 1 : 0; //0.2 Is the percentage of sparse harmonics
                if (insert === 0) {
                    bands[i] = 0;
                    imag[i] = 0;
                } else {
                    if (dampType == 0) {
                        //Using a linear damping
                        bands[i] = val * (1 / (1 + lastI)); //First one is MAX 0.5 so we have to heavily normalize
                    } else if (dampType == 1) {
                        //Using a quadratic one
                        bands[i] = val * ((1 / (1 + lastI) ** 2));
                    } else if (dampType == 2) {
                        //Using exponential damping
                        bands[i] = val * Math.exp(-lastI / K);
                    } else {
                        bands[i] = val;
                    }
                    imag[i] = 0;
                    //lastI = i; //Prova 1
                    //lastI++; //Prova2
                }
                lastI = i //Prova3
            } else {
                //GENERATE COMPACT HARMONICS
                if (dampType == 0) {
                    //Using a linear damping
                    bands[i] = val * (1 / (1 + i)); //First one is MAX 0.5 so we have to heavily normalize
                } else if (dampType == 1) {
                    //Using a quadratic one
                    bands[i] = val * ((1 / (1 + i) ** 2));
                } else if (dampType == 2) {
                    //Using exponential damping
                    bands[i] = val * Math.exp(-i / K);
                } else {
                    bands[i] = val;
                }
                imag[i] = 0;
            }
        }
        bands = normalize(bands);
        const wave = C.createPeriodicWave(bands, imag, { disableNormalization: false });
        return wave;
    }


    //SOUND MANIPULATION

    //Normalization L(inf) [MAX = 1] --> Keeps spectra proportions
    normalize(bands) {
        let max = 0;
        for (let i = 0; i < bands.length; i++) {
            const v = Math.abs(bands[i]);
            if (v > max) max = v;
        }
        // Avoid 0 divs (Almost impossible)
        if (max === 0) return bands;

        for (let i = 0; i < bands.length; i++) {
            bands[i] /= max;
        }
        return bands;
    }

}