import { useState, useEffect, useRef, useCallback } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { Piano, Audiotrack, Science } from "@mui/icons-material";
import Header from "./components/Header";
import ChordProgression from "./pages/ChordProgression";
import SoundDesign from "./pages/SoundDesign";
import Test from "./pages/Test";
import { audioEngine } from "./utils/audioEngine";
import "./App.css";
import EngineInterface from "./services/EngineInterface";

function App() {
  const engineInterface = useRef(new EngineInterface()).current;

  // ========== Navigation State ==========
  const [currentPage, setCurrentPage] = useState("chordProgression");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ========== Music State ==========
  // Global BPM setting - can be overridden by per-beat velocities
  const [bpm, setBpm] = useState(120);

  // Playback control
  const [isPlaying, setIsPlaying] = useState(false);

  // Measures array: each element represents beats per measure
  // Example: [4, 4, 4, 4] = four measures with 4 beats each
  const [measures, setMeasures] = useState([4, 4, 4, 4]);

  // Current beat index (0-based) across all measures
  const [currentBeat, setCurrentBeat] = useState(0);

  // Beat chords: { beatIndex: { first: "Cmaj7", second: "G7" } }
  // Stores chord for first and second half of each beat
  const [beatChords, setBeatChords] = useState({});

  // Beat velocities: { beatIndex: bpmValue }
  // Stores custom BPM for specific beats (overrides global BPM)
  const [beatVelocities, setBeatVelocities] = useState({});

  // Currently selected beat for chord/tempo editing
  const [selectedBeat, setSelectedBeat] = useState(null); // { beatIndex, half }

  // Refs for playback intervals
  const intervalRef = useRef(null); // Main beat interval
  const halfBeatTimeoutRef = useRef(null); // Second half beat timeout

  // ========== Calculated Values ==========
  // Calculate total beats across all measures
  const totalBeats = measures.reduce((sum, beats) => sum + beats, 0);

  // Calculate time interval per beat (milliseconds)
  // Used by setInterval for playback timing
  const beatInterval = (60 / bpm) * 1000;
  const halfBeatInterval = beatInterval / 2;

  // ========== Helper Functions ==========
  /**
   * Extract root note from chord name
   * Example: "Cmaj7" -> "C", "F#m" -> "F#"
   */
  const extractRootNote = (chordName) => {
    if (!chordName) return null;
    if (chordName.length >= 2 && chordName[1] === "#") {
      return chordName.substring(0, 2); // C#, D#, etc.
    }
    return chordName[0]; // C, D, E, etc.
  };

  /**
   * Play chord using audioEngine
   *
   * TODO: This currently only plays the root note of the chord.
   * Future improvements needed:
   * 1. Play full chord (root + 3rd + 5th + extensions)
   * 2. Implement different voicings based on chord type
   * 3. Add velocity/volume control
   * 4. Support chord inversions
   * 5. Add ADSR envelope shaping
   *
   * @param {string} chordName - Chord name (e.g., "Cmaj7", "Dm", "G7")
   */
  const playChord = useCallback(
    (chordName) => {
      if (chordName) {
        const rootNote = extractRootNote(chordName);
        if (rootNote) {
          // AUDIO ENGINE: Play chord root note
          // TODO: Replace with full chord playback
          audioEngine.playChordRoot(rootNote, bpm);
        }
      }
    },
    [bpm]
  );

  /**
   * Main playback loop
   *
   * This effect handles the core playback logic:
   * 1. Advances beat counter on each interval
   * 2. Applies per-beat custom tempo if set
   * 3. Plays chords for first and second half of beat
   * 4. Cleans up intervals on stop or unmount
   */
  useEffect(() => {
    if (isPlaying) {
      // Set up interval to advance beats
      intervalRef.current = setInterval(() => {
        setCurrentBeat((prev) => {
          // Calculate next beat (loops back to 0 after last beat)
          const nextBeat = (prev + 1) % totalBeats;
          const chords = beatChords[nextBeat];

          // Apply per-beat custom tempo if set
          // This allows tempo changes mid-playback
          const nextBeatVelocity = beatVelocities[nextBeat];
          if (nextBeatVelocity !== undefined) {
            setBpm(nextBeatVelocity);
          }

          // AUDIO ENGINE: Play first half chord immediately
          if (chords?.first) {
            playChord(chords.first);
          }

          // AUDIO ENGINE: Schedule second half chord
          // Plays at the midpoint of the beat
          if (chords?.second) {
            halfBeatTimeoutRef.current = setTimeout(() => {
              playChord(chords.second);
            }, halfBeatInterval);
          }

          return nextBeat;
        });
      }, beatInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (halfBeatTimeoutRef.current) {
        clearTimeout(halfBeatTimeoutRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (halfBeatTimeoutRef.current) {
        clearTimeout(halfBeatTimeoutRef.current);
      }
    };
  }, [
    isPlaying,
    bpm,
    totalBeats,
    beatInterval,
    halfBeatInterval,
    beatChords,
    beatVelocities,
    playChord,
  ]);

  /**
   * Start playback from current beat
   *
   * AUDIO ENGINE: Initializes audio context (requires user interaction)
   * Applies current beat's custom tempo if set
   */
  const togglePlay = () => {
    // AUDIO ENGINE: Initialize audio context
    // Note: Must be called after user interaction (browser requirement)
    audioEngine.init();

    // Apply current beat's custom velocity if set
    const currentBeatVelocity = beatVelocities[currentBeat];
    if (currentBeatVelocity !== undefined) {
      setBpm(currentBeatVelocity);
    }

    setIsPlaying(true);
  };

  /**
   * Pause playback (maintains current beat position)
   */
  const stopPlay = () => {
    setIsPlaying(false);
  };

  /**
   * Restart playback from beat 0
   * Applies first beat's custom tempo if set
   */
  const replayFromStart = () => {
    setCurrentBeat(0);

    // Apply first beat's custom velocity if set
    const firstBeatVelocity = beatVelocities[0];
    if (firstBeatVelocity !== undefined) {
      setBpm(firstBeatVelocity);
    }

    setIsPlaying(true);
  };

  /**
   * Reset all state to initial values
   * Clears all chords, tempos, and resets to 4 measures
   */
  const refreshPage = () => {
    setIsPlaying(false);
    setCurrentBeat(0);
    setMeasures([4, 4, 4, 4]);
    setBpm(120);
    setBeatChords({});
    // Note: beatVelocities not cleared - add if needed
  };

  /**
   * Add a new measure at the end
   * @param {number} beatsPerMeasure - Number of beats in the new measure
   */
  const addMeasure = (beatsPerMeasure = 4) => {
    setMeasures((prev) => [...prev, beatsPerMeasure]);
  };

  /**
   * Insert a new measure after specified index
   * Automatically shifts beat indices for chords and velocities
   *
   * @param {number} afterMeasureIndex - Insert after this measure (0-based)
   * @param {number} beatsPerMeasure - Number of beats in new measure
   */
  const insertMeasure = (afterMeasureIndex, beatsPerMeasure = 4) => {
    // Calculate the beat position where the new measure will be inserted
    const insertBeat = measures
      .slice(0, afterMeasureIndex + 1)
      .reduce((sum, beats) => sum + beats, 0);

    // Insert the measure
    setMeasures((prev) => {
      const newMeasures = [...prev];
      newMeasures.splice(afterMeasureIndex + 1, 0, beatsPerMeasure);
      return newMeasures;
    });

    // Shift chords and velocities after the insertion point
    setBeatChords((prev) => {
      const newChords = {};
      Object.keys(prev).forEach((beatIndexStr) => {
        const beatIndex = parseInt(beatIndexStr);
        if (beatIndex < insertBeat) {
          // Keep beats before insertion
          newChords[beatIndex] = prev[beatIndex];
        } else {
          // Shift beats after insertion
          newChords[beatIndex + beatsPerMeasure] = prev[beatIndex];
        }
      });
      return newChords;
    });

    setBeatVelocities((prev) => {
      const newVelocities = {};
      Object.keys(prev).forEach((beatIndexStr) => {
        const beatIndex = parseInt(beatIndexStr);
        if (beatIndex < insertBeat) {
          newVelocities[beatIndex] = prev[beatIndex];
        } else {
          newVelocities[beatIndex + beatsPerMeasure] = prev[beatIndex];
        }
      });
      return newVelocities;
    });

    // Adjust current beat if needed
    setCurrentBeat((prev) => {
      if (prev >= insertBeat) {
        return prev + beatsPerMeasure;
      }
      return prev;
    });
  };

  /**
   * Delete a measure at specified index
   * Automatically shifts beat indices for chords and velocities
   * Validates minimum 1 measure requirement
   *
   * @param {number} measureIndex - Index of measure to delete (0-based)
   */
  const deleteMeasure = (measureIndex) => {
    // Validation: at least one measure must remain
    if (measures.length <= 1) {
      alert("At least one measure must be kept");
      return;
    }

    // Calculate the start beat of the measure to be deleted
    const startBeat = measures
      .slice(0, measureIndex)
      .reduce((sum, beats) => sum + beats, 0);
    const beatsInMeasure = measures[measureIndex];
    const endBeat = startBeat + beatsInMeasure;

    // Remove the measure
    setMeasures((prev) => prev.filter((_, index) => index !== measureIndex));

    // Remove chords and velocities for beats in the deleted measure
    // and shift down beats after the deleted measure
    setBeatChords((prev) => {
      const newChords = {};
      Object.keys(prev).forEach((beatIndexStr) => {
        const beatIndex = parseInt(beatIndexStr);
        if (beatIndex < startBeat) {
          // Keep beats before deleted measure
          newChords[beatIndex] = prev[beatIndex];
        } else if (beatIndex >= endBeat) {
          // Shift down beats after deleted measure
          newChords[beatIndex - beatsInMeasure] = prev[beatIndex];
        }
        // Skip beats in deleted measure (startBeat <= beatIndex < endBeat)
      });
      return newChords;
    });

    setBeatVelocities((prev) => {
      const newVelocities = {};
      Object.keys(prev).forEach((beatIndexStr) => {
        const beatIndex = parseInt(beatIndexStr);
        if (beatIndex < startBeat) {
          newVelocities[beatIndex] = prev[beatIndex];
        } else if (beatIndex >= endBeat) {
          newVelocities[beatIndex - beatsInMeasure] = prev[beatIndex];
        }
      });
      return newVelocities;
    });

    // Reset current beat if it's in or after the deleted measure
    setCurrentBeat((prev) => {
      if (prev >= endBeat) {
        return prev - beatsInMeasure;
      } else if (prev >= startBeat) {
        return startBeat > 0 ? startBeat - 1 : 0;
      }
      return prev;
    });
  };

  /**
   * Handle global BPM change from control panel
   * Validates range 1-300 BPM
   */
  const handleBpmChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 300) {
      setBpm(value);
    }
  };

  /**
   * Handle beat click - opens ChordSelector dialog
   * @param {number} beatIndex - Absolute beat index
   * @param {string} half - "first" or "second" half of beat
   */
  const handleBeatClick = (beatIndex, half) => {
    setSelectedBeat({ beatIndex, half });
  };

  /**
   * Handle per-beat velocity (tempo) change
   * @param {number} beatIndex - Absolute beat index
   * @param {number|null} velocity - BPM value or null to clear
   */
  const handleVelocitySelect = (beatIndex, velocity) => {
    setBeatVelocities((prev) => {
      const newVelocities = { ...prev };

      if (velocity === null || velocity === undefined) {
        delete newVelocities[beatIndex];
      } else {
        newVelocities[beatIndex] = velocity;
      }

      return newVelocities;
    });
  };

  /**
   * Handle chord selection for a beat half
   * Manages beatChords state object structure
   *
   * @param {number} beatIndex - Absolute beat index
   * @param {string} half - "first" or "second" half of beat
   * @param {string|null} chord - Chord name or null to clear
   */
  const handleChordSelect = (beatIndex, half, chord) => {
    setBeatChords((prev) => {
      const newChords = { ...prev };

      // Initialize beat entry if doesn't exist
      if (!newChords[beatIndex]) {
        newChords[beatIndex] = {};
      }

      if (chord === null) {
        // Clear the specified half
        delete newChords[beatIndex][half];
        // Remove beat entry if both halves are empty (cleanup)
        if (!newChords[beatIndex].first && !newChords[beatIndex].second) {
          delete newChords[beatIndex];
        }
      } else {
        // Set the chord for specified half
        newChords[beatIndex][half] = chord;
      }

      return newChords;
    });
  };

  // Menu navigation
  const menuItems = [
    { id: "chordProgression", label: "Chord Progression", icon: <Piano /> },
    { id: "soundDesign", label: "Sound Design", icon: <Audiotrack /> },
    { id: "test", label: "Test", icon: <Science /> },
  ];

  const handleMenuClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handlePageChange = (pageId) => {
    // Pause playback when switching pages
    if (isPlaying) {
      setIsPlaying(false);
    }
    setCurrentPage(pageId);
    setDrawerOpen(false);
  };

  return (
    <>
      <Header onMenuClick={handleMenuClick} />

      {/* Side Drawer Navigation */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={currentPage === item.id}
                  onClick={() => handlePageChange(item.id)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Page Content */}
      {currentPage === "chordProgression" && (
        <ChordProgression
          bpm={bpm}
          setBpm={setBpm}
          isPlaying={isPlaying}
          measures={measures}
          currentBeat={currentBeat}
          beatChords={beatChords}
          beatVelocities={beatVelocities}
          selectedBeat={selectedBeat}
          togglePlay={togglePlay}
          stopPlay={stopPlay}
          replayFromStart={replayFromStart}
          refreshPage={refreshPage}
          addMeasure={addMeasure}
          insertMeasure={insertMeasure}
          deleteMeasure={deleteMeasure}
          handleBpmChange={handleBpmChange}
          handleVelocitySelect={handleVelocitySelect}
          handleBeatClick={handleBeatClick}
          handleChordSelect={handleChordSelect}
          setSelectedBeat={setSelectedBeat}
          soundEngine={engineInterface}
        />
      )}

      {currentPage === "soundDesign" && (
        <SoundDesign soundEngine={engineInterface} />
      )}

      {currentPage === "test" && <Test soundEngine={engineInterface} />}
    </>
  );
}

export default App;
