import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
} from '../../types/event';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth?: { token: string } }).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Events', 'Event', 'MyEvents'],
  endpoints: (builder) => ({
    getPublicEvents: builder.query<Event[], void>({
      query: () => '/events',
      providesTags: ['Events'],
    }),
    getEvent: builder.query<Event, string>({
      query: (id) => `/events/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation<Event, CreateEventRequest>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),
        invalidatesTags: ['Events', 'MyEvents'],

    }),

    updateEvent: builder.mutation<Event, { id: string; data: UpdateEventRequest }>({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Events',
        'Event',
        'MyEvents',
        { type: 'Event', id },
      ],
    }),
    deleteEvent: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events', 'MyEvents'],
    }),
    joinEvent: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/events/${id}/join`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        'Events',
        'Event',
        'MyEvents',
        { type: 'Event', id },
      ],
    }),
    leaveEvent: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/events/${id}/leave`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        'Events',
        'Event',
        'MyEvents',
        { type: 'Event', id },
      ],
    }),
    getMyEvents: builder.query<Event[], void>({
      query: () => '/users/me/events',
      providesTags: ['MyEvents'],
    }),
  }),
});

export const {
  useGetPublicEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useJoinEventMutation,
  useLeaveEventMutation,
  useGetMyEventsQuery,
} = eventsApi;


