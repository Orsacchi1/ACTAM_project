import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  Chip,
  Box,
  Typography,
  Divider,
} from "@mui/material";

// Root notes - 12 semitones (using sharps for black keys)
const ROOT_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// Chord qualities
const CHORD_QUALITIES = [
  { id: "major", label: "Major", suffix: "" },
  { id: "minor", label: "Minor", suffix: "m" },
  { id: "seventh", label: "Dominant 7th", suffix: "7" },
  { id: "majorSeventh", label: "Major 7th", suffix: "maj7" },
  { id: "minorSeventh", label: "Minor 7th", suffix: "m7" },
  { id: "diminished", label: "Diminished", suffix: "dim" },
  { id: "augmented", label: "Augmented", suffix: "aug" },
  { id: "sus2", label: "Suspended 2nd", suffix: "sus2" },
  { id: "sus4", label: "Suspended 4th", suffix: "sus4" },
];

function ChordSelector({
  open,
  onClose,
  onSelect,
  beatIndex,
  half,
  currentChord,
}) {
  const [selectedRoot, setSelectedRoot] = useState(null);

  const handleRootSelect = (root) => {
    setSelectedRoot(root);
  };

  const handleQualitySelect = (quality) => {
    if (selectedRoot) {
      const chordName = selectedRoot + quality.suffix;
      onSelect(beatIndex, half, chordName);
      setSelectedRoot(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedRoot(null);
    onClose();
  };

  const handleClearChord = () => {
    onSelect(beatIndex, half, null);
    setSelectedRoot(null);
    onClose();
  };

  const halfLabel = half === "first" ? "1st half" : "2nd half";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Select Chord - Measure {Math.floor(beatIndex / 4) + 1}, Beat{" "}
        {(beatIndex % 4) + 1} ({halfLabel})
        {currentChord && (
          <Chip
            label={`Current: ${currentChord}`}
            color={half === "first" ? "primary" : "secondary"}
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearChord}
            fullWidth
          >
            Clear Chord
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Step 1: Select root note */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            {selectedRoot
              ? `✓ Selected: ${selectedRoot}`
              : "1. Select Root Note (12 Semitones)"}
          </Typography>
          <Grid container spacing={1}>
            {ROOT_NOTES.map((note) => (
              <Grid item xs={2} key={note}>
                <Button
                  variant={selectedRoot === note ? "contained" : "outlined"}
                  onClick={() => handleRootSelect(note)}
                  fullWidth
                  size="small"
                  sx={{
                    minWidth: 0,
                    fontSize: "0.7rem",
                    py: 1,
                    textTransform: "none",
                  }}
                >
                  {note}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Step 2: Select chord quality */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            2. Select Chord Quality
            {!selectedRoot && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                (Select root note first)
              </Typography>
            )}
          </Typography>
          <Grid container spacing={1}>
            {CHORD_QUALITIES.map((quality) => (
              <Grid item xs={6} key={quality.id}>
                <Button
                  variant="outlined"
                  onClick={() => handleQualitySelect(quality)}
                  disabled={!selectedRoot}
                  fullWidth
                  size="large"
                  sx={{
                    justifyContent: "space-between",
                    textAlign: "left",
                    textTransform: "none",
                  }}
                >
                  <span>{quality.label}</span>
                  <Chip
                    label={
                      selectedRoot
                        ? selectedRoot + quality.suffix
                        : quality.suffix
                    }
                    size="small"
                    sx={{
                      ml: 1,
                      "& .MuiChip-label": {
                        textTransform: "none",
                      },
                    }}
                  />
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ChordSelector;
