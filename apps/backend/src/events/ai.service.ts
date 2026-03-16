import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { EventData } from '../common/interfaces/request-with-user.interface';

export interface MistralChoice {
  message: {
    content: string;
  };
}

export interface MistralResponse {
  choices: MistralChoice[];
}

@Injectable()
export class AiService {
  private readonly apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private readonly apiKey = process.env.MISTRAL_API_KEY;

  async askAssistant(question: string, eventsData: EventData[]): Promise<string> {
    const compactEvents = eventsData.map((e) => ({
      title: String(e.title || ''),
      date: String(e.date || ''),
      location: String(e.location || ''),
      tags: Array.isArray(e.tags)
        ? e.tags.map((t) => (typeof t === 'object' ? (t as { name: string }).name : String(t)))
        : [],
      organizer: String(e.organizer?.name || 'Unknown'),
      participantsCount: Number(e.participants?.length || 0),
    }));

    const prompt = `
      You are an AI Event Assistant. Below is a list of events in JSON format:
      ${JSON.stringify(compactEvents)}

      Answer the user's question based ONLY on the provided events data. 
      If the answer is not in the data, or the question is unclear, respond EXACTLY with:
      "Sorry, I did not understand that..."

      User question: "${question}"
      
      Requirements:
      - Be concise and precise.
      - Support counting, listing, and filtering (by date, tags, or participants).
    `;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'open-mistral-7b',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as unknown;
        console.error('Mistral API Error Detail:', errorData);
        throw new Error(`Mistral API error: ${response.statusText}`);
      }

      const data = (await response.json()) as MistralResponse;
      return data.choices[0].message.content;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('AI Assistant Error:', errorMessage);
      throw new InternalServerErrorException('Assistant is currently unavailable');
    }
  }
}
