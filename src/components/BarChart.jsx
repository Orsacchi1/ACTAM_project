import { Box, Typography } from "@mui/material";

function BarChart({ 
  values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  labels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
  height = 200,
  title = "Bar Chart"
}) {
  // Find the maximum value for scaling
  const maxValue = Math.max(...values, 1); // Ensure at least 1 to avoid division by zero
  
  // Scale values so the max reaches 100% of container height
  const scaledValues = values.map(value => (value / maxValue));

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom sx={{ mb: 1, textAlign: "center" }}>
          {title}
        </Typography>
      )}
      
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 1.5,
          px: 2,
          py: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          backgroundColor: "#fafafa",
        }}
      >
        {values.map((value, index) => {
          const heightPercentage = scaledValues[index] * 100;
          
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                maxWidth: "60px",
              }}
            >
              {/* Bar Container */}
              <Box
                sx={{
                  width: "100%",
                  height: height,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  position: "relative",
                }}
              >
                {/* Bar */}
                <Box
                  sx={{
                    width: "100%",
                    height: `${heightPercentage}%`,
                    background: `linear-gradient(180deg, 
                      ${heightPercentage > 70 ? "#f44336" : heightPercentage > 50 ? "#ff9800" : "#667eea"} 0%, 
                      ${heightPercentage > 70 ? "#d32f2f" : heightPercentage > 50 ? "#f57c00" : "#764ba2"} 100%)`,
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.3s ease, background 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </Box>

              {/* Note Label at Bottom */}
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  mt: 0.5,
                  color: "text.primary",
                }}
              >
                {labels[index]}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Legend */}

    </Box>
  );
}

export default BarChart;
