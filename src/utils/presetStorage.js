/**
 * Utility functions for saving and loading sound design presets
 */

/**
 * Export sound design preset to a JSON file
 * @param {Object} data - The sound design preset data
 * @param {string} filename - The filename (without extension)
 */
export const exportPreset = (data, filename = "sound-preset") => {
  // Create the data structure with metadata
  const exportData = {
    version: "1.0",
    name: filename,
    createdAt: new Date().toISOString(),
    preset: {
      // Oscillator
      oscillator: {
        detune: data.aaa,
        volume: data.aab,
      },
      // Filters
      filters: {
        hiCut: data.baa,
        loCut: data.bab,
        resonance: data.bac,
        hiCutDisplay: data.baaDisplay,
        loCutDisplay: data.babDisplay,
      },
      // Envelope
      envelope: {
        attack: data.bba,
        decay: data.bbb,
        sustain: data.bbc,
        release: data.bbd,
      },
      // Delay
      delay: {
        time: data.caa,
        mix: data.cab,
      },
      // Reverb
      reverb: {
        decay: data.cba,
        mix: data.cbb,
      },
      // Gain
      gain: {
        input: data.cca,
        output: data.ccb,
      },
      // Harmonics (wavetable)
      harmonics: Array.from(data.harmonics),
      // Settings
      dampingType: data.dampingType,
      spectralQuality: data.spectralQuality,
    },
  };

  // Convert to JSON string with pretty formatting
  const jsonString = JSON.stringify(exportData, null, 2);

  // Create a blob from the JSON string
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.json`;

  // Trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import sound design preset from a JSON file
 * @param {File} file - The file object from input
 * @returns {Promise<Object>} The parsed preset data
 */
export const importPreset = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.name.endsWith(".json")) {
      reject(new Error("Invalid file type. Please select a JSON file."));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        // Validate data structure
        if (!jsonData.preset) {
          reject(new Error("Invalid file format: missing preset object."));
          return;
        }

        const preset = jsonData.preset;

        // Validate harmonics
        if (
          !Array.isArray(preset.harmonics) ||
          preset.harmonics.length !== 128
        ) {
          reject(
            new Error(
              "Invalid data: harmonics must be an array of 128 values.",
            ),
          );
          return;
        }

        // Return the validated data
        resolve({
          // Oscillator
          aaa: preset.oscillator?.detune ?? 0.5,
          aab: preset.oscillator?.volume ?? 0.5,
          // Filters
          baa: preset.filters?.hiCut ?? 22050,
          bab: preset.filters?.loCut ?? 0,
          bac: preset.filters?.resonance ?? 0,
          baaDisplay: preset.filters?.hiCutDisplay ?? 22050,
          babDisplay: preset.filters?.loCutDisplay ?? 0,
          // Envelope
          bba: preset.envelope?.attack ?? 0.1,
          bbb: preset.envelope?.decay ?? 0.2,
          bbc: preset.envelope?.sustain ?? 0.5,
          bbd: preset.envelope?.release ?? 0.2,
          // Delay
          caa: preset.delay?.time ?? 0.5,
          cab: preset.delay?.mix ?? 0,
          // Reverb
          cba: preset.reverb?.decay ?? 0.5,
          cbb: preset.reverb?.mix ?? 0,
          // Gain
          cca: preset.gain?.input ?? 0.8,
          ccb: preset.gain?.output ?? 0.8,
          // Harmonics
          harmonics: new Float32Array(preset.harmonics),
          // Settings
          dampingType: preset.dampingType || "linear",
          spectralQuality: preset.spectralQuality || "none",
          // Metadata
          metadata: {
            name: jsonData.name,
            createdAt: jsonData.createdAt,
            version: jsonData.version,
          },
        });
      } catch (error) {
        reject(new Error(`Failed to parse file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file."));
    };

    reader.readAsText(file);
  });
};

