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

- [ ] Create normalize function for single oscillator
- [ ] Create a function that eventually sums up all the oscillators and normalizes them
- [ ] Create a function able to convert the bands to periodic waves Voice(Gen)->Engine(CreatePeriodic)->Voice(Reproduce)
- [ ] Link and route all the voices
- [ ] Fix return values of the setPartitions function
- [ ] Think about how to calculate the decay

# FRONTEND

- [ ] Add a GainIn and GainOut knob
- [ ] Initialize the position of the knowbs according to the values of the filters (already definet) and the effects (TBD)
- [ ] Fix the Bar Chart in order to contain 128 values
- [ ] The filters have just 2 knobs: Delay (mix, time) Reverb (mix, decay)

# VALUE

- Filters (hicut-locut): 0-22050
- Amount of effects (delay, reverb): 0-1
- Resonance: 0-1
- GainIn, GainOut: 0-1
- Buttons for damping type and spectral quality (strings)
