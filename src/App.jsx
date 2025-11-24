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

function App() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState("chordProgression");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Music state
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [measures, setMeasures] = useState([4, 4, 4, 4]); // Array storing beats per measure
  const [currentBeat, setCurrentBeat] = useState(0);
  const [beatChords, setBeatChords] = useState({}); // Store chords for each beat { beatIndex: { first, second } }
  const [beatVelocities, setBeatVelocities] = useState({}); // Store velocity for each beat's first half { beatIndex: velocity }
  const [selectedBeat, setSelectedBeat] = useState(null); // { beatIndex, half }
  const intervalRef = useRef(null);
  const halfBeatTimeoutRef = useRef(null);

  // Calculate total beats across all measures
  const totalBeats = measures.reduce((sum, beats) => sum + beats, 0);

  // Calculate time interval per beat (milliseconds)
  const beatInterval = (60 / bpm) * 1000;
  const halfBeatInterval = beatInterval / 2;

  // Helper function to extract root note from chord name
  const extractRootNote = (chordName) => {
    if (!chordName) return null;
    if (chordName.length >= 2 && chordName[1] === "#") {
      return chordName.substring(0, 2); // C#, D#, etc.
    }
    return chordName[0]; // C, D, E, etc.
  };

  // Helper function to play chord
  const playChord = useCallback(
    (chordName) => {
      if (chordName) {
        const rootNote = extractRootNote(chordName);
        if (rootNote) {
          audioEngine.playChordRoot(rootNote, bpm);
        }
      }
    },
    [bpm]
  );

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentBeat((prev) => {
          const nextBeat = (prev + 1) % totalBeats;
          const chords = beatChords[nextBeat];

          // Check if next beat has custom velocity and update BPM
          const nextBeatVelocity = beatVelocities[nextBeat];
          if (nextBeatVelocity !== undefined) {
            setBpm(nextBeatVelocity);
          }

          // Play first half chord immediately
          if (chords?.first) {
            playChord(chords.first);
          }

          // Schedule second half chord
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

  const togglePlay = () => {
    // Initialize audio engine on first play (requires user interaction)
    audioEngine.init();
    setIsPlaying(true);
  };

  const stopPlay = () => {
    setIsPlaying(false);
  };

  const replayFromStart = () => {
    setCurrentBeat(0);
    setIsPlaying(true);
  };

  const refreshPage = () => {
    setIsPlaying(false);
    setCurrentBeat(0);
    setMeasures([4, 4, 4, 4]);
    setBpm(120);
    setBeatChords({});
  };

  const addMeasure = (beatsPerMeasure = 4) => {
    setMeasures((prev) => [...prev, beatsPerMeasure]);
  };

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

  const deleteMeasure = (measureIndex) => {
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

  const handleBpmChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 300) {
      setBpm(value);
    }
  };

  const handleBeatClick = (beatIndex, half) => {
    setSelectedBeat({ beatIndex, half });
  };

  // Handle velocity change for beat's first half
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

  const handleChordSelect = (beatIndex, half, chord) => {
    setBeatChords((prev) => {
      const newChords = { ...prev };

      if (!newChords[beatIndex]) {
        newChords[beatIndex] = {};
      }

      if (chord === null) {
        delete newChords[beatIndex][half];
        // Remove beat entry if both halves are empty
        if (!newChords[beatIndex].first && !newChords[beatIndex].second) {
          delete newChords[beatIndex];
        }
      } else {
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
        />
      )}

      {currentPage === "soundDesign" && <SoundDesign />}

      {currentPage === "test" && <Test />}
    </>
  );
}

export default App;
