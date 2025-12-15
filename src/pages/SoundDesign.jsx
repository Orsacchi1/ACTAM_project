import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { useState } from "react";
import Knob from "../components/Knob";
import SpectrumCurve from "../components/SpectrumCurve";
import EngineInterface from "../services/EngineInterface";

/**
 * SOUND DESIGN PAGE - Configuration & Usage Guide
 *
 * === CONFIGURATION ===
 * KNOB_CONFIG: Configuration array defining all knob parameters (label, min, max, step, default)
 * - Modify knob labels, ranges, etc. by editing this configuration only
 *
 * === STATE VARIABLES (Current knob values) ===
 * Filters (Row 1, horizontal): l1a, l1b, l1c (Hi-Cut, Lo-Cut, Res)
 * Delay (Row 2, vertical): l2a, l2b (Time, Mix)
 * Reverb (Row 2, vertical): l3a, l3b (Decay, Mix)
 * Gain (Row 2, vertical): l4a, l4b (In, Out)
 * Envelope (Right, horizontal): r1a, r1b, r1c, r1d (Attack, Decay, Sustain, Release)
 * Partitions: harmonics (128-value Float32Array)
 *
 * === HANDLER FUNCTIONS ===
 * handleL1aChange, handleL1bChange, handleL1cChange (Filters)
 * handleL2aChange, handleL2bChange (Delay)
 * handleL3aChange, handleL3bChange (Reverb)
 * handleL4aChange, handleL4bChange (Gain)
 * handleR1aChange, handleR1bChange, handleR1cChange, handleR1dChange (Envelope)
 * - Each function contains audio engine update logic
 *
 * === BUTTON FUNCTIONS ===
 * handleGenerate(): Randomly generates harmonics
 * handleSave(): Save all current parameters (TODO)
 * handleLoad(): Load saved parameters (TODO)
 */

