import { Injectable } from '@nestjs/common';
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
    const fallbackMessage =
      'Sorry, I didn\u2019t understand that. Please try rephrasing your question.';

    const compactEvents = eventsData.map((e) => ({
      title: String(e.title || ''),
      date: String(e.date || ''),
      location: String(e.location || ''),
      tags: Array.isArray(e.tags)
        ? e.tags.map((t) => (typeof t === 'object' ? (t as { name: string }).name : String(t)))
        : [],
      organizer: String(e.organizer?.name || 'Unknown'),
      participants:
        (e.participants as unknown as { user: { name: string } }[])
          ?.map((p) => p.user?.name)
          .filter(Boolean) || [],
      participantsCount: Number(e.participants?.length || 0),
    }));

    const prompt = `
      Context: Today is ${new Date().toISOString()}.
      You are an AI Event Assistant. Below is a list of events in JSON format:
      ${JSON.stringify(compactEvents)}

      Answer the user's question based ONLY on the provided events data.
      If the question is unclear or unsupported, respond EXACTLY with:
      "${fallbackMessage}"

      User question: "${question}"
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
        return fallbackMessage;
      }

      const data = (await response.json()) as MistralResponse;
      return data.choices[0]?.message?.content || fallbackMessage;
    } catch (error: unknown) {
      console.error('AI Assistant Error:', error);
      return fallbackMessage;
    }
  }
}
