import type { EventFormData } from "../components/EventForm";

export const formatEventPayload = (data: EventFormData) => {
  return {
    ...data,
    date: data.date.toISOString(),
    description: data.description || undefined,
    capacity: data.capacity ? Number(data.capacity) : undefined,
    tags: data.tags?.filter((tag): tag is string => Boolean(tag)) || [],
  };
};