// Knob configuration dictionary
const KNOB_CONFIG = [
  // Section 0 - Filters (l1a, l1b, l1c)
  {
    title: "Filters",
    knobs: [
      {
        id: "l1a",
        label: "Hi-Cut",
        min: 0,
        max: 22050,
        step: 1,
        default: 5000,
      },
      {
        id: "l1b",
        label: "Lo-Cut",
        min: 0,
        max: 22050,
        step: 1,
        default: 5000,
      },
      {
        id: "l1c",
        label: "Resonance",
        min: 0,
        max:  1,
        step: 0.01,
        default: 0.5,
      },
    ],
  },
  // Section 1 - Delay (l2a, l2b)
  {
    title: "Delay",
    knobs: [
      {
        id: "l2a",
        label: "Time",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "l2b",
        label: "Mix",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
    ],
  },
  // Section 2 - Reverb (l3a, l3b)
  {
    title: "Reverb",
    knobs: [
      {
        id: "l3a",
        label: "Decay",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "l3b",
        label: "Mix",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
    ],
  },
  // Section 3 - Gain (l4a, l4b)
  {
    title: "Gain",
    knobs: [
      {
        id: "l4a",
        label: "In",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "l4b",
        label: "Out",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
    ],
  },
  // Section 4 - Envelope (r1a, r1b, r1c, r1d)
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
  // Filters (l1a, l1b, l1c)
  const [l1a, setL1a] = useState(KNOB_CONFIG[0].knobs[0].default);
  const [l1b, setL1b] = useState(KNOB_CONFIG[0].knobs[1].default);
  const [l1c, setL1c] = useState(KNOB_CONFIG[0].knobs[2].default);

  // Delay (l2a, l2b)
  const [l2a, setL2a] = useState(KNOB_CONFIG[1].knobs[0].default);
  const [l2b, setL2b] = useState(KNOB_CONFIG[1].knobs[1].default);

  // Reverb (l3a, l3b)
  const [l3a, setL3a] = useState(KNOB_CONFIG[2].knobs[0].default);
  const [l3b, setL3b] = useState(KNOB_CONFIG[2].knobs[1].default);

  // Gain (l4a, l4b)
  const [l4a, setL4a] = useState(KNOB_CONFIG[3].knobs[0].default);
  const [l4b, setL4b] = useState(KNOB_CONFIG[3].knobs[1].default);

  // Envelope (r1a, r1b, r1c, r1d)
  const [r1a, setR1a] = useState(KNOB_CONFIG[4].knobs[0].default);
  const [r1b, setR1b] = useState(KNOB_CONFIG[4].knobs[1].default);
  const [r1c, setR1c] = useState(KNOB_CONFIG[4].knobs[2].default);
  const [r1d, setR1d] = useState(KNOB_CONFIG[4].knobs[3].default);

  // Wavetable (WT) - 128 harmonics
  const [harmonics, setHarmonics] = useState(() => {
    const data = new Float32Array(128);
    for (let i = 0; i < 128; i++) {
      data[i] = Math.random();
    }
    return data;
  });

  // Handler functions for knobs
  // IMPORTANT: Use the 'value' parameter (not the state variable) for audio engine updates
  // to ensure you're using the latest value, as React state updates are asynchronous
  
  // Filters handlers (l1a, l1b, l1c)
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

  // Delay handlers (l2a, l2b)
  const handleL2aChange = (value) => {
    setL2a(value);
    // TODO: Add audio engine update logic here using 'value' parameter
  };

  const handleL2bChange = (value) => {
    setL2b(value);
    // TODO: Add audio engine update logic here using 'value' parameter
  };

  // Reverb handlers (l3a, l3b)
  const handleL3aChange = (value) => {
    setL3a(value);
    soundEngine.setReverbDecay(value);
  };

  const handleL3bChange = (value) => {
    setL3b(value);
    soundEngine.setReverbAmount(value);
  };

  // Gain handlers (l4a, l4b)
  const handleL4aChange = (value) => {
    setL4a(value);
    // TODO: Add GainIn logic here
  };

  const handleL4bChange = (value) => {
    setL4b(value);
    // TODO: Add GainOut logic here
  };

  // Envelope handlers (r1a, r1b, r1c, r1d)
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

            {/* Row 2 - Delay, Reverb and Gain combined horizontally */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Delay */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200",
                  flex: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {KNOB_CONFIG[1].title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
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
                </Box>
              </Paper>

              {/* Reverb */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200",
                  flex: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {KNOB_CONFIG[2].title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
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
                </Box>
              </Paper>

              {/* Gain */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "grey.200",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {KNOB_CONFIG[3].title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Knob
                    label={KNOB_CONFIG[3].knobs[0].label}
                    min={KNOB_CONFIG[3].knobs[0].min}
                    max={KNOB_CONFIG[3].knobs[0].max}
                    step={KNOB_CONFIG[3].knobs[0].step}
                    value={l4a}
                    onChange={handleL4aChange}
                  />
                  <Knob
                    label={KNOB_CONFIG[3].knobs[1].label}
                    min={KNOB_CONFIG[3].knobs[1].min}
                    max={KNOB_CONFIG[3].knobs[1].max}
                    step={KNOB_CONFIG[3].knobs[1].step}
                    value={l4b}
                    onChange={handleL4bChange}
                  />
                </Box>
              </Paper>
            </Box>
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
                {KNOB_CONFIG[4].title}
              </Typography>
              <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
                <Knob
                  label={KNOB_CONFIG[4].knobs[0].label}
                  min={KNOB_CONFIG[4].knobs[0].min}
                  max={KNOB_CONFIG[4].knobs[0].max}
                  step={KNOB_CONFIG[4].knobs[0].step}
                  value={r1a}
                  onChange={handleR1aChange}
                />
                <Knob
                  label={KNOB_CONFIG[4].knobs[1].label}
                  min={KNOB_CONFIG[4].knobs[1].min}
                  max={KNOB_CONFIG[4].knobs[1].max}
                  step={KNOB_CONFIG[4].knobs[1].step}
                  value={r1b}
                  onChange={handleR1bChange}
                />
                <Knob
                  label={KNOB_CONFIG[4].knobs[2].label}
                  min={KNOB_CONFIG[4].knobs[2].min}
                  max={KNOB_CONFIG[4].knobs[2].max}
                  step={KNOB_CONFIG[4].knobs[2].step}
                  value={r1c}
                  onChange={handleR1cChange}
                />
                <Knob
                  label={KNOB_CONFIG[4].knobs[3].label}
                  min={KNOB_CONFIG[4].knobs[3].min}
                  max={KNOB_CONFIG[4].knobs[3].max}
                  step={KNOB_CONFIG[4].knobs[3].step}
                  value={r1d}
                  onChange={handleR1dChange}
                />
              </Box>
            </Paper>

            {/* Row 2 - SpectrumCurve */}
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
                sx={{ mb: 2, fontWeight: 600 }}
              >
                Partitions
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <SpectrumCurve
                  data={harmonics}
                  width={600}
                  height={200}
                  lineColor="#9c27b0"
                  lineWidth={2}
                  fillColor="rgba(156, 39, 176, 0.1)"
                />
              </Box>
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
