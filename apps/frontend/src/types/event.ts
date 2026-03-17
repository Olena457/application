export interface EventOrganizer {
  id: string;
  name: string | null;
  email: string;
}

export interface EventParticipant {
  id?: string;
  userId?: string;
  user?: { id: string; name: string | null; email: string };
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
  capacity: number | null;
  visibility: string;
  organizerId: string;
  organizer: EventOrganizer;
  tags?: { id: string; name: string }[];
  participants?: EventParticipant[];
  participantCount?: number;
  _count?: { participants: number };
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  date: string;
  location: string;
  capacity?: number;
  visibility?: 'Public' | 'Private';
  tags?: string[];
}
export interface PaginatedEvents {
  events: Event[];
  total: number;
  page: number;
  lastPage: number;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}
