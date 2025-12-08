import { useEffect, useRef } from "react";
import { Paper } from "@mui/material";

/**
 * SpectrumCurve - Displays a 128-value array as a smooth curve
 *
 * @param {Object} props
 * @param {Float32Array|Array} props.data - Array of 128 values (0-1 range recommended)
 * @param {number} props.width - Width of the canvas (default: 600)
 * @param {number} props.height - Height of the canvas (default: 200)
 * @param {string} props.lineColor - Color of the curve line (default: "#9c27b0")
 * @param {number} props.lineWidth - Width of the curve line (default: 2)
 * @param {string} props.fillColor - Fill color under the curve (default: "rgba(156, 39, 176, 0.1)")
 */
function SpectrumCurve({
  data = new Float32Array(128),
  width = 600,
  height = 200,
  lineColor = "#9c27b0",
  lineWidth = 2,
  fillColor = "rgba(156, 39, 176, 0.1)",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size accounting for device pixel ratio
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Ensure we have valid data
    if (!data || data.length === 0) return;

    const dataLength = Math.min(data.length, 128);
    const xStep = width / (dataLength - 1);

    // Find max value for normalization
    let maxValue = 0;
    for (let i = 0; i < dataLength; i++) {
      const absValue = Math.abs(data[i]);
      if (absValue > maxValue) maxValue = absValue;
    }

    // Avoid division by zero
    if (maxValue === 0) maxValue = 1;

    // Start drawing the curve
    ctx.beginPath();
    ctx.moveTo(0, height);

    // Draw smooth curve using quadratic curves
    for (let i = 0; i < dataLength; i++) {
      const x = i * xStep;
      // Normalize value to canvas height (invert Y axis)
      const normalizedValue = Math.abs(data[i]) / maxValue;
      const y = height - normalizedValue * height * 0.9; // Use 90% of height for padding

      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        // Calculate control point for smooth curve
        const prevX = (i - 1) * xStep;
        const prevNormalizedValue = Math.abs(data[i - 1]) / maxValue;
        const prevY = height - prevNormalizedValue * height * 0.9;

        const controlX = (prevX + x) / 2;
        const controlY = (prevY + y) / 2;

        ctx.quadraticCurveTo(prevX, prevY, controlX, controlY);
      }
    }

    // Complete the last point
    const lastX = (dataLength - 1) * xStep;
    const lastNormalizedValue = Math.abs(data[dataLength - 1]) / maxValue;
    const lastY = height - lastNormalizedValue * height * 0.9;
    ctx.lineTo(lastX, lastY);

    // Close path to bottom right and bottom left for fill
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    // Fill the area under the curve
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Draw the curve line
    ctx.beginPath();
    ctx.moveTo(0, height - (Math.abs(data[0]) / maxValue) * height * 0.9);

    for (let i = 1; i < dataLength; i++) {
      const x = i * xStep;
      const normalizedValue = Math.abs(data[i]) / maxValue;
      const y = height - normalizedValue * height * 0.9;

      if (i === 1) {
        ctx.lineTo(x, y);
      } else {
        const prevX = (i - 1) * xStep;
        const prevNormalizedValue = Math.abs(data[i - 1]) / maxValue;
        const prevY = height - prevNormalizedValue * height * 0.9;

        const controlX = (prevX + x) / 2;
        const controlY = (prevY + y) / 2;

        ctx.quadraticCurveTo(prevX, prevY, controlX, controlY);
      }
    }

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  }, [data, width, height, lineColor, lineWidth, fillColor]);

  return (
    <Paper elevation={2} sx={{ p: 2, display: "inline-block" }}>
      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: "block",
        }}
      />
    </Paper>
  );
}

export default SpectrumCurve;
