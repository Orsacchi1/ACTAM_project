import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { useState } from "react";
import Knob from "../components/Knob";
import BarChart from "../components/BarChart";
import EngineInterface from "../services/EngineInterface";

/**
 * SOUND DESIGN PAGE - Configuration & Usage Guide
 *
 * === CONFIGURATION ===
 * KNOB_CONFIG: Configuration array defining all knob parameters (label, min, max, step, default)
 * - Modify knob labels, ranges, etc. by editing this configuration only
 *
 * === STATE VARIABLES (Current knob values) ===
 * Left Column, Row 1: l1a, l1b, l1c (Hi Cut Filter - Frequency, Resonance, Amount)
 * Left Column, Row 2: l2a, l2b, l2c (Lo Cut Filter - Frequency, Resonance, Amount)
 * Left Column, Row 3: l3a, l3b, l3c (Resonance Filter - Frequency, Q Factor, Amount)
 * Right Column, Row 1: r1a, r1b, r1c, r1d (Envelope - Attack, Decay, Sustain, Release)
 * Right Column, Row 2: harmonics (array of 12 harmonic values, range 0-1)
 *
 * === HANDLER FUNCTIONS (Add audio engine logic here) ===
 * handleL1aChange(value), handleL1bChange(value), handleL1cChange(value)
 * handleL2aChange(value), handleL2bChange(value), handleL2cChange(value)
 * handleL3aChange(value), handleL3bChange(value), handleL3cChange(value)
 * handleR1aChange(value), handleR1bChange(value), handleR1cChange(value), handleR1dChange(value)
 * - Each function contains a TODO comment where you can add audio engine update logic
 * - These functions are called whenever a knob value changes
 *
 * === BUTTON FUNCTIONS ===
 * handleGenerate(): Randomly generates harmonics, modifying the 'harmonics' variable
 * - Customize the random algorithm to generate more musically useful harmonic distributions
 * handleSave(): Save all current parameters (TODO)
 * handleLoad(): Load saved parameters (TODO)
 */

