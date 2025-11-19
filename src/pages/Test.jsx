import { Container, Typography, Box, Paper, Divider } from "@mui/material";
import { useState } from "react";
import Knob from "../components/Knob";
import BarChart from "../components/BarChart";

function Test() {
  const [volume, setVolume] = useState(50);
  const [frequency, setFrequency] = useState(440);
  const [resonance, setResonance] = useState(0.5);

  // Code block styling with syntax highlighting colors
  const codeBlockStyle = {
    backgroundColor: "#1e1e1e",
    color: "#d4d4d4",
    p: 2,
    borderRadius: 1,
    overflow: "auto",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: "0.875rem",
    lineHeight: 1.6,
    border: "1px solid #333",
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Test Page - Component Documentation
      </Typography>

      {/* Knob Demo */}
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          🎛️ Knob Component Demo
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          {/* Volume Knob */}
          <Knob
            label="Volume"
            min={0}
            max={100}
            value={volume}
            onChange={(val) => {
              setVolume(val);
              console.log("Volume:", val);
            }}
          />

          {/* Frequency Knob */}
          <Knob
            label="Frequency (Hz)"
            min={20}
            max={2000}
            value={frequency}
            onChange={(val) => {
              setFrequency(val);
              console.log("Frequency:", val);
            }}
          />

          {/* Resonance Knob */}
          <Knob
            label="Resonance"
            min={0}
            max={1}
            value={resonance}
            step={0.01}
            onChange={(val) => {
              setResonance(val);
              console.log("Resonance:", val);
            }}
          />
        </Box>

        {/* Display Values */}
        <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>Current Values:</strong>
          </Typography>
          <Typography variant="body2">Volume: {volume.toFixed(1)}</Typography>
          <Typography variant="body2">
            Frequency: {frequency.toFixed(1)} Hz
          </Typography>
          <Typography variant="body2">
            Resonance: {resonance.toFixed(3)}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>How to use:</strong> Click and hold the knob, then move
            mouse up/down to adjust the value.
          </Typography>
        </Box>
      </Paper>

      {/* 2. BarChart Component Demo (Dashboard with proportional scaling) */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          BarChart Component Demo (Dashboard)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This component displays multiple bars with proportional scaling. The
          maximum value is scaled to 80% of the container height, and all other
          values are scaled proportionally.
        </Typography>

        {/* BarChart Display */}
        <Box sx={{ width: "35%", mx: "auto" }}>
          <BarChart
            values={[
              0.2, 0.5, 0.8, 0.3, 0.6, 0.9, 0.4, 0.7, 1.0, 0.5, 0.3, 0.6,
            ]}
            height={200}
            title="Harmonic Distribution"
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Feature:</strong> The tallest bar represents the maximum
            value and scales to 80% of the container height. All other bars
            scale proportionally. Colors change based on height: Red (&gt;70%),
            Orange (&gt;50%), Purple (default).
          </Typography>
        </Box>
      </Paper>

      {/* Architecture Overview */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          📋 Application Architecture
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Page Hierarchy:
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`App.jsx (Root Component)
│
├─── Header.jsx (App Bar with Menu Button)
│    └─── Drawer (Side Navigation Menu)
│
├─── Page: ChordProgression.jsx
│    ├─── ControlPanel.jsx (Play/Stop/BPM Controls)
│    ├─── Timeline.jsx (Measures Container)
│    │    └─── Measure.jsx (×4 for 4 measures)
│    │         └─── Beat.jsx (×4 beats per measure)
│    │              ├─── First Half (Click Area)
│    │              └─── Second Half (Click Area)
│    ├─── StatusDisplay.jsx (Current Beat/Measure Display)
│    └─── ChordSelector.jsx (Chord Selection Dialog)
│         ├─── Step 1: Select Root Note (C, C#, D, ...)
│         └─── Step 2: Select Quality (Major, Minor, 7, ...)
│
├─── Page: SoundDesign.jsx
│    └─── (Future: Sound synthesis controls)
│
└─── Page: Test.jsx
     └─── Knob.jsx (Parameter Control Demos)`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Core Data Structures (Stored in App.jsx State):
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`// 1. beatChords - Stores all chord data
// Structure: { [beatIndex: number]: { first?: string, second?: string } }
// Example:
{
  0: { first: "C", second: "Am" },     // Measure 1, Beat 1
  1: { first: "F" },                    // Measure 1, Beat 2 (first half only)
  4: { second: "G7" },                  // Measure 2, Beat 1 (second half only)
  7: { first: "Dm", second: "G" },     // Measure 2, Beat 4
  // ... up to beat index (measures * 4 - 1)
}
// - beatIndex = measureIndex * 4 + beatIndex (0-based)
// - Empty beats are omitted (not stored)
// - Each beat can have 0, 1, or 2 chords

// 2. selectedBeat - Currently selected beat for editing
// Structure: { beatIndex: number, half: "first" | "second" } | null
// Example:
{ beatIndex: 3, half: "first" }        // Measure 1, Beat 4, first half
// - Used to track which beat half is being edited
// - Opens ChordSelector with this context

// 3. Music Playback State
{
  bpm: 120,                              // Beats per minute (1-300)
  isPlaying: false,                      // Playback status
  measures: 4,                           // Number of measures
  currentBeat: 0,                        // Current playing beat (0 to measures*4-1)
}

// 4. Navigation State
{
  currentPage: "chordProgression",       // Active page ID
  drawerOpen: false,                     // Side menu visibility
}`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Data Flow:
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`User Interaction Flow (Chord Selection):
1. User clicks beat half → Beat.jsx calls onClick(half)
2. ChordProgression calls handleBeatClick(beatIndex, half)
3. App.jsx updates selectedBeat = { beatIndex, half }
4. Single ChordSelector dialog opens (open={selectedBeat !== null})
   - Displays current chord for this specific beat/half
   - Same dialog instance, different content based on selectedBeat
5. User selects chord → ChordSelector calls onSelect(chord)
6. ChordProgression calls handleChordSelect(beatIndex, half, chord)
7. App.jsx updates beatChords state:
   - Creates/updates entry: beatChords[beatIndex][half] = chord
   - Or removes chord if chord === null
8. App.jsx sets selectedBeat = null (closes dialog)
9. Timeline re-renders, showing updated chord in Beat component

Key Point: ChordSelector Singleton Pattern
  ✓ Only ONE ChordSelector instance exists
  ✓ Clicking different beats updates selectedBeat state
  ✓ Same dialog shows different data based on selectedBeat
  ✓ Efficient: No need to create/destroy dialogs for each beat

Playback Flow:
1. User clicks Play → togglePlay() in App.jsx
2. setInterval triggers every (60/bpm * 1000) milliseconds
3. Each interval:
   - currentBeat increments (wraps at measures * 4)
   - Reads beatChords[currentBeat]
   - Plays first half chord immediately via audioEngine
   - Schedules second half chord with setTimeout (half beat delay)
4. Beat component receives isActive={beat === currentBeat}
5. Active beat shows visual animation`}
        </Box>
      </Paper>

      {/* Component APIs */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          🧩 Component APIs
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          1. Knob Component
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - min: number = 0           // Minimum value
  - max: number = 100         // Maximum value  
  - value: number = 50        // Current value
  - onChange: (val) => void   // Value change callback
  - label: string = ""        // Display label
  - step: number = 0.1        // Value increment (0.1, 0.01, etc.)

Features:
  - 270° rotation range (-135° to 135°)
  - Mouse drag interaction (vertical movement)
  - Auto-sized value display based on max value
  - Min/max labels at bottom corners
  - Dynamic decimal precision based on step

Example:
  <Knob
    label="Volume"
    min={0}
    max={100}
    value={volume}
    step={1}
    onChange={(val) => setVolume(val)}
  />`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          2. Beat Component
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - beatNumber: number        // Beat number (1-4)
  - isActive: boolean         // Is currently playing
  - chords: { first: string, second: string }  // Half-beat chords
  - onClick: (half) => void   // Click handler for first/second half

Features:
  - Split into two halves for half-beat chords
  - Visual tick marks (50/40px for first, 28px for second)
  - Animation on active beat
  - Chord display for each half`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          3. ControlPanel Component
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - isPlaying: boolean
  - bpm: number
  - measures: number
  - onPlay: () => void         // Start playback
  - onStop: () => void         // Stop playback
  - onReplay: () => void       // Restart from beginning
  - onRefresh: () => void      // Reset all state
  - onBpmChange: (e) => void   // BPM input change
  - onAddMeasure: () => void   // Add new measure

Features:
  - Play/Stop/Replay/Refresh buttons
  - BPM input field (1-300)
  - Measure count display
  - Add measure button`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. ChordSelector Component (Single Instance - Shared Dialog)
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - open: boolean              // Controlled by selectedBeat !== null
  - onClose: () => void
  - onSelect: (beatIndex, half, chord) => void  // Callback with full context
  - beatIndex: number          // From selectedBeat.beatIndex
  - half: "first" | "second"   // From selectedBeat.half
  - currentChord: string       // Current chord at this beat/half

How Chord Selection Works (Two-Step Process):

  Step 1: Select Root Note
    - User clicks one of 12 root notes (C, C#, D, etc.)
    - Internal state: setSelectedRoot(note)
    - Visual feedback: Selected button highlighted
  
  Step 2: Select Chord Quality
    - User clicks chord quality (Major, Minor, 7, etc.)
    - Component constructs chord name: root + suffix
      Example: "C" + "m7" = "Cm7"
    - Calls onSelect(beatIndex, half, chordName)
      Parameters passed back to parent:
        • beatIndex: Which beat (e.g., 5)
        • half: Which half ("first" or "second")
        • chord: Complete chord name (e.g., "Cm7")
    - Resets internal state: setSelectedRoot(null)
    - Closes dialog: onClose()

  Clear Chord Option:
    - "Clear Chord" button calls: onSelect(beatIndex, half, null)
    - Passing null removes the chord from beatChords

Callback Flow to Parent (App.jsx):
  ChordSelector.onSelect(beatIndex, half, chord)
    ↓
  handleChordSelect(beatIndex, half, chord) in App.jsx
    ↓
  setBeatChords((prev) => {
    const newChords = { ...prev };
    if (!newChords[beatIndex]) newChords[beatIndex] = {};
    
    if (chord === null) {
      delete newChords[beatIndex][half];  // Remove chord
    } else {
      newChords[beatIndex][half] = chord; // Set chord
    }
    
    return newChords;
  })

Key Design: Callback Pattern
  ✓ ChordSelector doesn't manage global state
  ✓ Only knows about: beatIndex, half (from props)
  ✓ Returns selection via onSelect callback
  ✓ Parent (App.jsx) decides how to update beatChords
  ✓ Clean separation of concerns`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. Timeline Component
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - measures: number           // Number of measures to display
  - currentBeat: number        // Current playing beat index
  - beatChords: object         // All chord data
  - onBeatClick: (beatIndex, half) => void  // Beat click handler

Features:
  - Container for all Measure components
  - Renders measures dynamically based on count
  - Passes down beat state and chord data
  - Horizontal scrollable layout for many measures`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          6. Measure Component
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - measureIndex: number       // Measure number (0-based)
  - currentBeat: number        // Current playing beat index
  - beatChords: object         // All chord data
  - onBeatClick: (beatIndex, half) => void  // Beat click handler

Structure:
  - Three-layer vertical layout:
    1. Measure number header
    2. Chord display layer (split for half-beats)
    3. Beat layer with 4 Beat components

Features:
  - Shows measure number (1-based for display)
  - Displays chords above beats
  - Groups 4 beats per measure
  - Calculates beat indices for child Beat components`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          7. StatusDisplay Component
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - currentBeat: number        // Current playing beat (0-based)
  - measures: number           // Total number of measures

Features:
  - Displays current measure and beat in human-readable format
  - Converts 0-based beat index to "Measure X, Beat Y"
  - Example: Beat 5 → "Measure 2, Beat 2"
  - Calculation:
    - Measure = Math.floor(currentBeat / 4) + 1
    - Beat = (currentBeat % 4) + 1`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          8. Header Component
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - onMenuClick: () => void    // Callback to open navigation drawer

Features:
  - Top app bar with application title
  - Menu button (hamburger icon) on the left
  - Fixed position at top of page
  - Material-UI AppBar with primary color theme`}
        </Box>
      </Paper>

      {/* State Management with useState */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          🔄 State Management with useState
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          State Hierarchy & Props Flow:
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`App.jsx (State Owner - All useState hooks here)
├── const [currentPage, setCurrentPage] = useState("chordProgression")
├── const [drawerOpen, setDrawerOpen] = useState(false)
├── const [bpm, setBpm] = useState(120)
├── const [isPlaying, setIsPlaying] = useState(false)
├── const [measures, setMeasures] = useState(4)
├── const [currentBeat, setCurrentBeat] = useState(0)
├── const [beatChords, setBeatChords] = useState({})
└── const [selectedBeat, setSelectedBeat] = useState(null)

Props Passed Down to ChordProgression.jsx:
  - bpm, setBpm                    → Used in ControlPanel
  - isPlaying                      → Controls play button state
  - measures                       → Determines timeline length
  - currentBeat                    → Highlights active beat
  - beatChords                     → Displays chords in beats
  - selectedBeat                   → Opens chord selector
  - togglePlay, stopPlay, etc.     → Event handlers
  - handleBeatClick                → Opens chord selector
  - handleChordSelect              → Updates beatChords
  - setSelectedBeat                → Closes chord selector

Props Flow Pattern:
App.jsx → ChordProgression.jsx → Component
├─→ ControlPanel.jsx
│   ├─ isPlaying (read-only)
│   ├─ bpm (read-only)
│   ├─ measures (read-only)
│   └─ onPlay, onStop, onBpmChange (callbacks)
│
├─→ Timeline.jsx → Measure.jsx → Beat.jsx
│   ├─ measures (read-only, determines count)
│   ├─ currentBeat (read-only, for highlighting)
│   ├─ beatChords (read-only, for display)
│   └─ onClick → handleBeatClick (callback)
│
├─→ StatusDisplay.jsx
│   ├─ currentBeat (read-only)
│   └─ measures (read-only)
│
└─→ ChordSelector.jsx
    ├─ open (computed: selectedBeat !== null)
    ├─ currentChord (read from beatChords[selectedBeat])
    ├─ onSelect → handleChordSelect (callback)
    └─ onClose → setSelectedBeat(null) (callback)

Key Principle: "Lift State Up"
- All state lives in App.jsx (single source of truth)
- Child components receive data via props (read-only)
- Child components call callbacks to request state changes
- State updates trigger re-renders down the tree`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          State Update Examples:
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`// 1. Simple State Update (BPM)
const handleBpmChange = (e) => {
  const value = parseInt(e.target.value);
  if (value > 0 && value <= 300) {
    setBpm(value);  // Direct update
  }
};

// 2. Complex State Update (beatChords)
const handleChordSelect = (beatIndex, half, chord) => {
  setBeatChords((prev) => {  // Use functional update for computed state
    const newChords = { ...prev };  // Copy existing state
    
    if (!newChords[beatIndex]) {
      newChords[beatIndex] = {};  // Create beat entry if missing
    }
    
    if (chord === null) {
      delete newChords[beatIndex][half];  // Remove chord
      if (!newChords[beatIndex].first && !newChords[beatIndex].second) {
        delete newChords[beatIndex];  // Clean up empty beat
      }
    } else {
      newChords[beatIndex][half] = chord;  // Add/update chord
    }
    
    return newChords;  // Return new state object
  });
};

// 3. Functional Update (currentBeat in useEffect)
setCurrentBeat((prev) => {
  const nextBeat = (prev + 1) % (measures * 4);  // Calculate next
  // ... side effects (play audio)
  return nextBeat;  // Return new value
});

Why use functional updates?
- When new state depends on previous state
- Ensures you have the latest state value
- Prevents race conditions in async updates`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          beatChords Data Structure:
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`{
  0: { first: "C", second: "Am" },    // Beat 0 (Measure 1, Beat 1)
  1: { first: "F" },                   // Beat 1 (only first half)
  4: { second: "G7" },                 // Beat 4 (only second half)
  7: { first: "Dm", second: "G" },    // Beat 7 (both halves)
  // ... up to beat 15 for 4 measures
}

// Empty beats are not stored in object
// Each beat can have 0, 1, or 2 chords
// Keys are beat indices: measure_index * 4 + beat_index`}
        </Box>
      </Paper>

      {/* useEffect for Playback */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          ⏱️ useEffect for Beat-by-Beat Playback
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Main Playback useEffect (App.jsx):
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`useEffect(() => {
  if (isPlaying) {
    // Start interval timer
    intervalRef.current = setInterval(() => {
      setCurrentBeat((prev) => {
        // Calculate next beat (wraps around)
        const nextBeat = (prev + 1) % (measures * 4);
        const chords = beatChords[nextBeat];

        // Play first half chord immediately
        if (chords?.first) {
          playChord(chords.first);
        }

        // Schedule second half chord (half beat later)
        if (chords?.second) {
          halfBeatTimeoutRef.current = setTimeout(() => {
            playChord(chords.second);
          }, halfBeatInterval);
        }

        return nextBeat;  // Update state
      });
    }, beatInterval);  // Repeat every beat
  } else {
    // Cleanup when stopped
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (halfBeatTimeoutRef.current) {
      clearTimeout(halfBeatTimeoutRef.current);
    }
  }

  // Cleanup on unmount or dependency change
  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (halfBeatTimeoutRef.current) clearTimeout(halfBeatTimeoutRef.current);
  };
}, [isPlaying, bpm, measures, beatInterval, halfBeatInterval, beatChords, playChord]);

// Key Concepts:
// 1. Effect runs when isPlaying changes (play/stop trigger)
// 2. setInterval creates repeating timer for beats
// 3. useRef stores interval ID (persists across renders)
// 4. Cleanup function prevents memory leaks
// 5. Dependencies array re-syncs when BPM/measures change`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Why useEffect is Perfect for Playback:
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`✅ Synchronizes with State Changes
   - When isPlaying changes from false → true, effect starts timer
   - When isPlaying changes from true → false, cleanup stops timer

✅ Handles Side Effects (Audio Playback)
   - Playing sounds is a "side effect" (external to React)
   - useEffect is designed for side effects
   - Separates timing logic from rendering logic

✅ Automatic Cleanup
   - Return function runs before next effect
   - Clears old intervals when BPM changes
   - Prevents multiple timers running simultaneously

✅ Reactive to Dependencies
   - When BPM changes: old effect cleans up, new one starts with new timing
   - When measures change: recalculates beat wrap-around
   - When beatChords change: next beat plays new chords

Timing Flow:
┌─────────────────────────────────────────────────────────┐
│ Beat 0 starts                                           │
│  ├─ Play chords.first immediately                       │
│  └─ setTimeout for chords.second (half beat later)     │
├─────────────────────────────────────────────────────────┤
│ After beatInterval (e.g., 500ms for 120 BPM)           │
│  └─ setInterval callback fires                          │
│     └─ setCurrentBeat increments to Beat 1             │
│        ├─ Play Beat 1 chords.first immediately          │
│        └─ setTimeout for Beat 1 chords.second           │
├─────────────────────────────────────────────────────────┤
│ Process repeats every beatInterval                      │
│ Wraps back to Beat 0 after (measures * 4) beats        │
└─────────────────────────────────────────────────────────┘

Using useRef for Timers:
- intervalRef.current stores setInterval ID
- halfBeatTimeoutRef.current stores setTimeout ID
- useRef doesn't trigger re-renders (unlike useState)
- Persists values across renders (unlike regular variables)
- Essential for cleanup in effect return function`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Timing Calculations:
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`// Calculate milliseconds per beat from BPM
const beatInterval = (60 / bpm) * 1000;
// Example: 120 BPM → (60/120) * 1000 = 500ms per beat

const halfBeatInterval = beatInterval / 2;
// Example: 120 BPM → 250ms per half beat

// Beat index calculation
const beatIndex = measureIndex * 4 + beatInMeasure;
// Measure 0, Beat 2 → 0 * 4 + 2 = Beat 2
// Measure 1, Beat 3 → 1 * 4 + 3 = Beat 7

// Wrap around after last beat
const nextBeat = (currentBeat + 1) % (measures * 4);
// 4 measures → wraps at beat 16 (back to 0)
// Beat 15 → (15 + 1) % 16 = 0`}
        </Box>
      </Paper>
    </Container>
  );
}

export default Test;
