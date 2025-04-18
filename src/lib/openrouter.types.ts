import { z } from "zod";

export interface ModelParameters {
  parameter?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface ChatPayload {
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  response_format?: object;
  model: string;
}

export interface ResponseData {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  model: string;
  created: number;
}

// Schemat walidacji odpowiedzi
export const responseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
        role: z.string(),
      }),
      finish_reason: z.string(),
    })
  ),
  model: z.string(),
  created: z.number(),
});
