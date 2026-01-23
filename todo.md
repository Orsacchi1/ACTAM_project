# TODO LIST

- Define all the functionalities in depth
- Choose the features that are essentials for the project and the ones we may cut for lack of time
- Create a general flowchart on how the sound works (oscillators - filters - output)
- Based on features, create an idea on paper of the GUI
- Start working on the backEnd related to the frontEnd

# BACKEND

- BPM and time system
- Sound generation
  - Create sound
  - Save and Load
  - Import and Export
- Effect bank
- Sound stacks and layers
  - How to stack different sounds
  - How to create melodies
  - How to manage different patterns/chords/sounds

- [x] Create normalize function for single oscillator
- [x] Create a function that eventually sums up all the oscillators and normalizes them
- [x] Create a function able to convert the bands to periodic waves Voice(Gen)->Engine(CreatePeriodic)->Voice(Reproduce)
- [x] Link and route all the voices
- [x] Fix return values of the setPartitions function
- [x] Think about how to calculate the decay for the delay
- [x] Create a stable envelope generator
- [x] Make the sliders logarithmic
- [x] Filters get-set
- [x] Effects get-set
- [x] Add effects (delay/reverb) <strong>NOTE! once added the delay fix the connections from GAIN_IN to GAIN_OUT</strong>
- [x] Trigger the release value
- [x] Start and end sound
- [x] Create multiple voices of the same sound for tetrachords

# FRONTEND

- [x] Add a GainIn and GainOut knob
- [ ] Initialize the position of the knowbs according to the values of the filters (already defined) and the effects (gain=0, value=0.5)
- [x] Fix the Bar Chart in order to contain 128 values
- [x] The filters have just 2 knobs: Delay (mix, time) Reverb (mix, decay)
- [x] Create a group of 3 buttons for the damp type (linear, quadratic, exponential)
- [x] Create a group of 2 buttons for the amplitude quality (Random filtering, cluster harmonics, none)
- [x] (eventually) Create a group of 3 oscillators, each one has 2 knobs (detune and volume) and a button (selected)
- [ ] on the sound design page, display the correct values of the filters (return value of the function) because now they are logarithmic

# VALUE

- Filters (hipass-lopass): 0-22050
- Amount of effects (delay, reverb): 0-1
- Resonance: 0-1
- GainIn, GainOut: 0-1
- Buttons for damping type and spectral quality (strings)

# INITIAL VALUES

- lopass = 22050
- hipass = 0
- resonance = 0
- gainIn = gainOut = 0.8
- damping type = linear
- spectral quality = none
- mix on effects = 0
- amount and time = 0.5
