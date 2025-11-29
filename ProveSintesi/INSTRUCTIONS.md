# SOUND ENGINE INSTRUCTIONS
## SOUND CREATION
###     HARMONICS
When you press start the harmonics are created in a pseudo randomic fashion using the Marienne Twister algorythm.
Their creation is based on 3 main parameters:
- Sparseness
- Damping
- Spectral amplitude quality

#### .1 SPARSENESS
If this flag is checked, the harmonics will be created randomly spaced (based on the void harmonic probability percentage inside the code) from each others.
Otherwise they will be created one next to the other.

#### .2 DAMPING
The damping describes how rapidly the harmonics decrease one after the other. There are 3 types:
 - .1 LINEAR: Resembles a SAWTOOTH wave 
 - .2 QUADRATIC: Resembles a SQUARE wave
 - .3 EXPONENTIAL: Resembles a SINE wave

#### .3 SPECTRAL AUDIO QUALITY
To add more depth to the sounds we put other parameters to make each sound unique but at the same time consistent with the rest of the sound family.
Here there are 3 options as well:
 - NONE: Doesn't add any processing during the creation of the harmonics
 - RANDOM FILTERING: Each harmonic, after being created, varies slightly thanks to the sum of a small cohefficient generated randomly each time
 - CLUSTER HARMONICS: Several groups of harmonics share the same base value that is recalculated each 8 (?) harmonics

### ENVELOPES
There are 3 types of envelopes added.

**!!!NOTE!!!**
The envelopes have for now just attack decay and sustain, the release mechanism should be discussed about how to be implemented, based on how and when we want to create the sound

- SYNTH: Classic with a small attack to avoid clipping
- PLUCK: Fast attack and decay, low sustain
- PAD: Very long attack and decay, low sustain

## SOUND MANIPULATION
### FILTERS
There are two filters, High-Cut and Low-Cut, that can be seen as one.
The High-Cut cuts the frequencies higher than the target frequency.
The Low-Cut cuts the frequencies lower than the target frequency

### EFFECTS
The main effects are 2, reverb and delay, for now they have fixed amount of feedback, decay and time but we can eventually implement dynamic effects.
**NOTE** _The reverb was implemented with node.js for semplicity_

## TODO LIST

- [ ] CREATE LFO FOR FILTERS
- [ ] CREATE MULTIPLE OSCILLATORS (max3) for more complex and rich sounds
- [ ] CREATE A DETUNE KNOB/SLIDER FOR EACH OSCILLATOR useful for creative sound design (e.g. super saw) or to play fixed chords with one note (MAX EXTENSION 1 OCTAVE)
- [ ] OCTAVE SELECTOR for each oscillator (-2 -1 0 +1 +2)

## IMPLEMENTATION AND PORTABILITY
The file is made so that every variable is "global" and accessible at any time (faster and simpler), this is because there aren't redundant values and variables, each element is defined as a functional and distinct piece.
To use it in the main project you have to run nmp install marsienne and tone.

The code is splitted into logic sections:
- Sound creation for the partial generating functions
- Sound manipulation for filters and effects
- Utility functions for setting values and retrieving informations
- Linking and routing for initializing the values and create the audio chain
- Controller to setup listeners and onclick events

### ADDING IT TO THE PROJECT
In order to add it to the project we just need to adapt the values retrieval part, everything else should be doable quite out of the box