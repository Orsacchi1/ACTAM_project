import { Container, Typography, Box, Paper, Divider } from "@mui/material";
import { useState } from "react";
import Knob from "../components/Knob";
import BarChart from "../components/BarChart";

function Test({soundEngine = null}) {
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
│    ├─── ControlPanel.jsx (Play/Stop/BPM/Beats Controls)
│    │    ├─── Play/Pause/Replay/Reset Buttons
│    │    ├─── BPM Input Field (Global Tempo)
│    │    ├─── Beats Per Measure Input
│    │    └─── Add Measure Button
│    ├─── Timeline.jsx (Measures Container)
│    │    └─── Measure.jsx (Dynamic count, variable beats)
│    │         ├─── Delete Button (Red X icon)
│    │         ├─── Insert Button (Green + icon)
│    │         ├─── Velocity Display Row (Purple tempo values)
│    │         ├─── Chord Display Row (Split for half-beats)
│    │         └─── Beat.jsx (×N beats per measure)
│    │              ├─── First Half (Click Area for chord/tempo)
│    │              └─── Second Half (Click Area for chord)
│    ├─── StatusDisplay.jsx (Current Beat/Measure Display)
│    └─── ChordSelector.jsx (Chord & Tempo Selection Dialog)
│         ├─── Tempo Section (BPM input with Apply/Clear)
│         ├─── Step 1: Select Root Note (C, C#, D, ...)
│         └─── Step 2: Select Quality (Major, Minor, 7, ...)
│
├─── Page: SoundDesign.jsx
│    └─── (Future: Sound synthesis controls)
│
└─── Page: Test.jsx
     ├─── Knob.jsx (Parameter Control Demos)
     └─── BarChart.jsx (Visualization Demo)`}
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
  // ... up to beat index (total beats - 1)
}
// - beatIndex = absolute position across all measures
// - Empty beats are omitted (not stored)
// - Each beat can have 0, 1, or 2 chords

// 2. beatVelocities - Stores per-beat custom tempo (NEW!)
// Structure: { [beatIndex: number]: bpm }
// Example:
{
  0: 140,    // Beat 0 plays at 140 BPM
  5: 100,    // Beat 5 plays at 100 BPM
  // Other beats use global BPM
}
// - Allows tempo changes mid-playback
// - Overrides global BPM setting for specific beats
// - Applied automatically during playback

// 3. measures - Array storing beats per measure (NEW!)
// Structure: number[] (each element = beats in that measure)
// Example:
[4, 4, 3, 5, 4]  // 5 measures with varying beat counts
// - Enables variable time signatures
// - Total beats = measures.reduce((sum, beats) => sum + beats, 0)
// - Beat index calculation: sum of previous measures + beat in current

// 4. selectedBeat - Currently selected beat for editing
// Structure: { beatIndex: number, half: "first" | "second" } | null
// Example:
{ beatIndex: 3, half: "first" }        // Beat 3, first half
// - Used to track which beat half is being edited
// - Opens ChordSelector with this context

// 5. Music Playback State
{
  bpm: 120,                              // Global BPM (1-300)
  isPlaying: false,                      // Playback status
  measures: [4, 4, 4, 4],               // Array of beats per measure
  currentBeat: 0,                        // Current playing beat (0 to totalBeats-1)
}

// 6. Navigation State
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
1. User clicks beat half → Beat.jsx calls onClick(beatIndex, half)
2. ChordProgression calls handleBeatClick(beatIndex, half)
3. App.jsx updates selectedBeat = { beatIndex, half }
4. Single ChordSelector dialog opens (open={selectedBeat !== null})
   - Displays current chord for this specific beat/half
   - Displays current tempo for this beat (NEW!)
   - Same dialog instance, different content based on selectedBeat
5. User selects chord → ChordSelector calls onSelect(beatIndex, half, chord)
6. User sets tempo → ChordSelector calls onBeatBpmChange(beatIndex, half, bpm)
7. App.jsx updates states:
   - beatChords: Creates/updates/removes chord
   - beatVelocities: Creates/updates/removes custom BPM
8. App.jsx sets selectedBeat = null (closes dialog)
9. Timeline re-renders, showing updated chord and tempo

Tempo Edit Flow (Click on Velocity Display):
1. User clicks tempo value in Measure component
2. Browser prompt appears asking for new BPM (40-240)
3. handleVelocitySelect(beatIndex, newBPM) called
4. App.jsx updates beatVelocities[beatIndex] = newBPM
5. Measure re-renders showing new tempo value

Measure Management Flow:
1. Insert Measure:
   - User clicks green + button on Measure
   - insertMeasure(afterMeasureIndex, beatsPerMeasure) called
   - New measure inserted at position
   - All beat indices after insertion point shift up
   - beatChords and beatVelocities automatically adjusted

2. Delete Measure:
   - User clicks red X button on Measure
   - deleteMeasure(measureIndex) called
   - Validates minimum 1 measure
   - Measure removed from array
   - Beat indices shift down
   - Data for deleted beats removed

Key Point: ChordSelector Singleton Pattern
  ✓ Only ONE ChordSelector instance exists
  ✓ Clicking different beats updates selectedBeat state
  ✓ Same dialog shows different data based on selectedBeat
  ✓ Efficient: No need to create/destroy dialogs for each beat

Playback Flow (with Dynamic Tempo):
1. User clicks Play → togglePlay() in App.jsx
   - Checks if current beat has custom velocity
   - Applies it with setBpm() if exists
2. setInterval triggers every (60/bpm * 1000) milliseconds
3. Each interval:
   - currentBeat increments (wraps at total beats)
   - Checks beatVelocities[nextBeat] (NEW!)
   - If custom velocity exists, calls setBpm(velocity)
   - Reads beatChords[currentBeat]
   - Plays first half chord immediately via audioEngine
   - Schedules second half chord with setTimeout (half beat delay)
4. Beat component receives isActive={beat === currentBeat}
5. Active beat shows visual animation

Replay Flow:
1. User clicks Replay → replayFromStart() in App.jsx
   - Sets currentBeat to 0
   - Checks beatVelocities[0]
   - Applies first beat's custom velocity if exists
   - Starts playback from beginning`}
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
  - bpm: number                         // Global tempo
  - measures: number                    // Measure count (for display)
  - beatsPerMeasure: number (NEW!)     // Beats for new measures
  - setBeatsPerMeasure: (n) => void (NEW!)  // Update beats value
  - onPlay: () => void                  // Start playback
  - onStop: () => void                  // Stop playback
  - onReplay: () => void                // Restart from beginning
  - onRefresh: () => void               // Reset all state
  - onBpmChange: (e) => void            // Global BPM input change
  - onAddMeasure: () => void            // Add new measure

Features:
  - Play/Stop/Replay/Refresh buttons
  - Global BPM input field (1-300)
  - Beats per measure input (1-15) (NEW!)
  - Measure count display
  - Add measure button (uses beatsPerMeasure value)

Note: beatsPerMeasure state lifted to ChordProgression
  - Shared between ControlPanel (input) and Timeline (insert)
  - Ensures consistent beat count across add/insert operations`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. ChordSelector Component (Single Instance - Shared Dialog)
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - open: boolean                    // Controlled by selectedBeat !== null
  - onClose: () => void
  - onSelect: (beatIndex, half, chord) => void     // Chord callback
  - onBeatBpmChange: (beatIndex, half, bpm) => void (NEW!)  // Tempo callback
  - beatIndex: number                // From selectedBeat.beatIndex
  - half: "first" | "second"         // From selectedBeat.half
  - currentChord: string             // Current chord at this beat/half
  - beatBpm: number (NEW!)           // Current custom BPM for this beat
  - defaultBpm: number (NEW!)        // Global BPM for reference

How Tempo Setting Works (NEW!):
  - TextField for BPM input (30-300 range)
  - Apply button: Sets custom tempo for this beat
    → onBeatBpmChange(beatIndex, half, bpmValue)
  - Clear button: Removes custom tempo
    → onBeatBpmChange(beatIndex, half, null)
  - Placeholder shows default BPM if no custom tempo set

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
  1. Chord Selection:
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

  2. Tempo Setting (NEW!):
     ChordSelector.onBeatBpmChange(beatIndex, half, bpm)
       ↓
     handleBeatBpmChange(beatIndex, _half, bpm) in ChordProgression
       ↓
     handleVelocitySelect(beatIndex, bpm) in App.jsx
       ↓
     setBeatVelocities((prev) => {
       const newVelocities = { ...prev };
       
       if (bpm === null) {
         delete newVelocities[beatIndex];  // Remove custom tempo
       } else {
         newVelocities[beatIndex] = bpm;   // Set custom tempo
       }
       
       return newVelocities;
     })

Key Design: Callback Pattern
  ✓ ChordSelector doesn't manage global state
  ✓ Only knows about: beatIndex, half (from props)
  ✓ Returns selection via callbacks
  ✓ Parent (App.jsx) decides how to update state
  ✓ Clean separation of concerns`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. Timeline Component
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - measures: number[]                // Array of beats per measure (NEW!)
  - currentBeat: number               // Current playing beat index
  - beatChords: object                // All chord data
  - beatVelocities: object (NEW!)     // All per-beat tempo data
  - onBeatClick: (beatIndex, half) => void      // Beat click handler
  - onVelocitySelect: (beatIndex, bpm) => void (NEW!)  // Tempo click
  - onInsertMeasure: (afterIndex, beats) => void (NEW!)  // Insert
  - onDeleteMeasure: (measureIndex) => void (NEW!)      // Delete
  - beatsPerMeasure: number (NEW!)    // Beats for new inserts (renamed beatsToInsert)

Features:
  - Container for all Measure components
  - Renders measures dynamically based on array length
  - Calculates start beat for each measure
  - Passes down beat state, chord data, and tempo data
  - 4 measures per row layout with colored backgrounds
  - Horizontal scrollable for many measures

Note: Prop renamed internally
  - Receives: beatsPerMeasure (from ControlPanel)
  - Uses as: beatsToInsert (to avoid shadowing local variable)
  - Fixed bug where local variable shadowed prop`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          6. Measure Component
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Props:
  - measureIndex: number                  // Measure number (0-based)
  - currentBeat: number                   // Current playing beat index
  - beatChords: object                    // All chord data
  - beatVelocities: object (NEW!)         // All per-beat tempo data
  - onBeatClick: (beatIndex, half) => void         // Beat click handler
  - onVelocitySelect: (beatIndex, bpm) => void (NEW!)  // Tempo handler
  - onInsertMeasure: (measureIndex, beats) => void (NEW!)  // Insert
  - onDeleteMeasure: (measureIndex) => void (NEW!)        // Delete
  - beatsPerMeasure: number (NEW!)        // Beats in this measure (variable!)
  - beatsToInsert: number (NEW!)          // Beats for insert operation
  - startBeat: number                     // Starting beat index for this measure

Structure:
  - Four-layer vertical layout (NEW!):
    1. Measure number header with Delete/Insert buttons
    2. Velocity display layer (clickable tempo values)
    3. Chord display layer (split for half-beats)
    4. Beat layer with N Beat components (variable count)

Features:
  - Shows measure number (1-based for display)
  - Delete button (red X icon) next to measure number
    → Deletes this measure (validates min 1 measure)
  - Insert button (green + icon) at right edge
    → Inserts new measure after this one
  - Velocity row: displays custom tempo for each beat
    → Click to edit via browser prompt (40-240 BPM)
    → Purple text color
  - Chord row: displays chords above beats
  - Variable beat count per measure (not always 4!)
  - Calculates absolute beat indices for child Beat components
  - Height: 150px (increased to fit tempo + chords)

Layout Details:
  Position: absolute; top: -20px  // Delete/Insert buttons
  Height: 20px                     // Velocity row
  Height: 24px                     // Chord row
  Flex: 1                          // Beat layer`}
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

      {/* NEW FEATURES */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: "#e8f5e9" }}>
        <Typography variant="h5" gutterBottom color="success.dark">
          ✨ NEW FEATURES: Per-Beat Tempo & Measure Management
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          1. Per-Beat Tempo Control
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Feature: Set custom BPM for individual beats

