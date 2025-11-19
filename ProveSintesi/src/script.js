
import fft from "fft.js";   //HAVE TO IMPORT THIS EXPLICITLY
import MersenneTwister from "mersenne-twister";  //For random generation

    const SAMPLE_RATE = 44100;
    const DURATION_SEC = 1.0; // 1 secondo => 44100 samples
    const NUM_SAMPLES = SAMPLE_RATE * DURATION_SEC;
    const generator = new MersenneTwister();
    let amp = generator.random_incl();

    const c = new AudioContext();
    const osc2 = c.createOscillator();

    let buffer = c.createBuffer(1, NUM_SAMPLES, SAMPLE_RATE);
    const data = buffer.getChannelData(0);  //Get direct access to raw audio data (samples) for low level manipulation
    const frequency = 440;
    //Create the wave
    for (let i = 0; i < NUM_SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        data[i] = Math.sin(2 * Math.PI * frequency * t); //I omitted the frequency
    }
    /*
    function init(c){
        o1 = c.createOscillator();
        o1.connect(c.destination);
        o1.start();
        o1.frequency.value = 440;
        return o1;
    }
*/

//Create the envelope
function createEnvelope(data, sampleRate, duration, attack = 0.4, decay = 0.2, sustain = 1, release = 0.4) {

    const numSamples = data.length;

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let env = 1;
        if (t < attack) {
            // Attack
            env = t / attack;
        } else if (t < attack + decay) {
            // Decay
            env = 1 - ((t - attack) / decay) * (1 - sustain);
        } else if (t < duration - release) {
            // Sustain
            env = sustain;
        } else {
            // Release
            const relT = (t - (duration - release)) / release;
            env = sustain * (1 - relT);
        }
        data[i] *= env;
    }
    return data;
}


//Starting point
    document.getElementById("startButton").onclick = () => {
    /*
    const source = c.createBufferSource();

    // Estrai i campioni
    const data = buffer.getChannelData(0);

    // Applica l'envelope
    createEnvelope(data, c.sampleRate, buffer.duration);
    */
    //const wave = periodicWaveFromSamples(c, data)
    const wave = wtFromHarmonicDescription(c);
    const osc = c.createOscillator();
    let periodicWave = periodicWaveFromSamples(c, data); //Use the full FTT transformation
    periodicWave = createEnvelope(periodicWave, SAMPLE_RATE, DURATION_SEC);
    // Riproduci
    //source.buffer = buffer;
    //source.connect(c.destination);
    osc.setPeriodicWave(periodicWave);
    osc2.setPeriodicWave(wave);
    osc.connect(c.destination);
    osc2.connect(c.destination);
    osc2.frequency.value = 440;
    osc.frequency.value = 440;
    //source.start();
    //osc.start();
    osc2.start();
};

//Create a wavetable from samples using the spectra but without FFT (lighter)
//Loss of information and distortion, the wave seems like a sawtooth
function sampToWt(c, samples){
    const tabSize = 4096;
    //const tabSize = 2048; //Ideal size for webAudio (compromise between quality and lightness)
    //Real and Imaginary part for the fourier analysis
    const re = new Float32Array(tabSize);
    const im = new Float32Array(tabSize);
    //Decimation (scaled copy of samples)
    for(let i=0; i<tabSize; i++){
        const t = i*(samples.length/tabSize)
        const i0 = Math.floor(t);
        const i1 = (i0+1)%samples.length;
        //Linear interpolation for the spectra
        const frac = t-i0;
        const v = samples[i0]*(1-frac)+samples[i1]*frac;
        re[i] = v;  //Amplitude of that component
        im[i] = 0; //Phase 0, they all start from the same phase
    }
    return c.createPeriodicWave(re, im, {disableNormalization: false});
}


//Create a wavetable using the actual FFT (run npm install fft.js)
function periodicWaveFromSamples(audioCtx, samples) {
    const N = 4096;

    const fft = new FFT(N);
    const out = fft.createComplexArray();
    const input = new Float32Array(N);

    // resampling
    for (let i = 0; i < N; i++) {
        const t = i * (samples.length / N);
        const i0 = Math.floor(t);
        const i1 = (i0 + 1) % samples.length;
        const frac = t - i0;
        input[i] = samples[i0] * (1 - frac) + samples[i1] * frac;
    }

    // FFT reale
    fft.realTransform(out, input);
    fft.completeSpectrum(out);

    const real = new Float32Array(N/2);
    const imag = new Float32Array(N/2);

    real[0] = 0;
    imag[0] = 0;

    for (let k = 1; k < N/2; k++) {
        real[k] = out[2*k];        // parte reale
        imag[k] = -out[2*k + 1];   // parte immaginaria (invertita)
    }

    return audioCtx.createPeriodicWave(real, imag);
}

//Now we actually use an explicit harmonic description of the sound we want to implement
function wtFromHarmonicDescription(c){
    const real = new Float32Array([0, 1, 0.5]); // armoniche
    const imag = new Float32Array([0, 0, 0]);
    const wave = c.createPeriodicWave(real, imag, {disableNormalization: false});
    return wave;
}
    
    document.getElementById("stopButton").onclick = () => c.suspend();
    document.getElementById("resumeButton").onclick = () => c.resume();
    document.getElementById("changeFrequency1").onclick = () => osc2.frequency.value = 220;