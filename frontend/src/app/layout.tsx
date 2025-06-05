import type { Metadata } from "next";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import "../globals.css";

export const metadata: Metadata = {
  title: "Typeracer",
  description: "Typeracer game",
  icons: {
    icon: "/racing-flag.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Box display="flex" alignItems="center" gap={1}>
              <Image
                src="/racing-flag.svg"
                alt="Racing Flag"
                width={32}
                height={32}
                style={{ marginRight: 8 }}
              />
              <Typography variant="h6" color="inherit" fontWeight={700}>
                Typeracer
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Box flex={1} display="flex" flexDirection="column" minHeight="0">
          {children}
        </Box>
        <Box component="footer" textAlign="center" py={2}>
          © Kovomir 2025
        </Box>
      </body>
    </html>
  );
}