Data Structure:
  beatVelocities = {
    0: 140,   // Beat 0 plays at 140 BPM
    5: 100,   // Beat 5 plays at 100 BPM
    // Beats without entry use global BPM
  }

How it works:
  1. Click on beat half in timeline → Opens ChordSelector
  2. Enter BPM value in tempo field (30-300)
  3. Click Apply → Stores in beatVelocities[beatIndex]
  4. During playback:
     - Before playing each beat, checks beatVelocities[nextBeat]
     - If custom tempo exists, calls setBpm(velocity)
     - Next interval uses new tempo automatically

  5. Velocity display row shows custom tempo above beats (purple text)
  6. Click tempo value → Quick edit via browser prompt

Use cases:
  - Ritardando (slowing down): 120 → 110 → 100 → 90
  - Accelerando (speeding up): 100 → 110 → 120 → 130
  - Tempo changes between sections
  - Dynamic rhythm variations

Smart playback initialization:
  - Play button: Applies current beat's custom tempo
  - Replay button: Applies first beat's (beat 0) custom tempo`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          2. Measure CRUD Operations
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Feature: Add, Insert, Delete measures with data integrity

Data Structure:
  measures = [4, 4, 3, 5, 4]  // Array of beats per measure
  // Total beats = 4 + 4 + 3 + 5 + 4 = 20 beats