// Knob configuration dictionary
// Format: [Left/Right][Row Number][Knob Position A/B/C/D]
const KNOB_CONFIG = [
  // Section 0 - Left Column, Row 1 (l1a, l1b, l1c) - Hi Cut Filter (Low Pass)
  {
    title: "Filters",
    knobs: [
      {
        id: "l1a",
        label: "Hi-Cut",
        min: 20,
        max: 20000,
        step: 1,
        default: 5000,
      },
      {
        id: "l1b",
        label: "Lo-Cut",
        min: 20,
        max: 20000,
        step: 1,
        default: 5000,
      },
      {
        id: "l1c",
        label: "Res",
        min: 20,
        max: 20000,
        step: 1,
        default: 5000,
      },
    ],
  },
  // Section 1 - Left Column, Row 2 (l2a, l2b, l2c) - Lo Cut Filter (High Pass)
  {
    title: "Delay",
    knobs: [
      {
        id: "l2a",
        label: "AMT",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "l2b",
        label: "Pin-Pong",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "l2c",
        label: "TBD.",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
    ],
  },
  // Section 2 - Left Column, Row 3 (l3a, l3b, l3c) - Resonance Filter (Band Pass)
  {
    title: "Reverb",
    knobs: [
      {
        id: "l3a",
        label: "TBD.",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "l3b",
        label: "TBD.",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "l3c",
        label: "TBD.",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
    ],
  },
  // Section 3 - Right Column, Row 1 (r1a, r1b, r1c, r1d) - Envelope (ADSR)
  {
    title: "Envelope",
    knobs: [
      {
        id: "r1a",
        label: "Attack",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.1,
      },
      {
        id: "r1b",
        label: "Decay",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.2,
      },
      {
        id: "r1c",
        label: "Sustain",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "r1d",
        label: "Release",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.2,
      },
    ],
  },
];

function SoundDesign({ soundEngine = null }) {
  // Left Column (L), Row 1, Knobs A/B/C - Hi Cut Filter
  const [l1a, setL1a] = useState(KNOB_CONFIG[0].knobs[0].default);
  const [l1b, setL1b] = useState(KNOB_CONFIG[0].knobs[1].default);
  const [l1c, setL1c] = useState(KNOB_CONFIG[0].knobs[2].default);

  // Left Column (L), Row 2, Knobs A/B/C - Lo Cut Filter
  const [l2a, setL2a] = useState(KNOB_CONFIG[1].knobs[0].default);
  const [l2b, setL2b] = useState(KNOB_CONFIG[1].knobs[1].default);
  const [l2c, setL2c] = useState(KNOB_CONFIG[1].knobs[2].default);

  // Left Column (L), Row 3, Knobs A/B/C - Resonance Filter
  const [l3a, setL3a] = useState(KNOB_CONFIG[2].knobs[0].default);
  const [l3b, setL3b] = useState(KNOB_CONFIG[2].knobs[1].default);
  const [l3c, setL3c] = useState(KNOB_CONFIG[2].knobs[2].default);

  // Right Column (R), Row 1, Knobs A/B/C/D - Envelope (ADSR)
  const [r1a, setR1a] = useState(KNOB_CONFIG[3].knobs[0].default);
  const [r1b, setR1b] = useState(KNOB_CONFIG[3].knobs[1].default);
  const [r1c, setR1c] = useState(KNOB_CONFIG[3].knobs[2].default);
  const [r1d, setR1d] = useState(KNOB_CONFIG[3].knobs[3].default);

  // Wavetable (WT) - 12 harmonics
  const [harmonics, setHarmonics] = useState([
    1.0, 0.5, 0.3, 0.2, 0.15, 0.1, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02,
  ]);

  // Handler functions for knobs
  // IMPORTANT: Use the 'value' parameter (not the state variable) for audio engine updates
  // to ensure you're using the latest value, as React state updates are asynchronous
  const handleL1aChange = (value) => {
    setL1a(value);
    soundEngine.setFiltersHiCut(value);
  };

  const handleL1bChange = (value) => {
    setL1b(value);
    soundEngine.setFiltersLoCut(value);
  };

  const handleL1cChange = (value) => {
    setL1c(value);
    soundEngine.setFiltersRes(value);
  };

  const handleL2aChange = (value) => {
    setL2a(value);
    // TODO: Add audio engine update logic here using 'value' parameter
  };

  const handleL2bChange = (value) => {
    setL2b(value);
    // TODO: Add audio engine update logic here using 'value' parameter
  };

  const handleL2cChange = (value) => {
    setL2c(value);
    // TODO: Add audio engine update logic here using 'value' parameter
  };

  const handleL3aChange = (value) => {
    setL3a(value);
    // TODO: Add audio engine update logic here using 'value' parameter
  };

  const handleL3bChange = (value) => {
    setL3b(value);
    // TODO: Add audio engine update logic here using 'value' parameter
  };

  const handleL3cChange = (value) => {
    setL3c(value);
    // TODO: Add audio engine update logic here using 'value' parameter
  };

  const handleR1aChange = (value) => {
    setR1a(value);
    soundEngine.setEnvelopeAttack(value);
  };

  const handleR1bChange = (value) => {
    setR1b(value);
    soundEngine.setEnvelopeDecay(value);
  };

  const handleR1cChange = (value) => {
    setR1c(value);
    soundEngine.setEnvelopeSustain(value);
  };

  const handleR1dChange = (value) => {
    setR1d(value);
    soundEngine.setEnvelopeRelease(value);
  };

  const handleSave = () => {
    console.log("Save preset");
    // TODO: Implement save functionality
  };

  const handleLoad = () => {
    console.log("Load preset");
    // TODO: Implement load functionality
  };

  const handleListen = () => {
    console.log("Listen to current sound");
    // Example: Play a test note with current settings
    soundEngine.playTestNote();
  };

  const handleGenerate = () => {
    // Generate random harmonics
    const newHarmonics = soundEngine.setPartitions();
    setHarmonics(newHarmonics);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          mb: 3,
        }}
      >
        Sound Design
      </Typography> */}

      {/* Main Layout: Left-Right Split */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default" }}>
        <Box sx={{ display: "flex", gap: 4, alignItems: "stretch" }}>
          {/* Left Section - 3 Rows of 3 Knobs Each */}
          <Box
            sx={{
              flex: 0.8,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minWidth: 0,
            }}
          >
            {/* Row 1 - Hi Cut Filter */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mb: 1, fontWeight: 600 }}
              >
                {KNOB_CONFIG[0].title}
              </Typography>
              <Box sx={{ display: "flex", gap: 4, justifyContent: "center" }}>
                <Knob
                  label={KNOB_CONFIG[0].knobs[0].label}
                  min={KNOB_CONFIG[0].knobs[0].min}
                  max={KNOB_CONFIG[0].knobs[0].max}
                  step={KNOB_CONFIG[0].knobs[0].step}
                  value={l1a}
                  onChange={handleL1aChange}
                />
                <Knob
                  label={KNOB_CONFIG[0].knobs[1].label}
                  min={KNOB_CONFIG[0].knobs[1].min}
                  max={KNOB_CONFIG[0].knobs[1].max}
                  step={KNOB_CONFIG[0].knobs[1].step}
                  value={l1b}
                  onChange={handleL1bChange}
                />
                <Knob
                  label={KNOB_CONFIG[0].knobs[2].label}
                  min={KNOB_CONFIG[0].knobs[2].min}
                  max={KNOB_CONFIG[0].knobs[2].max}
                  step={KNOB_CONFIG[0].knobs[2].step}
                  value={l1c}
                  onChange={handleL1cChange}
                />
              </Box>
            </Paper>

            {/* Row 2 - Lo Cut Filter */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mb: 1, fontWeight: 600 }}
              >
                {KNOB_CONFIG[1].title}
              </Typography>
              <Box sx={{ display: "flex", gap: 4, justifyContent: "center" }}>
                <Knob
                  label={KNOB_CONFIG[1].knobs[0].label}
                  min={KNOB_CONFIG[1].knobs[0].min}
                  max={KNOB_CONFIG[1].knobs[0].max}
                  step={KNOB_CONFIG[1].knobs[0].step}
                  value={l2a}
                  onChange={handleL2aChange}
                />
                <Knob
                  label={KNOB_CONFIG[1].knobs[1].label}
                  min={KNOB_CONFIG[1].knobs[1].min}
                  max={KNOB_CONFIG[1].knobs[1].max}
                  step={KNOB_CONFIG[1].knobs[1].step}
                  value={l2b}
                  onChange={handleL2bChange}
                />
                <Knob
                  label={KNOB_CONFIG[1].knobs[2].label}
                  min={KNOB_CONFIG[1].knobs[2].min}
                  max={KNOB_CONFIG[1].knobs[2].max}
                  step={KNOB_CONFIG[1].knobs[2].step}
                  value={l2c}
                  onChange={handleL2cChange}
                />
              </Box>
            </Paper>

            {/* Row 3 - Resonance Filter */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mb: 1, fontWeight: 600 }}
              >
                {KNOB_CONFIG[2].title}
              </Typography>
              <Box sx={{ display: "flex", gap: 4, justifyContent: "center" }}>
                <Knob
                  label={KNOB_CONFIG[2].knobs[0].label}
                  min={KNOB_CONFIG[2].knobs[0].min}
                  max={KNOB_CONFIG[2].knobs[0].max}
                  step={KNOB_CONFIG[2].knobs[0].step}
                  value={l3a}
                  onChange={handleL3aChange}
                />
                <Knob
                  label={KNOB_CONFIG[2].knobs[1].label}
                  min={KNOB_CONFIG[2].knobs[1].min}
                  max={KNOB_CONFIG[2].knobs[1].max}
                  step={KNOB_CONFIG[2].knobs[1].step}
                  value={l3b}
                  onChange={handleL3bChange}
                />
                <Knob
                  label={KNOB_CONFIG[2].knobs[2].label}
                  min={KNOB_CONFIG[2].knobs[2].min}
                  max={KNOB_CONFIG[2].knobs[2].max}
                  step={KNOB_CONFIG[2].knobs[2].step}
                  value={l3c}
                  onChange={handleL3cChange}
                />
              </Box>
            </Paper>
          </Box>

          {/* Right Section - 3 Rows */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
            }}
          >
            {/* Row 1 - ENV (4 Knobs) */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mb: 1, fontWeight: 600 }}
              >
                {KNOB_CONFIG[3].title}
              </Typography>
              <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
                <Knob
                  label={KNOB_CONFIG[3].knobs[0].label}
                  min={KNOB_CONFIG[3].knobs[0].min}
                  max={KNOB_CONFIG[3].knobs[0].max}
                  step={KNOB_CONFIG[3].knobs[0].step}
                  value={r1a}
                  onChange={handleR1aChange}
                />
                <Knob
                  label={KNOB_CONFIG[3].knobs[1].label}
                  min={KNOB_CONFIG[3].knobs[1].min}
                  max={KNOB_CONFIG[3].knobs[1].max}
                  step={KNOB_CONFIG[3].knobs[1].step}
                  value={r1b}
                  onChange={handleR1bChange}
                />
                <Knob
                  label={KNOB_CONFIG[3].knobs[2].label}
                  min={KNOB_CONFIG[3].knobs[2].min}
                  max={KNOB_CONFIG[3].knobs[2].max}
                  step={KNOB_CONFIG[3].knobs[2].step}
                  value={r1c}
                  onChange={handleR1cChange}
                />
                <Knob
                  label={KNOB_CONFIG[3].knobs[3].label}
                  min={KNOB_CONFIG[3].knobs[3].min}
                  max={KNOB_CONFIG[3].knobs[3].max}
                  step={KNOB_CONFIG[3].knobs[3].step}
                  value={r1d}
                  onChange={handleR1dChange}
                />
              </Box>
            </Paper>

            {/* Row 2 - BarChart */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <BarChart values={harmonics} height={200} title="Harmonics" />
            </Paper>

            {/* Row 3 - 3 Buttons */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mb: 1, fontWeight: 600 }}
              >
                Preset Management
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleSave}
                  fullWidth
                  size="large"
                >
                  SAVE
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleLoad}
                  fullWidth
                  size="large"
                >
                  LOAD
                </Button>

                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  fullWidth
                  size="large"
                >
                  GENERATE
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleListen}
                  fullWidth
                  size="large"
                >
                  LISTEN
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default SoundDesign;
