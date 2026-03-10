import { useNavigate } from 'react-router-dom';
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
import { useCreateEventMutation } from '../store/api/eventsApi';
import type { CreateEventRequest } from '../types/event';

const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.date().refine((d) => d > new Date(), {
    message: 'Cannot create events in the past',
  }),
  location: z.string().min(1, 'Location is required'),
  capacity: z.union([z.string(), z.number()]).optional(),
  visibility: z.enum(['Public', 'Private']).default('Public'),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [createEvent, { isLoading, error }] = useCreateEventMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      location: '',
      capacity: undefined,
      visibility: 'Public',
    },
  });

  const dateValue = watch('date');
  const visibilityValue = watch('visibility');

  const onSubmit = async (data: CreateEventFormData & { date: Date }) => {
    try {
      const cap =
        data.capacity === '' || data.capacity === undefined
          ? undefined
          : Number(data.capacity);
      const payload: CreateEventRequest = {
        title: data.title,
        description: data.description || undefined,
        date: data.date.toISOString(),
        location: data.location,
        capacity: cap && cap >= 1 ? cap : undefined,
        visibility: data.visibility,
      };
      const event = await createEvent(payload).unwrap();
      navigate(`/events/${event.id}`);
    } catch {
      // error from mutation
    }
  };

  const apiErrorMessage =
    error && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
      ? Array.isArray((error.data as { message: unknown }).message)
        ? (error.data as { message: string[] }).message.join(', ')
        : (error.data as { message: string }).message
      : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create Event
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
            value={typeof dateValue === 'string' ? new Date(dateValue) : dateValue}
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
            label="Capacity (optional, leave empty for unlimited)"
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
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Event'}
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
