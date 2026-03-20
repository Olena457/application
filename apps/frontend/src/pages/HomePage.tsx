
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { logout } from "../store/slices/authSlice";
import type { RootState } from "../store";
import { HeroContent } from "../components/HeroContent";
import { AiCardHelper } from "../components/AiCardHelper"; 

import ballon from "../assets/ballon.jpg";
import business from "../assets/business.jpg";
import leader from "../assets/leader.jpg";
import speaker from "../assets/speaker.jpg";
import sport from "../assets/sport.jpg";

const DEEP_BLUE_GRADIENT =
  "linear-gradient(to bottom, #1e88e5 0%, #0d47a1 100%)";

export default function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const handleLogout = () => dispatch(logout());

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background: DEEP_BLUE_GRADIENT,
        display: "flex",
        overflow: "hidden",
        boxSizing: "border-box",
        py: 2,
        px: { xs: 1.5, sm: 1, lg: 2.5 },
        position: "relative", 
      }}
    >
      {/* --- grid layout --- */}
      <Box
        sx={{
          display: "grid",
          width: "100%",
          height: "100%",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "0.8fr 1.1fr 1.1fr",
          },
          gridTemplateRows: {
            xs: "minmax(0, 1fr) auto",
            sm: "minmax(0, 1fr) minmax(0, 1fr)",
            lg: "1.1fr 0.9fr",
          },
          gridTemplateAreas: {
            xs: `
              "business"
              "hero"
            `,
            sm: `
              "hero ballon"
              "hero leader"
            `,
            lg: `
              "leftTall hero rightTop"
              "leftTall bottomRow bottomRow"
            `,
          },
          "& img": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "24px",
            display: "block",
          },
        }}
      >
        <Box sx={{ gridArea: "hero", minHeight: 0, height: "100%" }}>
          <HeroContent userName={user?.name} onLogout={handleLogout} />
        </Box>

        <Box
          sx={{
            gridArea: { sm: "ballon", lg: "none" },
            display: { xs: "none", sm: "block", lg: "none" },
          }}
        >
          <img
            src={ballon}
            alt="ballon"
            style={{ objectPosition: "center 15%" }}
          />
        </Box>

        <Box
          sx={{
            gridArea: { sm: "leader", lg: "none" },
            display: { xs: "none", sm: "block", lg: "none" },
          }}
        >
          <img src={leader} alt="leader" />
        </Box>

        <Box
          sx={{
            gridArea: "business",
            display: { xs: "block", sm: "none", lg: "none" },
          }}
        >
          <img src={business} alt="business" />
        </Box>

        <Box
          sx={{ gridArea: "leftTall", display: { xs: "none", lg: "block" } }}
        >
          <img src={sport} alt="sport" />
        </Box>

        <Box
          sx={{ gridArea: "rightTop", display: { xs: "none", lg: "block" } }}
        >
          <img src={speaker} alt="speaker" />
        </Box>

        <Box
          sx={{
            gridArea: "bottomRow",
            display: { xs: "none", lg: "grid" },
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 2,
          }}
        >
          <img src={business} alt="business" />
          <img src={ballon} alt="ballon" />
          <img src={leader} alt="leader" />
        </Box>
      </Box>

      {/* --- ai card helper --- */}
      <Box
        sx={{
          position: "absolute",
          zIndex: 1000,
          pointerEvents: "auto",
          top: { xs: 182, sm: "auto", lg: 62 },
          left: { xs: 22, sm: "auto", lg: 38},
          bottom: { xs: "auto", sm: 25, lg: "auto" },
          right: { xs: "auto", sm: 20, lg: "auto" },
          "& > div": {
            width: { xs: "100px", sm: "110px", lg: "130px" },
            height: "auto",
            aspectRatio: "1 / 1",
          },
        }}
      >
        <AiCardHelper />
      </Box>
    </Box>
  );
}