Operations:

A. Add Measure (at end):
   - Click "Add Measure" in ControlPanel
   - Appends new measure with beatsPerMeasure value
   - measures.push(beatsPerMeasure)
   - No data shifting needed

B. Insert Measure (after any measure):
   - Click green + icon on Measure component
   - Inserts measure after clicked measure
   - All data after insertion point shifts UP
   
   Example: Insert 3-beat measure after measure 1
     Before: measures = [4, 4, 4]
             beatChords = { 0: {...}, 4: {...}, 5: {...} }
     
     After:  measures = [4, 3, 4, 4]
             beatChords = { 0: {...}, 7: {...}, 8: {...} }
                                      ↑ shifted by 3
     
   Algorithm:
     1. Calculate insertBeat = sum of beats before + current measure
     2. Insert measure at position
     3. Shift all beatChords keys >= insertBeat by beatsPerMeasure
     4. Shift all beatVelocities keys >= insertBeat
     5. Adjust currentBeat if >= insertBeat

C. Delete Measure:
   - Click red X icon on Measure component
   - Validates minimum 1 measure (prevents empty timeline)
   - All data after deletion point shifts DOWN
   
   Example: Delete measure 1 (4 beats)
     Before: measures = [4, 4, 4]
             beatChords = { 0: {...}, 5: {...}, 8: {...} }
     
     After:  measures = [4, 4]
             beatChords = { 0: {...}, 4: {...} }
                                      ↑ shifted down by 4
     
   Algorithm:
     1. Calculate startBeat, endBeat of measure
     2. Remove measure from array
     3. Delete all beatChords keys in [startBeat, endBeat)
     4. Shift beatChords keys >= endBeat DOWN by beatsInMeasure
     5. Same for beatVelocities
     6. Reset currentBeat if in deleted range

