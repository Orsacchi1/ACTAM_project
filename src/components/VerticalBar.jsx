import { Box, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

function VerticalBar({
  min = 0,
  max = 100,
  value = 50,
  onChange,
  label = "",
  height = 200,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const barRef = useRef(null);

  // Calculate bar fill percentage
  const fillPercentage = ((currentValue - min) / (max - min)) * 100;

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateValueFromMouse(e);
  };

  const updateValueFromMouse = (e) => {
    if (!barRef.current) return;

    const rect = barRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = 1 - y / rect.height; // Inverted: bottom = 0%, top = 100%
    
    let newValue = min + percentage * (max - min);
    newValue = Math.max(min, Math.min(max, newValue)); // Clamp

    setCurrentValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Add event listeners
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!barRef.current) return;

      const rect = barRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const percentage = 1 - y / rect.height;
      
      let newValue = min + percentage * (max - min);
      newValue = Math.max(min, Math.min(max, newValue));

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
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, min, max, onChange]);

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
          variant="body2"
          sx={{ fontWeight: "bold", mb: 0.5, fontSize: "0.875rem" }}
        >
          {label}
        </Typography>
      )}

      {/* Bar Container */}
      <Box
        ref={barRef}
        onMouseDown={handleMouseDown}
        sx={{
          width: 40,
          height: height,
          backgroundColor: "#e0e0e0",
          borderRadius: 1,
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
      >
        {/* Fill */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${fillPercentage}%`,
            background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
            transition: isDragging ? "none" : "height 0.1s ease",
          }}
        />

        {/* Value Indicator Line */}
        <Box
          sx={{
            position: "absolute",
            bottom: `${fillPercentage}%`,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />
      </Box>

      {/* Value Display */}
      <Box
        sx={{
          mt: 0.5,
          px: 1,
          py: 0.3,
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 0.5,
          backgroundColor: "background.paper",
          minWidth: "45px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            fontSize: "0.7rem",
          }}
        >
          {currentValue.toFixed(1)}
        </Typography>
      </Box>

      {/* Min/Max Labels */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary" }}>
          Max: {max}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary" }}>
          Min: {min}
        </Typography>
      </Box>
    </Box>
  );
}

export default VerticalBar;
