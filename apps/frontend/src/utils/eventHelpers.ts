import type { EventFormData } from "../utils/event.validation";

export const formatEventPayload = (data: EventFormData) => {
  return {
    ...data,
    date: data.date.toISOString(),
    description: data.description || undefined,
    capacity: data.capacity ? Number(data.capacity) : undefined,
    tags: data.tags?.filter((tag): tag is string => Boolean(tag)) || [],
  };
};
