import { styled, keyframes } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

const animateText = keyframes`
  0%, 100% {
    clip-path: polygon(0% 45%, 16% 44%, 33% 50%, 54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);
  }
  50% {
    clip-path: polygon(0% 60%, 15% 65%, 34% 66%, 51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%);
  }
`;

const TextContainer = styled(Box)({
  position: "relative",
  display: "inline-block",
});

const BaseText = styled(Typography)({
  fontSize: "1.8rem",
  fontWeight: 900,
  textTransform: "uppercase",
  color: "transparent",
  WebkitTextStroke: "1px #061e44",
  letterSpacing: "2px",
  lineHeight: 1.2,
});

const FillingText = styled(Typography)({
  fontSize: "1.8rem",
  fontWeight: 900,
  textTransform: "uppercase",
  color: "#0d47a1",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  animation: `${animateText} 3s ease-in-out infinite`,
  letterSpacing: "2px",
  lineHeight: 1.2,
});

interface AnimatedDatabaseTextProps {
  text?: string;
  subText?: string;
}

export const AnimatedDatabaseText = ({
  text = "DATABASE WAKING UP",
  subText = "PLEASE WAIT A MOMENT...",
}: AnimatedDatabaseTextProps) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        pointerEvents: "none",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
        padding: "40px",
        borderRadius: "50%",
      }}
    >
      <TextContainer>
        <BaseText>{text}</BaseText>
        <FillingText>{text}</FillingText>
      </TextContainer>

      {subText && (
        <Typography
          sx={{
            mt: 1,
            color: "#09285b",
            fontWeight: 500,
            fontSize: "0.8rem",
            opacity: 0.8,
            letterSpacing: "1px",
          }}
        >
          {subText}
        </Typography>
      )}
    </Box>
  );
};
