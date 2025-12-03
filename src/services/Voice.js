import MersenneTwister from "mersenne-twister";


export class Voice {

    lastI = 0; //LAST INDEX INSERTED, USED FOR HARMONIC SPACING
    static K = 0.3; //DAMP factor for the exponential one

    constructor(audioCon, dest) {
        //Match the audio context with the context of the main audio engine
        //NOTE this.audioCon refers to the internal audio context linked with the external one
        this.audioCon = audioCon;
        this.voiceGain = this.audioCon.createGain();
        this.voiceGain.gain.value = 0.5;

        //Create a new internal generator
        this.GEN = new MersenneTwister();

        //Creation of different oscillators
        this.OSC1 = this.audioCon.createOscillator();
        this.OSC2 = this.audioCon.createOscillator();
        this.OSC3 = this.audioCon.createOscillator();

        //Routing to the output (might be the actual output or a gainNode)
        this.OSC1.connect(this.voiceGain);
        this.OSC2.connect(this.voiceGain);
        this.OSC3.connect(this.voiceGain);

        this.voiceGain.connect(dest);
    }

    //SOUND CREATION: Used for generating one single oscillator spectra
    generatePartials(cluster, randFilt, sparse, dampType) {
        let bands = new Float32Array(128);
        let imag = new Float32Array(128);
        let val;
        let base;
        const CL = 4; //The harmonics are grouped by 4
        const p = 0.7; //Probability of getting an active partial

        bands[0] = 0; //DC component is always zero
        imag[0] = 0;

        if (cluster === 1) {
            base = this.GEN.random_incl();
        }

        for (let i = 1; i < bands.length; i++) {

            //GENERATE VALUE FILTERED OR NOT
            if (randFilt === 1) {
                val = Math.abs(0.5 + ((this.GEN.random_incl() - 0.5) * 2)); //Default: -0.5
            } else if (cluster === 1) {
                val = Math.abs(0.5 + ((this.GEN.random_incl() - 0.5) * 2));
                if (i % CL == 0) {
                    base = this.GEN.random_incl();
                }
            } else {
                val = this.GEN.random_incl();
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
                        bands[i] = val * (1 / (1 + this.lastI)); //First one is MAX 0.5 so we have to heavily normalize
                    } else if (dampType == 1) {
                        //Using a quadratic one
                        bands[i] = val * ((1 / (1 + this.lastI) ** 2));
                    } else if (dampType == 2) {
                        //Using exponential damping
                        bands[i] = val * Math.exp(-this.lastI / K);
                    } else {
                        bands[i] = val;
                    }
                    imag[i] = 0;
                    //lastI = i; //Prova 1
                    //lastI++; //Prova2
                }
                this.lastI = i //Prova3
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
        //bands = normalize(bands);
        //const wave = this.audioCon.createPeriodicWave(bands, imag, { disableNormalization: false });
        return bands;
    }

    //Generate the main sound combining
    generateSound(cluster, randFilt, sparse, dampType, selected){
        //const waves = [];
        const bands = [];
        for(let i=0; i<selected.length; i++){
            console.log(selected[i]);
            if(selected[i] === 1){
                const res = this.generatePartials(cluster, randFilt, sparse, dampType);
                //waves[i] = res[0];
                bands[i] = res;
            }else{
                //waves[i] = null;
                bands[i] = null;
            }
        }
        //NOTE The quantity returned is an array
        return bands; 
    }


    //Used to copy the spectra of a sound for polyphonic purposes (CHORDS)
    copySound(waves){

    }
}