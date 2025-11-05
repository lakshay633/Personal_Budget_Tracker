import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ py: 2, mt: "auto", bgcolor: "primary.main", color: "common.white" }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "common.white" }}>
          &copy; {new Date().getFullYear()} Budget Tracker. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
