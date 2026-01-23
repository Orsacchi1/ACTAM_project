import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import Knob from "../components/Knob";
import KnobSpecial from "../components/KnobSpecial";
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
  // Section 0 - Controls 1-2 (aaa, aab)
  {
    title: "Oscillator 1",
    knobs: [
      {
        id: "aaa",
        label: "Detune",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "aab",
        label: "Volume",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
    ],
  },
  // Section 1 - Controls 3-4 (aba, abb)
  {
    title: "Oscillator 2",
    knobs: [
      {
        id: "aba",
        label: "Detune",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "abb",
        label: "Volume",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
    ],
  },
  // Section 2 - Controls 5-6 (aca, acb)
  {
    title: "Oscillator 3",
    knobs: [
      {
        id: "aca",
        label: "Detune",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "acb",
        label: "Volume",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
    ],
  },
  // Section 1 - Filters (baa, bab, bac)
  {
    title: "Filters",
    knobs: [
      {
        id: "baa",
        label: "Hi-Cut",
        min: 0,
        max: 22050,
        step: 1,
        default: 22050,
      },
      {
        id: "bab",
        label: "Lo-Cut",
        min: 0,
        max: 22050,
        step: 1,
        default: 0,
      },
      {
        id: "bac",
        label: "Resonance",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0,
      },
    ],
  },
  // Section 2 - Envelope (bba, bbb, bbc, bbd)
  {
    title: "Envelope",
    knobs: [
      {
        id: "bba",
        label: "Attack",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.1,
      },
      {
        id: "bbb",
        label: "Decay",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.2,
      },
      {
        id: "bbc",
        label: "Sustain",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "bbd",
        label: "Release",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.2,
      },
    ],
  },
  // Section 3 - Delay (caa, cab)
  {
    title: "Delay",
    knobs: [
      {
        id: "caa",
        label: "Time",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "cab",
        label: "Mix",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0,
      },
    ],
  },
  // Section 4 - Reverb (cba, cbb)
  {
    title: "Reverb",
    knobs: [
      {
        id: "cba",
        label: "Decay",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      {
        id: "cbb",
        label: "Mix",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0,
      },
    ],
  },
  // Section 5 - Gain (cca, ccb)
  {
    title: "Gain",
    knobs: [
      {
        id: "cca",
        label: "In",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.8,
      },
      {
        id: "ccb",
        label: "Out",
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.8,
      },
    ],
  },
];

function SoundDesign({ soundEngine = null }) {
  // Damping Type - single selection (linear, quadratic, exponential)
  const [dampingType, setDampingType] = useState("linear");

  // Spectral amplitude quality - single selection (random, cluster, none)
  const [spectralQuality, setSpectralQuality] = useState("none");

  // Oscillator 1 Enable State
  const [osc1Enabled, setOsc1Enabled] = useState(true);
  const [osc2Enabled, setOsc2Enabled] = useState(true);
  const [osc3Enabled, setOsc3Enabled] = useState(true);

  // Controls 1-2 (aaa, aab)
  const [aaa, setAaa] = useState(KNOB_CONFIG[0].knobs[0].default);
  const [aab, setAab] = useState(KNOB_CONFIG[0].knobs[1].default);

  // Controls 3-4 (aba, abb)
  const [aba, setAba] = useState(KNOB_CONFIG[1].knobs[0].default);
  const [abb, setAbb] = useState(KNOB_CONFIG[1].knobs[1].default);

  // Controls 5-6 (aca, acb)
  const [aca, setAca] = useState(KNOB_CONFIG[2].knobs[0].default);
  const [acb, setAcb] = useState(KNOB_CONFIG[2].knobs[1].default);

  // Filters (baa, bab, bac)
  const [baa, setBaa] = useState(KNOB_CONFIG[3].knobs[0].default);
  const [bab, setBab] = useState(KNOB_CONFIG[3].knobs[1].default);
  const [bac, setBac] = useState(KNOB_CONFIG[3].knobs[2].default);

  // Envelope (bba, bbb, bbc, bbd)
  const [bba, setBba] = useState(KNOB_CONFIG[4].knobs[0].default);
  const [bbb, setBbb] = useState(KNOB_CONFIG[4].knobs[1].default);
  const [bbc, setBbc] = useState(KNOB_CONFIG[4].knobs[2].default);
  const [bbd, setBbd] = useState(KNOB_CONFIG[4].knobs[3].default);

  // Delay (caa, cab)
  const [caa, setCaa] = useState(KNOB_CONFIG[5].knobs[0].default);
  const [cab, setCab] = useState(KNOB_CONFIG[5].knobs[1].default);

  // Reverb (cba, cbb)
  const [cba, setCba] = useState(KNOB_CONFIG[6].knobs[0].default);
  const [cbb, setCbb] = useState(KNOB_CONFIG[6].knobs[1].default);

  // Gain (cca, ccb)
  const [cca, setCca] = useState(KNOB_CONFIG[7].knobs[0].default);
  const [ccb, setCcb] = useState(KNOB_CONFIG[7].knobs[1].default);

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

  // Damping Type handler
  const handleDampingTypeChange = (event) => {
    const newType = event.target.value;
    setDampingType(newType);
    soundEngine.setDampingType(newType);
  };

  // Spectral amplitude quality handler
  const handleSpectralQualityChange = (event) => {
    const newQuality = event.target.value;
    setSpectralQuality(newQuality);
    soundEngine.setSpectralQuality(newQuality);
  };

  // New Knobs handlers (aaa, aab, aba, abb, aca, acb)
  const handleAaaChange = (value) => {
    setAaa(value);
    soundEngine.setOscDetune(1, value);
  };

  const handleAabChange = (value) => {
    setAab(value);
    soundEngine.setOscVolume(1, value);
  };

  const handleAbaChange = (value) => {
    setAba(value);
    soundEngine.setOscDetune(2, value);
  };

  const handleAbbChange = (value) => {
    setAbb(value);
    soundEngine.setOscVolume(2, value);
  };

  const handleAcaChange = (value) => {
    setAca(value);
    soundEngine.setOscDetune(3, value);
  };

  const handleAcbChange = (value) => {
    setAcb(value);
    soundEngine.setOscVolume(3, value);
  };

  // Filters handlers (baa, bab, bac)
  const handleBaaChange = (value) => {
    setBaa(value);
    return soundEngine?.setFiltersHiCut(value);
  };

  const handleBabChange = (value) => {
    setBab(value);
    return soundEngine?.setFiltersLoCut(value);
  };

  const handleBacChange = (value) => {
    setBac(value);
    soundEngine.setFiltersRes(value);
  };

  // Envelope handlers (bba, bbb, bbc, bbd)
  const handleBbaChange = (value) => {
    setBba(value);
    soundEngine.setEnvelopeAttack(value);
  };

  const handleBbbChange = (value) => {
    setBbb(value);
    soundEngine.setEnvelopeDecay(value);
  };

  const handleBbcChange = (value) => {
    setBbc(value);
    soundEngine.setEnvelopeSustain(value);
  };

  const handleBbdChange = (value) => {
    setBbd(value);
    soundEngine.setEnvelopeRelease(value);
  };

  // Delay handlers (caa, cab)
  const handleCaaChange = (value) => {
    setCaa(value);
    soundEngine.setDelayTime(value);
  };

  const handleCabChange = (value) => {
    setCab(value);
    soundEngine.setDelayMix(value);
  };

  // Reverb handlers (cba, cbb)
  const handleCbaChange = (value) => {
    setCba(value);
    soundEngine.setReverbDecay(value);
  };

  const handleCbbChange = (value) => {
    setCbb(value);
    soundEngine.setReverbMix(value);
  };

  // Gain handlers (cca, ccb)
  const handleCcaChange = (value) => {
    setCca(value);
    soundEngine.setGainIn(value);
  };

  const handleCcbChange = (value) => {
    setCcb(value);
    soundEngine.setGainOut(value);
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
      {/* Main Layout: 4 Rows */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Row 1 - Damping Type and Spectral */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Damping Type */}
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
                Damping Type
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <RadioGroup
                  row
                  value={dampingType}
                  onChange={handleDampingTypeChange}
                >
                  <FormControlLabel
                    value="linear"
                    control={<Radio />}
                    label="Linear"
                  />
                  <FormControlLabel
                    value="quadratic"
                    control={<Radio />}
                    label="Quadratic"
                  />
                  <FormControlLabel
                    value="exponential"
                    control={<Radio />}
                    label="Exponential"
                  />
                </RadioGroup>
              </Box>
            </Paper>

            {/* Spectral amplitude quality */}
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
                Spectral amplitude quality
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <RadioGroup
                  row
                  value={spectralQuality}
                  onChange={handleSpectralQualityChange}
                >
                  <FormControlLabel
                    value="random"
                    control={<Radio />}
                    label="Random filtering"
                  />
                  <FormControlLabel
                    value="cluster"
                    control={<Radio />}
                    label="Cluster harmonics"
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio />}
                    label="None"
                  />
                </RadioGroup>
              </Box>
            </Paper>
          </Box>

          {/* Row 2 - Additional Controls (3 Boxes with 2 Knobs each) */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* First Box - Knobs 1 & 2 */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: osc1Enabled ? "grey.50" : "action.disabledBackground",
                border: "1px solid",
                borderColor: "grey.200",
                flex: 1,
                opacity: osc1Enabled ? 1 : 0.6,
                transition: "all 0.2s ease",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Checkbox
                  checked={osc1Enabled}
                  onChange={(e) => {
                    setOsc1Enabled(e.target.checked);
                    if (soundEngine)
                      soundEngine.setOscActive(1, e.target.checked);
                  }}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {KNOB_CONFIG[0].title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Knob
                  label={KNOB_CONFIG[0].knobs[0].label}
                  min={KNOB_CONFIG[0].knobs[0].min}
                  max={KNOB_CONFIG[0].knobs[0].max}
                  step={KNOB_CONFIG[0].knobs[0].step}
                  value={aaa}
                  onChange={handleAaaChange}
                  disabled={!osc1Enabled}
                />
                <Knob
                  label={KNOB_CONFIG[0].knobs[1].label}
                  min={KNOB_CONFIG[0].knobs[1].min}
                  max={KNOB_CONFIG[0].knobs[1].max}
                  step={KNOB_CONFIG[0].knobs[1].step}
                  value={aab}
                  onChange={handleAabChange}
                  disabled={!osc1Enabled}
                />
              </Box>
            </Paper>

            {/* Second Box - Knobs 3 & 4 */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: osc2Enabled ? "grey.50" : "action.disabledBackground",
                border: "1px solid",
                borderColor: "grey.200",
                flex: 1,
                opacity: osc2Enabled ? 1 : 0.6,
                transition: "all 0.2s ease",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Checkbox
                  checked={osc2Enabled}
                  onChange={(e) => {
                    setOsc2Enabled(e.target.checked);
                    if (soundEngine)
                      soundEngine.setOscActive(2, e.target.checked);
                  }}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {KNOB_CONFIG[1].title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Knob
                  label={KNOB_CONFIG[1].knobs[0].label}
                  min={KNOB_CONFIG[1].knobs[0].min}
                  max={KNOB_CONFIG[1].knobs[0].max}
                  step={KNOB_CONFIG[1].knobs[0].step}
                  value={aba}
                  onChange={handleAbaChange}
                  disabled={!osc2Enabled}
                />
                <Knob
                  label={KNOB_CONFIG[1].knobs[1].label}
                  min={KNOB_CONFIG[1].knobs[1].min}
                  max={KNOB_CONFIG[1].knobs[1].max}
                  step={KNOB_CONFIG[1].knobs[1].step}
                  value={abb}
                  onChange={handleAbbChange}
                  disabled={!osc2Enabled}
                />
              </Box>
            </Paper>

            {/* Third Box - Knobs 5 & 6 */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: osc3Enabled ? "grey.50" : "action.disabledBackground",
                border: "1px solid",
                borderColor: "grey.200",
                flex: 1,
                opacity: osc3Enabled ? 1 : 0.6,
                transition: "all 0.2s ease",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Checkbox
                  checked={osc3Enabled}
                  onChange={(e) => {
                    setOsc3Enabled(e.target.checked);
                    if (soundEngine)
                      soundEngine.setOscActive(3, e.target.checked);
                  }}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {KNOB_CONFIG[2].title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Knob
                  label={KNOB_CONFIG[2].knobs[0].label}
                  min={KNOB_CONFIG[2].knobs[0].min}
                  max={KNOB_CONFIG[2].knobs[0].max}
                  step={KNOB_CONFIG[2].knobs[0].step}
                  value={aca}
                  onChange={handleAcaChange}
                  disabled={!osc3Enabled}
                />
                <Knob
                  label={KNOB_CONFIG[2].knobs[1].label}
                  min={KNOB_CONFIG[2].knobs[1].min}
                  max={KNOB_CONFIG[2].knobs[1].max}
                  step={KNOB_CONFIG[2].knobs[1].step}
                  value={acb}
                  onChange={handleAcbChange}
                  disabled={!osc3Enabled}
                />
              </Box>
            </Paper>
          </Box>

          {/* Row 3 - Filters and Envelope */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Filters */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
                flex: 0.65,
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mb: 1, fontWeight: 600 }}
              >
                {KNOB_CONFIG[3].title}
              </Typography>
              <Box sx={{ display: "flex", gap: 4, justifyContent: "center" }}>
                <KnobSpecial
                  label={KNOB_CONFIG[3].knobs[0].label}
                  min={KNOB_CONFIG[3].knobs[0].min}
                  max={KNOB_CONFIG[3].knobs[0].max}
                  step={KNOB_CONFIG[3].knobs[0].step}
                  value={baa}
                  onChange={handleBaaChange}
                />
                <KnobSpecial
                  label={KNOB_CONFIG[3].knobs[1].label}
                  min={KNOB_CONFIG[3].knobs[1].min}
                  max={KNOB_CONFIG[3].knobs[1].max}
                  step={KNOB_CONFIG[3].knobs[1].step}
                  value={bab}
                  onChange={handleBabChange}
                />
                <Knob
                  label={KNOB_CONFIG[3].knobs[2].label}
                  min={KNOB_CONFIG[3].knobs[2].min}
                  max={KNOB_CONFIG[3].knobs[2].max}
                  step={KNOB_CONFIG[3].knobs[2].step}
                  value={bac}
                  onChange={handleBacChange}
                />
              </Box>
            </Paper>

            {/* Envelope */}
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
                {KNOB_CONFIG[4].title}
              </Typography>
              <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
                <Knob
                  label={KNOB_CONFIG[4].knobs[0].label}
                  min={KNOB_CONFIG[4].knobs[0].min}
                  max={KNOB_CONFIG[4].knobs[0].max}
                  step={KNOB_CONFIG[4].knobs[0].step}
                  value={bba}
                  onChange={handleBbaChange}
                />
                <Knob
                  label={KNOB_CONFIG[4].knobs[1].label}
                  min={KNOB_CONFIG[4].knobs[1].min}
                  max={KNOB_CONFIG[4].knobs[1].max}
                  step={KNOB_CONFIG[4].knobs[1].step}
                  value={bbb}
                  onChange={handleBbbChange}
                />
                <Knob
                  label={KNOB_CONFIG[4].knobs[2].label}
                  min={KNOB_CONFIG[4].knobs[2].min}
                  max={KNOB_CONFIG[4].knobs[2].max}
                  step={KNOB_CONFIG[4].knobs[2].step}
                  value={bbc}
                  onChange={handleBbcChange}
                />
                <Knob
                  label={KNOB_CONFIG[4].knobs[3].label}
                  min={KNOB_CONFIG[4].knobs[3].min}
                  max={KNOB_CONFIG[4].knobs[3].max}
                  step={KNOB_CONFIG[4].knobs[3].step}
                  value={bbd}
                  onChange={handleBbdChange}
                />
              </Box>
            </Paper>
          </Box>

          {/* Row 4 - Delay, Reverb, Gain, SpectrumCurve, and Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Left Section - Delay, Reverb, Gain */}
            <Box sx={{ display: "flex", gap: 2, flex: 0.4 }}>
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
                  {KNOB_CONFIG[5].title}
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
                    label={KNOB_CONFIG[5].knobs[0].label}
                    min={KNOB_CONFIG[5].knobs[0].min}
                    max={KNOB_CONFIG[5].knobs[0].max}
                    step={KNOB_CONFIG[5].knobs[0].step}
                    value={caa}
                    onChange={handleCaaChange}
                  />
                  <Knob
                    label={KNOB_CONFIG[5].knobs[1].label}
                    min={KNOB_CONFIG[5].knobs[1].min}
                    max={KNOB_CONFIG[5].knobs[1].max}
                    step={KNOB_CONFIG[5].knobs[1].step}
                    value={cab}
                    onChange={handleCabChange}
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
                  {KNOB_CONFIG[6].title}
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
                    label={KNOB_CONFIG[6].knobs[0].label}
                    min={KNOB_CONFIG[6].knobs[0].min}
                    max={KNOB_CONFIG[6].knobs[0].max}
                    step={KNOB_CONFIG[6].knobs[0].step}
                    value={cba}
                    onChange={handleCbaChange}
                  />
                  <Knob
                    label={KNOB_CONFIG[6].knobs[1].label}
                    min={KNOB_CONFIG[6].knobs[1].min}
                    max={KNOB_CONFIG[6].knobs[1].max}
                    step={KNOB_CONFIG[6].knobs[1].step}
                    value={cbb}
                    onChange={handleCbbChange}
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
                  flex: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {KNOB_CONFIG[7].title}
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
                    label={KNOB_CONFIG[7].knobs[0].label}
                    min={KNOB_CONFIG[7].knobs[0].min}
                    max={KNOB_CONFIG[7].knobs[0].max}
                    step={KNOB_CONFIG[7].knobs[0].step}
                    value={cca}
                    onChange={handleCcaChange}
                  />
                  <Knob
                    label={KNOB_CONFIG[7].knobs[1].label}
                    min={KNOB_CONFIG[7].knobs[1].min}
                    max={KNOB_CONFIG[7].knobs[1].max}
                    step={KNOB_CONFIG[7].knobs[1].step}
                    value={ccb}
                    onChange={handleCcbChange}
                  />
                </Box>
              </Paper>
            </Box>

            {/* Right Section - SpectrumCurve and Buttons */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* SpectrumCurve */}
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
                    height={132}
                    lineColor="#9c27b0"
                    lineWidth={2}
                    fillColor="rgba(156, 39, 176, 0.1)"
                  />
                </Box>
              </Paper>

              {/* Buttons */}
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
        </Box>
      </Paper>
    </Container>
  );
}

export default SoundDesign;