Data Integrity:
  ✓ Beat indices automatically recalculated
  ✓ Chords and tempos move with their beats
  ✓ No orphaned data left behind
  ✓ Playback continues correctly after edit`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          3. Variable Time Signatures
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Feature: Different beat counts per measure

Examples:
  - [4, 4, 4, 4]      → Standard 4/4 time
  - [3, 3, 3, 3]      → Waltz in 3/4 time
  - [7, 7, 7, 7]      → Complex 7/4 time
  - [4, 4, 3, 4]      → Mixed meters
  - [5, 7, 4, 6]      → Progressive rock style

Implementation:
  - measures array stores beats per measure
  - Each Measure component renders beatsPerMeasure beats
  - Timeline calculates start beat for each measure:
    
    getStartBeat(measureIndex) {
      return measures
        .slice(0, measureIndex)
        .reduce((sum, beats) => sum + beats, 0);
    }
  
  - Total beats = measures.reduce((sum, beats) => sum + beats, 0)

UI:
  - "Beats" input in ControlPanel (1-15)
  - Shared between Add Measure and Insert operations
  - State lifted to ChordProgression level for consistency

Beat Index Calculation:
  Measure 0, Beat 2 in [4, 4, 3, 5]:
    startBeat = 0
    beatIndex = 0 + 2 = 2
  
  Measure 2, Beat 1 in [4, 4, 3, 5]:
    startBeat = 4 + 4 = 8
    beatIndex = 8 + 1 = 9`}
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. UI Improvements
        </Typography>
        <Box component="pre" sx={codeBlockStyle}>
          {`Spacing Adjustments:
  - Measure height: 100px → 150px (to fit tempo + chords)
  - Tempo row: 20px height (purple text)
  - Chord row: 24px height (increased from 20px)
  - Beat tick marks: 60/50/38px (increased from 50/40/28px)
  - Beat number row: 22px height

Color Coding:
  - Tempo values: Purple (secondary.main)
  - Delete button: Red (error.main)
  - Insert button: Green (success.main)
  - First half chords: Blue (primary.main)
  - Second half chords: Purple (secondary.main)

Interaction:
  - Tempo values: Clickable with hover effect
  - Delete/Insert buttons: IconButton with hover states
  - Beat halves: Click area with hover background

Validation:
  - Global BPM: 1-300
  - Per-beat tempo: 40-240
  - Beats per measure: 1-15
  - Minimum measures: 1 (cannot delete last measure)`}
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
├── const [measures, setMeasures] = useState([4, 4, 4, 4])  // Array now!
├── const [currentBeat, setCurrentBeat] = useState(0)
├── const [beatChords, setBeatChords] = useState({})
├── const [beatVelocities, setBeatVelocities] = useState({})  // NEW!
└── const [selectedBeat, setSelectedBeat] = useState(null)

