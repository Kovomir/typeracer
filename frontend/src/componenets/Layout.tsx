import React from "react";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      minHeight: "100vh",
      backgroundImage: "url(/blurry-gradient-haikei.svg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      m: 0,
      p: 0,
    }}
  >
    <AppBar position="static" color="primary">
      <Toolbar>
        <img
          src="/racing-flag.svg"
          alt="Racing Flag"
          style={{ width: 32, height: 32, marginRight: 12 }}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Typeracer
        </Typography>
      </Toolbar>
    </AppBar>
    <Container sx={{ flex: 1, py: 4, minHeight: "100vh" }}>
      {children}
    </Container>
    <Box
      component="footer"
      sx={{ py: 2, textAlign: "center", bgcolor: "primary.main" }}
    >
      <Typography variant="body2" color="text.primary">
        © Kovomir 2025
      </Typography>
    </Box>
  </Box>
);

export default Layout;