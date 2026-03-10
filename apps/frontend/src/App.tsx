import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsListPage from './pages/EventsListPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import MyEventsPage from './pages/MyEventsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);
  if (token) {
    return <Navigate to="/events" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/events" replace />} />
        <Route path="events" element={<EventsListPage />} />
        <Route path="events/create" element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        } />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="events/:id/edit" element={
          <ProtectedRoute>
            <EditEventPage />
          </ProtectedRoute>
        } />
        <Route path="my-events" element={
          <ProtectedRoute>
            <MyEventsPage />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  );
}
