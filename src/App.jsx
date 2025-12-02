import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import translate from "./utils/translator";
import "./App.css";
import EngineInterface from "./services/EngineInterface";

function App() {
  // Use useMemo to create a single instance that persists across renders
  const engineInterface = useMemo(() => new EngineInterface(), []);

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
  const playChordRef = useRef(null); // Ref to hold playChord function

  // ========== Calculated Values ==========
  // Calculate total beats across all measures
  const totalBeats = measures.reduce((sum, beats) => sum + beats, 0);

  // Calculate time interval per beat (milliseconds)
  // Used by setInterval for playback timing
  const beatInterval = (60 / bpm) * 1000;
  const halfBeatInterval = beatInterval / 2;

  // ========== Helper Functions ==========

  /**
   * Calculate the duration a chord should play until the next chord
   * Takes into account tempo changes (beatVelocities) between the current and next chord
   *
   * @param {number} beatIndex - The beat index where the chord starts
   * @param {string} half - "first" or "second" half of the beat
   * @returns {number} Duration in milliseconds
   *
   * Example:
   * - Chord at beat 0, first half, next chord at beat 2, first half
   * - If beat 0 is 120 BPM, beat 1 is 60 BPM
   * - Duration = (0.5 beat at 120 BPM) + (1 beat at 60 BPM) + (0.5 beat at 60 BPM)
   */
  const calculateChordDuration = useCallback(
    (beatIndex, half) => {
      // Find the next chord position
      let nextBeatIndex = beatIndex;
      let nextHalf = half;
      let found = false;

      // Helper to get BPM for a specific beat (use beatVelocities or fallback to global bpm)
      const getBpmForBeat = (beat) => {
        return beatVelocities[beat] !== undefined ? beatVelocities[beat] : bpm;
      };

      // Helper to calculate time for a half beat at a given BPM (in milliseconds)
      const halfBeatTime = (beatBpm) => (60 / beatBpm / 2) * 1000;

      // Start searching from current position
      // If we're at "first", check "second" of same beat first
      if (half === "first") {
        if (beatChords[beatIndex]?.second) {
          // Next chord is in the second half of the same beat
          return halfBeatTime(getBpmForBeat(beatIndex));
        }
        nextHalf = "second";
      }

      // Search through subsequent beats
      for (
        let i = beatIndex + (half === "first" ? 0 : 1);
        i < totalBeats && !found;
        i++
      ) {
        // Check first half of this beat (skip if same beat and we started at first)
        if (i > beatIndex || half === "second") {
          if (beatChords[i]?.first) {
            nextBeatIndex = i;
            nextHalf = "first";
            found = true;
            break;
          }
        }

        // Check second half of this beat
        if (beatChords[i]?.second) {
          nextBeatIndex = i;
          nextHalf = "second";
          found = true;
          break;
        }
      }

      // If no next chord found, play until end of all measures
      if (!found) {
        nextBeatIndex = totalBeats;
        nextHalf = "first";
      }

      // Calculate total duration
      let duration = 0;

      // Current position
      let currentBeatIdx = beatIndex;
      let currentHalf = half;

      while (
        currentBeatIdx < nextBeatIndex ||
        (currentBeatIdx === nextBeatIndex && currentHalf !== nextHalf)
      ) {
        const currentBpm = getBpmForBeat(currentBeatIdx);
        const halfTime = halfBeatTime(currentBpm);

        if (currentHalf === "first") {
          duration += halfTime;
          currentHalf = "second";
        } else {
          duration += halfTime;
          currentBeatIdx++;
          currentHalf = "first";
        }

        // Safety check to prevent infinite loop
        if (currentBeatIdx > totalBeats) break;
      }

      return duration;
    },
    [beatChords, beatVelocities, bpm, totalBeats]
  );

  /**
   * Play chord using engineInterface
   *
   * Uses translator to convert chord name to frequencies
   * and calculateChordDuration to determine how long to play
   *
   * @param {string} chordName - Chord name (e.g., "Cmaj7", "Dm", "G7")
   * @param {number} beatIndex - The beat index where the chord is played
   * @param {string} half - "first" or "second" half of the beat
   */
  const playChord = useCallback(
    (chordName, beatIndex, half) => {
      if (chordName) {
        // Convert chord name to frequencies array
        const frequencies = translate(chordName);

        if (frequencies && frequencies.length > 0) {
          // Calculate how long this chord should play (in milliseconds)
          const duration = calculateChordDuration(beatIndex, half);

          // Play the chord using engineInterface
          engineInterface.playChordWithDuration(frequencies, duration);
        }
      }
    },
    [calculateChordDuration, engineInterface]
  );

  // Keep playChordRef updated with latest playChord function
  useEffect(() => {
    playChordRef.current = playChord;
  }, [playChord]);

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
            playChordRef.current?.(chords.first, nextBeat, "first");
          }

          // AUDIO ENGINE: Schedule second half chord
          // Plays at the midpoint of the beat
          if (chords?.second) {
            halfBeatTimeoutRef.current = setTimeout(() => {
              playChordRef.current?.(chords.second, nextBeat, "second");
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


    // Apply current beat's custom velocity if set
    const currentBeatVelocity = beatVelocities[currentBeat];
    if (currentBeatVelocity !== undefined) {
      setBpm(currentBeatVelocity);
    }

    // Play the current beat's chords immediately when starting
    const chords = beatChords[currentBeat];
    if (chords?.first) {
      playChordRef.current?.(chords.first, currentBeat, "first");
    }
    if (chords?.second) {
      // Schedule second half chord
      const currentHalfBeatInterval =
        (60 / (currentBeatVelocity || bpm) / 2) * 1000;
      setTimeout(() => {
        playChordRef.current?.(chords.second, currentBeat, "second");
      }, currentHalfBeatInterval);
    }

    setIsPlaying(true);
  };

  /**
   * Pause playback (maintains current beat position)
   */
  const stopPlay = () => {
    // Stop any currently playing sound
    engineInterface.stopSound();
    setIsPlaying(false);
  };

  /**
   * Restart playback from beat 0
   * Applies first beat's custom tempo if set
   */
  const replayFromStart = () => {
    // Stop any currently playing sound before restarting
    engineInterface.stopSound();

    setCurrentBeat(0);

    // Apply first beat's custom velocity if set
    const firstBeatVelocity = beatVelocities[0];
    if (firstBeatVelocity !== undefined) {
      setBpm(firstBeatVelocity);
    }

    // Play beat 0's chords immediately when restarting
    const chords = beatChords[0];
    if (chords?.first) {
      playChordRef.current?.(chords.first, 0, "first");
    }
    if (chords?.second) {
      // Schedule second half chord
      const currentHalfBeatInterval =
        (60 / (firstBeatVelocity || bpm) / 2) * 1000;
      setTimeout(() => {
        playChordRef.current?.(chords.second, 0, "second");
      }, currentHalfBeatInterval);
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
    setBeatVelocities({});
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
    // Stop sound and pause playback when switching pages
    engineInterface.stopSound();
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
