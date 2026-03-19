// import { Link, useNavigate } from "react-router-dom";
// import { Box, Container, Paper, Typography } from "@mui/material";
// import { useLoginMutation } from "../store/api/authApi";
// import { LoginForm } from "../components/LoginForm";
// import type { LoginFormData } from "../components/LoginForm";

// const DEEP_OCEAN: [string, string] = ["#1A2980", "#1eb4ea"];

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [login, { isLoading, error }] = useLoginMutation();

//   const handleOnSubmit = async (data: LoginFormData) => {
//     try {
//       await login(data).unwrap();
//       navigate("/", { replace: true });
//     } catch (err) {
//       console.error("Login error:", err);
//     }
//   };

//   const apiErrorMessage =
//     error && "data" in error && error.data && typeof error.data === "object"
//       ? (error.data as any).message
//         ? Array.isArray((error.data as any).message)
//           ? (error.data as any).message.join(", ")
//           : (error.data as any).message.toString()
//         : "Invalid email or password"
//       : null;

//   return (
//     <Container maxWidth="sm">
//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           py: 4,
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             width: "100%",
//             borderRadius: "16px",
//           }}
//         >

//           <Typography
//             variant="h4"
//             component="h1"
//             gutterBottom
//             fontWeight="bold"
//             sx={{
//               display: "inline-block",
//               width: "fit-content",
//               mb: 3,
//               fontWeight: 600,
//               background: `linear-gradient(135deg, ${DEEP_OCEAN[0]} 10%, ${DEEP_OCEAN[1]} 90%)`,
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             Sign In
//           </Typography>
//           <Typography
//             variant="body2"
//             align="center"
//             color="text.secondary"
//             sx={{ mb: 3 }}
//           >
//             Welcome back! Please enter your credentials.
//           </Typography>

//           <LoginForm
//             onSubmit={handleOnSubmit}
//             isLoading={isLoading}
//             apiError={apiErrorMessage}
//           />

//           <Typography variant="body2" align="center" sx={{ mt: 2 }}>
//             Don&apos;t have an account?{" "}
//             <Link
//               to="/register"
//               style={{
//                 color: "#1976d2",
//                 fontWeight: 600,
//                 textDecoration: "none",
//               }}
//             >
//               Sign Up
//             </Link>
//           </Typography>
//         </Paper>
//       </Box>
//     </Container>
//   );
// }
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
import { useLoginMutation } from "../store/api/authApi";
import { LoginForm } from "../components/LoginForm";
import type { LoginFormData } from "../components/LoginForm";
import BgPhoto from "../assets/compressed.png"; 

const DEEP_OCEAN: [string, string] = ["#1A2980", "#1eb4ea"];

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleOnSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const apiErrorMessage =
    error && "data" in error && error.data && typeof error.data === "object"
      ? (error.data as any).message
        ? Array.isArray((error.data as any).message)
          ? (error.data as any).message.join(", ")
          : (error.data as any).message.toString()
        : "Invalid email or password"
      : null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        minHeight: "100vh",
      }}
    >
      {/* Форма логіну */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 0, md: 4 },
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: "550px",
              borderRadius: "16px",
              boxShadow: "0px 10px 40px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                mb: 4,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${DEEP_OCEAN[0]} 10%, ${DEEP_OCEAN[1]} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Sign In
            </Typography>

            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Welcome back! Please enter your credentials.
            </Typography>

            <LoginForm
              onSubmit={handleOnSubmit}
              isLoading={isLoading}
              apiError={apiErrorMessage}
            />

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: DEEP_OCEAN[0],
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Фото справа */}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: "100%",
          maxWidth: "600px",
          backgroundImage: `url(${BgPhoto})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </Box>
  );
}
