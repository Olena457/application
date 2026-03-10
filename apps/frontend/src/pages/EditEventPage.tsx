import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  useGetEventQuery,
  useUpdateEventMutation,
} from '../store/api/eventsApi';
import type { UpdateEventRequest } from '../types/event';
import type { RootState } from '../store';

const updateEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.date().refine((d) => d > new Date(), {
    message: 'Cannot set event date in the past',
  }),
  location: z.string().min(1, 'Location is required'),
  capacity: z.union([z.string(), z.number()]).optional(),
  visibility: z.enum(['Public', 'Private']),
});

type UpdateEventFormData = z.infer<typeof updateEventSchema>;

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: event, isLoading, error } = useGetEventQuery(id!, {
    skip: !id,
  });
  const [updateEvent, { isLoading: isUpdating, error: updateError }] =
    useUpdateEventMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateEventSchema),
  });

  useEffect(() => {
    if (event) {
      if (event.organizerId !== userId) {
        navigate('/events');
        return;
      }
      reset({
        title: event.title,
        description: event.description || '',
        date: new Date(event.date),
        location: event.location,
        capacity: event.capacity ?? undefined,
        visibility: (event.visibility as 'Public' | 'Private') || 'Public',
      });
    }
  }, [event, userId, reset, navigate]);

  const dateValue = watch('date');
  const visibilityValue = watch('visibility');

  const onSubmit = async (data: UpdateEventFormData & { date: Date }) => {
    if (!id) return;
    try {
      const cap =
        data.capacity === '' || data.capacity === undefined
          ? undefined
          : Number(data.capacity);
      const payload: UpdateEventRequest = {
        title: data.title,
        description: data.description || undefined,
        date: (data.date as Date).toISOString(),
        location: data.location,
        capacity: cap && cap >= 1 ? cap : undefined,
        visibility: data.visibility,
      };
      await updateEvent({ id, data: payload }).unwrap();
      navigate(`/events/${id}`);
    } catch {
      // error from mutation
    }
  };

  const apiErrorMessage =
    (updateError &&
      'data' in updateError &&
      updateError.data &&
      typeof updateError.data === 'object' &&
      'message' in updateError.data
      ? Array.isArray((updateError.data as { message: unknown }).message)
        ? (updateError.data as { message: string[] }).message.join(', ')
        : (updateError.data as { message: string }).message
      : null) || null;

  if (!id || isLoading) return null;
  if (error || !event) {
    return (
      <Typography color="error">Event not found or access denied.</Typography>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Edit Event
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('title')}
            label="Event Title"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
            required
          />
          <TextField
            {...register('description')}
            label="Description"
            multiline
            rows={3}
            fullWidth
            margin="normal"
          />
          <DateTimePicker
            label="Date & Time"
            value={dateValue}
            onChange={(v) => setValue('date', v ?? new Date())}
            minDateTime={new Date()}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                error: !!errors.date,
                helperText: errors.date?.message,
              },
            }}
          />
          <TextField
            {...register('location')}
            label="Location"
            fullWidth
            margin="normal"
            error={!!errors.location}
            helperText={errors.location?.message}
            required
          />
          <TextField
            {...register('capacity', { valueAsNumber: true })}
            label="Capacity (optional)"
            type="number"
            inputProps={{ min: 1 }}
            fullWidth
            margin="normal"
            error={!!errors.capacity}
            helperText={errors.capacity?.message}
          />
          <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
            <FormLabel>Visibility</FormLabel>
            <RadioGroup
              row
              value={visibilityValue}
              onChange={(e) =>
                setValue('visibility', e.target.value as 'Public' | 'Private')
              }
            >
              <FormControlLabel value="Public" control={<Radio />} label="Public" />
              <FormControlLabel value="Private" control={<Radio />} label="Private" />
            </RadioGroup>
          </FormControl>

          {apiErrorMessage && (
            <Typography color="error" variant="body2" sx={{ mb: 1 }}>
              {apiErrorMessage}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}
