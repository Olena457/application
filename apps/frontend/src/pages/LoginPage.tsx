// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Link, useNavigate } from 'react-router-dom';
// import { Eye, EyeOff } from 'lucide-react';
// import {
//   Box,
//   Button,
//   Container,
//   IconButton,
//   InputAdornment,
//   Paper,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { useLoginMutation } from '../store/api/authApi';

// const loginSchema = z.object({
//   email: z.string().email('Enter a valid email address'),
//   password: z.string().min(1, 'Password is required'),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [login, { isLoading, error }] = useLoginMutation();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: '', password: '' },
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       await login(data).unwrap();
//       navigate('/', { replace: true });
//     } catch {
//       // error handled by error state
//     }
//   };

//   const apiErrorMessage =
//     error && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
//       ? Array.isArray((error.data as { message: unknown }).message)
//         ? (error.data as { message: string[] }).message.join(', ')
//         : (error.data as { message: string }).message
//       : null;

//   return (
//     <Container maxWidth="sm">
//       <Box
//         sx={{
//           minHeight: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           py: 4,
//         }}
//       >
//         <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
//           <Typography variant="h4" component="h1" gutterBottom align="center">
//             Sign In
//           </Typography>

//           <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
//             <TextField
//               {...register('email')}
//               label="Email"
//               type="email"
//               fullWidth
//               margin="normal"
//               autoComplete="email"
//               error={!!errors.email}
//               helperText={errors.email?.message}
//               autoFocus
//             />
//             <TextField
//               {...register('password')}
//               label="Password"
//               type={showPassword ? 'text' : 'password'}
//               fullWidth
//               margin="normal"
//               autoComplete="current-password"
//               error={!!errors.password}
//               helperText={errors.password?.message}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() => setShowPassword(!showPassword)}
//                       edge="end"
//                       aria-label={showPassword ? 'Hide password' : 'Show password'}
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {apiErrorMessage && (
//               <Typography color="error" variant="body2" sx={{ mt: 1 }}>
//                 {apiErrorMessage}
//               </Typography>
//             )}

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Loading...' : 'Sign In'}
//             </Button>

//             <Typography variant="body2" align="center">
//               Don&apos;t have an account?{' '}
//               <Link to="/register" style={{ color: 'inherit' }}>
//                 Sign Up
//               </Link>
//             </Typography>
//           </Box>
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
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: "16px",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            fontWeight={700}
          >
            Sign In
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Welcome back! Please enter your details.
          </Typography>

          <LoginForm
            onSubmit={handleOnSubmit}
            isLoading={isLoading}
            apiError={apiErrorMessage}
          />

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#1976d2",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}