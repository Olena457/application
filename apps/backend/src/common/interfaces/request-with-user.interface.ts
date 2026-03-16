import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}
export interface EventData {
  title: string;
  date: Date | string;
  location?: string;
  tags?: Array<{ name: string } | string>;
  organizer?: { name: string };
  participants?: any[];
}
