import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          // height: "100%",
          flex: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "grey.100",
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(103,58,183,0.04) 100%)",
          px: 2,
          pb: 2,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <EmojiNatureIcon sx={{ fontSize: 64, color: "primary.main" }} />
            <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
              Budget Tracker
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 3 }}>
              Track spending, set budgets and generate insightful reports — all
              in one place.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
              >
                Get started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/register")}
              >
                Create account
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