Props Passed Down to ChordProgression.jsx:
  - bpm, setBpm                    → Used in ControlPanel
  - isPlaying                      → Controls play button state
  - measures                       → Array of beats per measure
  - currentBeat                    → Highlights active beat
  - beatChords                     → Displays chords in beats
  - beatVelocities (NEW!)          → Displays per-beat tempo
  - selectedBeat                   → Opens chord selector
  - togglePlay, stopPlay, etc.     → Event handlers
  - addMeasure                     → Add measure at end
  - insertMeasure (NEW!)           → Insert measure after index
  - deleteMeasure (NEW!)           → Delete measure at index
  - handleBeatClick                → Opens chord selector
  - handleChordSelect              → Updates beatChords
  - handleVelocitySelect (NEW!)    → Updates beatVelocities
  - setSelectedBeat                → Closes chord selector

Props Flow Pattern:
App.jsx → ChordProgression.jsx → Component
├─→ ControlPanel.jsx
│   ├─ isPlaying (read-only)
│   ├─ bpm (read-only)
│   ├─ measures.length (read-only, for display)
│   ├─ beatsPerMeasure (from ChordProgression state)
│   ├─ setBeatsPerMeasure (callback)
│   └─ onPlay, onStop, onBpmChange, onAddMeasure (callbacks)
│
├─→ Timeline.jsx → Measure.jsx → Beat.jsx
│   ├─ measures (array, determines count and beats per measure)
│   ├─ currentBeat (read-only, for highlighting)
│   ├─ beatChords (read-only, for display)
│   ├─ beatVelocities (NEW! read-only, for tempo display)
│   ├─ beatsPerMeasure (renamed beatsToInsert internally)
│   ├─ onBeatClick → handleBeatClick (callback)
│   ├─ onVelocitySelect → handleVelocitySelect (NEW! callback)
│   ├─ onInsertMeasure → insertMeasure (NEW! callback)
│   └─ onDeleteMeasure → deleteMeasure (NEW! callback)
│
├─→ StatusDisplay.jsx
│   ├─ currentBeat (read-only)
│   └─ measures (read-only)
│
└─→ ChordSelector.jsx
    ├─ open (computed: selectedBeat !== null)
    ├─ currentChord (read from beatChords[selectedBeat])
    ├─ beatBpm (NEW! read from beatVelocities[selectedBeat])
    ├─ defaultBpm (NEW! global BPM for reference)
    ├─ onSelect → handleChordSelect (callback)
    ├─ onBeatBpmChange → handleBeatBpmChange (NEW! callback)
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
        // Calculate next beat (wraps around at total beats)
        const totalBeats = measures.reduce((sum, beats) => sum + beats, 0);
        const nextBeat = (prev + 1) % totalBeats;
        const chords = beatChords[nextBeat];

        // Check if next beat has custom velocity and update BPM (NEW!)
        const nextBeatVelocity = beatVelocities[nextBeat];
        if (nextBeatVelocity !== undefined) {
          setBpm(nextBeatVelocity);
        }

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
    }, beatInterval);  // Repeat every beat (interval adjusts with BPM changes)
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
}, [isPlaying, bpm, measures, beatInterval, halfBeatInterval, beatChords, beatVelocities, playChord]);

// Key Concepts:
// 1. Effect runs when isPlaying changes (play/stop trigger)
// 2. setInterval creates repeating timer for beats
// 3. useRef stores interval ID (persists across renders)
// 4. Cleanup function prevents memory leaks
// 5. Dependencies array re-syncs when BPM/measures/beatVelocities change
// 6. Dynamic BPM: Checks beatVelocities before each beat (NEW!)`}
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
   - When global BPM changes: old effect cleans up, new one starts with new timing
   - When measures array changes: recalculates total beats and wrap-around
   - When beatChords change: next beat plays new chords
   - When beatVelocities change: applies new custom tempos (NEW!)

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

// Beat index calculation (variable beats per measure)
const beatIndex = measures.slice(0, measureIndex).reduce((sum, b) => sum + b, 0) + beatInMeasure;
// measures = [4, 4, 3, 5]
// Measure 0, Beat 2 → 0 + 2 = Beat 2
// Measure 2, Beat 1 → (4+4) + 1 = Beat 9

// Wrap around after last beat
const totalBeats = measures.reduce((sum, beats) => sum + beats, 0);
const nextBeat = (currentBeat + 1) % totalBeats;
// measures = [4, 4, 3, 5] → totalBeats = 16
// Beat 15 → (15 + 1) % 16 = 0`}
        </Box>
      </Paper>
    </Container>
  );
}

export default Test;
