import { Container, Typography, Box } from "@mui/material";

function Test() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h4" component="h1" color="text.secondary">
          Test Page
        </Typography>
      </Box>
    </Container>
  );
}

export default Test;
