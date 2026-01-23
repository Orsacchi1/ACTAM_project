import { Box, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

function KnobSpecial({
  min = 0,
  max = 100,
  value = 50,
  onChange,
  label = "",
  step = 0.1,
  disabled = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);
  const knobRef = useRef(null);
  const dragStartY = useRef(0);
  const dragStartValue = useRef(0);

  const valueToAngle = (val) => {
    const normalizedValue = (val - min) / (max - min);
    return -135 + normalizedValue * 270;
  };

  const angle = valueToAngle(currentValue);

  const decimals = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
  const maxDisplayText = max.toFixed(decimals);
  const displayWidth = Math.max(maxDisplayText.length * 7 + 8, 32);

  const handleMouseDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartValue.current = currentValue;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaY = dragStartY.current - e.clientY;
      const sensitivity = 0.5;
      const valueRange = max - min;
      const deltaValue = (deltaY * sensitivity * valueRange) / 100;

      let newValue = dragStartValue.current + deltaValue;
      newValue = Math.max(min, Math.min(max, newValue));
      newValue = Math.round(newValue / step) * step;

      setCurrentValue(newValue);

      if (onChange) {
        const result = onChange(newValue);
        if (typeof result === "number" && Number.isFinite(result)) {
          setDisplayValue(result);
        } else {
          setDisplayValue(newValue);
        }
      } else {
        setDisplayValue(newValue);
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
  }, [isDragging, min, max, onChange, step]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        userSelect: "none",
      }}
    >
      {label && (
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", mb: 0, fontSize: "1rem" }}
        >
          {label}
        </Typography>
      )}

      <Box
        sx={{
          position: "relative",
          width: 120,
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "18px",
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            bottom: "17%",
            left: 0,
            color: "text.secondary",
            fontSize: "0.7rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            height: "18px",
          }}
        >
          {min}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            bottom: "17%",
            right: 0,
            color: "text.secondary",
            fontSize: "0.7rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            height: "18px",
          }}
        >
          {max}
        </Typography>

        <Box
          ref={knobRef}
          onMouseDown={handleMouseDown}
          sx={{
            position: "relative",
            width: 70,
            height: 70,
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
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "#333",
              pointerEvents: "none",
            }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            color: "primary.main",
            fontSize: "0.7rem",
            fontWeight: "bold",
            px: 0.5,
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 0.5,
            backgroundColor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "18px",
            minWidth: `${displayWidth}px`,
          }}
        >
          {Number.isFinite(displayValue)
            ? displayValue.toFixed(decimals)
            : currentValue.toFixed(decimals)}
        </Typography>
      </Box>
    </Box>
  );
}

export default KnobSpecial;
