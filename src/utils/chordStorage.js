/**
 * Utility functions for saving and loading chord progressions
 */

/**
 * Export chord progression data to a JSON file
 * @param {Object} data - The chord progression data
 * @param {string} filename - The filename (without extension)
 */
export const exportToFile = (data, filename = "chord-progression") => {
  // Create the data structure with metadata
  const exportData = {
    version: "1.0",
    name: filename,
    createdAt: new Date().toISOString(),
    data: {
      measures: data.measures,
      beatChords: data.beatChords,
      beatVelocities: data.beatVelocities,
      bpm: data.bpm,
      beatsPerMeasure: data.beatsPerMeasure || 4,
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
 * Import chord progression data from a JSON file
 * @param {File} file - The file object from input
 * @returns {Promise<Object>} The parsed chord progression data
 */
export const importFromFile = (file) => {
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
        if (!jsonData.data) {
          reject(new Error("Invalid file format: missing data object."));
          return;
        }

        const { measures, beatChords, beatVelocities, bpm, beatsPerMeasure } =
          jsonData.data;

        // Basic validation
        if (!Array.isArray(measures)) {
          reject(new Error("Invalid data: measures must be an array."));
          return;
        }

        if (typeof bpm !== "number" || bpm < 30 || bpm > 300) {
          reject(new Error("Invalid data: BPM must be between 30 and 300."));
          return;
        }

        // Return the validated data
        resolve({
          measures: measures || [4, 4, 4, 4],
          beatChords: beatChords || {},
          beatVelocities: beatVelocities || {},
          bpm: bpm || 120,
          beatsPerMeasure: beatsPerMeasure || 4,
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

/**
 * Validate chord progression data
 * @param {Object} data - The data to validate
 * @returns {boolean} Whether the data is valid
 */
export const validateChordData = (data) => {
  if (!data || typeof data !== "object") return false;
  if (!Array.isArray(data.measures)) return false;
  if (typeof data.bpm !== "number") return false;
  return true;
};
