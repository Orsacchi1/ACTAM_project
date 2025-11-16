import { Box, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

function Knob({ min = 0, max = 100, value = 50, onChange, label = "" }) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const knobRef = useRef(null);
  const dragStartY = useRef(0);
  const dragStartValue = useRef(0);

  // Calculate rotation angle based on value (from -135deg to 135deg, total 270deg range)
  const valueToAngle = (val) => {
    const normalizedValue = (val - min) / (max - min); // 0 to 1
    return -135 + normalizedValue * 270; // -135deg to 135deg
  };

  const angle = valueToAngle(currentValue);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartValue.current = currentValue;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaY = dragStartY.current - e.clientY; // Inverted: move up increases value
      const sensitivity = 0.5; // Adjust sensitivity
      const valueRange = max - min;
      const deltaValue = (deltaY * sensitivity * valueRange) / 100;

      let newValue = dragStartValue.current + deltaValue;
      newValue = Math.max(min, Math.min(max, newValue)); // Clamp between min and max

      setCurrentValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, min, max, onChange]);

  // Update current value when prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        userSelect: "none",
      }}
    >
      {/* Label */}
      {label && (
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", mb: 1, fontSize: "1rem" }}
        >
          {label}
        </Typography>
      )}

      {/* Knob Container */}
      <Box
        sx={{
          position: "relative",
          width: 140,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Min Label - Bottom Left */}
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            bottom: 5,
            left: 5,
            color: "text.secondary",
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}
        >
          {min}
        </Typography>

        {/* Max Label - Bottom Right */}
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            bottom: 5,
            right: 5,
            color: "text.secondary",
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}
        >
          {max}
        </Typography>

        {/* Knob Body */}
        <Box
          ref={knobRef}
          onMouseDown={handleMouseDown}
          sx={{
            position: "relative",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: isDragging
              ? "0 0 20px rgba(102, 126, 234, 0.6)"
              : "0 4px 10px rgba(0, 0, 0, 0.3)",
            cursor: isDragging ? "grabbing" : "grab",
            transition: isDragging ? "none" : "box-shadow 0.2s ease",
            transform: `rotate(${angle}deg)`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 4,
              height: "30%",
              backgroundColor: "#fff",
              borderRadius: 2,
            },
          }}
        >
          {/* Center Circle */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: "#333",
              pointerEvents: "none",
            }}
          />
        </Box>
      </Box>

      {/* Current Value Display */}
      <Box
        sx={{
          mt: 0.5,
          px: 1.5,
          py: 0.5,
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 1,
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            fontSize: "0.875rem",
          }}
        >
          {currentValue.toFixed(1)}
        </Typography>
      </Box>
    </Box>
  );
}

export default Knob;
