//IMPORT PACKAGES

import MersenneTwister from "mersenne-twister";  //For random generation

//GLOBAL VARIABLES
const SAMPLE_RATE = 44100;
const DURATION_SEC = 1.0; // 1 secondo => 44100 samples
const NUM_SAMPLES = SAMPLE_RATE * DURATION_SEC;
const MIN_FREQ = 40;
const MAX_FREQ = 22050;
const GEN = new MersenneTwister();
const C = new AudioContext();
const GAIN_IN = C.createGain();
const GAIN_OUT = C.createGain();
const HI_PASS = C.createBiquadFilter(); //Crea un filtro e lo imposta come passa alto
HI_PASS.type = "highpass";
const LO_PASS = C.createBiquadFilter(); //Crea un filtro e lo imposta come passa alto
LO_PASS.type = "lowpass";
const OSC = C.createOscillator();
let lastI = 0; //LAST INDEX INSERTED, USED FOR HARMONIC SPACING
let dampType = 1; //Choose the DAMP TYPE [0=Linear, 1=Quadratic, 2=Exp]
const K=0.3; //DAMP factor for the exponential one
let sparse=1; //Flag for the spacing or not
let randFilt=0; //Has priority on cluster
let cluster=0;

//SLIDER VALUES
let lpfSlider = document.getElementById("LPF");
let hpfSlider = document.getElementById("HPF");
let gIn = document.getElementById("gainIn");
let gOut = document.getElementById("gainOut");


//SOUND CREATION
function createRichSoundSpectra(){
    let bands = new Float32Array(128);
    let imag = new Float32Array(128);
    let val;
    let base;
    const CL = 4; //The harmonics are grouped by 4
    const p = 0.7; //Probability of getting an active partial

    bands[0] = 0; //DC component is always zero
    imag[0] = 0;

    if(cluster===1){
        base = GEN.random_incl();
    }

    for(let i=1; i<bands.length; i++){
        
        //GENERATE VALUE FILTERED OR NOT
        if(randFilt===1){
            val = Math.abs(0.5 + ((GEN.random_incl()-0.5)*2)); //Default: -0.5
        }else if(cluster===1){
            val = Math.abs(0.5 + ((GEN.random_incl()-0.5)*2));
            if( i%CL == 0){
                base = GEN.random_incl();
            }
        }else{
            val = GEN.random_incl();
        }

        //GENERATE THE PARTIAL ACCORDING TO THE DAMP SELECTED AND THE SPARSENESS
        //GENERATE SPARSE HARMONICS
        if(sparse===1){
            let insert = Math.random() < p ? 1 : 0; //0.2 Is the percentage of sparse harmonics
            if(insert===0){
                bands[i] = 0;
                imag[i] = 0;
            }else{
                if(dampType==0){
                    //Using a linear damping
                    bands[i] = val * (1/(1+lastI)); //First one is MAX 0.5 so we have to heavily normalize
                }else if(dampType==1){
                    //Using a quadratic one
                    bands[i] = val * ((1/(1+lastI)**2));
                }else if(dampType==2){
                    //Using exponential damping
                    bands[i] = val * Math.exp(-lastI/K);
                }else{
                    bands[i] = val;
                }  
                imag[i] = 0;
                //lastI = i; //Prova 1
                //lastI++; //Prova2
            }
            lastI=i //Prova3
        }else{
            //GENERATE COMPACT HARMONICS
            if(dampType==0){
                //Using a linear damping
                bands[i] = val * (1/(1+i)); //First one is MAX 0.5 so we have to heavily normalize
            }else if(dampType==1){
                //Using a quadratic one
                bands[i] = val * ((1/(1+i)**2));
            }else if(dampType==2){
                //Using exponential damping
                bands[i] = val * Math.exp(-i/K);
            }else{
                bands[i] = val;
            }  
            imag[i] = 0;
        }    
    }
    bands = normalize(bands);
    const wave = C.createPeriodicWave(bands, imag, {disableNormalization: false});
    return wave;
}

//SOUND MANIPULATION

//Normalization L(inf) [MAX = 1] --> Keeps spectra proportions
function normalize(bands) {
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

function setHiPass(value){
    HI_PASS.frequency.setValueAtTime(value, C.currentTime);
}

function setLoPass(value){
    LO_PASS.frequency.setValueAtTime(value, C.currentTime);
}

function setGainIn(value){
    GAIN_IN.gain.value = value;
}

function setGainOut(value){
    GAIN_OUT.gain.value = value;
}
//UTILITY FUNCTIONS
function initFilters(){
    LO_PASS.frequency.value = 22050; //Filtered frequency
    LO_PASS.Q.value = 2; //Resonance
    HI_PASS.frequency.value = 0;
    HI_PASS.Q.value = 2;
}

function initGains(){
    GAIN_IN.gain.value=1;
    GAIN_OUT.gain.value=1;
}

//Function for making the slider steps exponential --> we are in the audio frequency domain
function sldExpConversion(value){
    return MIN_FREQ*Math.pow(MAX_FREQ/MIN_FREQ, value);
}

//Read things in the page
function readStuffValues(){
    dampType = document.querySelector('input[name="group1"]:checked').value;
    let v = document.querySelector('input[name="group2"]:checked').value;
    if(v==1){
        randFilt=1;
        cluster=0;
    }else if(v==2){
        randFilt=0;
        cluster=1;
    }else{
        randFilt=0;
        cluster=0;
    }
    sparse = document.getElementById('sparse').checked ? document.getElementById('sparse').value : 0;
}

//LINKING AND ROUTING
function startSound(freq=110){
    let periodicWave = createRichSoundSpectra();
    OSC.setPeriodicWave(periodicWave);
    OSC.connect(LO_PASS).connect(HI_PASS).connect(GAIN_IN).connect(GAIN_OUT).connect(C.destination);
    initFilters();
    OSC.frequency.value = freq;
    OSC.start();
}


//CONTROLLER
document.getElementById("startButton").onclick = () => {
    readStuffValues();
    startSound();
}
document.getElementById("stopButton").onclick = () => C.suspend();
document.getElementById("resumeButton").onclick = () => C.resume();
document.getElementById("changeFrequency1").onclick = () => OSC.frequency.value = 440;
lpfSlider.addEventListener("input", () => {
    let lpfVal = parseFloat(lpfSlider.value);
    lpfVal = parseFloat(sldExpConversion(lpfVal));
    setLoPass(lpfVal);
})
hpfSlider.addEventListener("input", () => {
    let hpfVal = parseFloat(hpfSlider.value);
    hpfVal = parseFloat(sldExpConversion(hpfVal));
    setHiPass(hpfVal);
})
gIn.addEventListener("input", () => {
    let val = parseFloat(gIn.value);
    setGainIn(val)
})
gOut.addEventListener("input", () => {
    let val = parseFloat(gOut.value);
    setGainOut(val)
})