'use server';
/**
 * @fileOverview A Genkit flow for extracting action items from a meeting transcript.
 *
 * - extractActionItems - A function that processes a meeting transcript to extract action items.
 * - ExtractActionItemsInput - The input type for the extractActionItems function.
 * - ExtractActionItemsOutput - The return type for the extractActionItems function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractActionItemsInputSchema = z.object({
  transcript: z.string().describe('The full text of the meeting transcript.'),
});
export type ExtractActionItemsInput = z.infer<typeof ExtractActionItemsInputSchema>;

const ExtractActionItemsOutputSchema = z.object({
  actionItems: z.array(
    z.object({
      task_description: z.string().describe('A concise description of the action item.'),
      owner: z.string().describe('The name of the person assigned to the action item. If no owner is explicitly mentioned, return "Unassigned".'),
      deadline: z.string().nullable().describe('The due date for the action item, if specified. Format as "YYYY-MM-DD" if a specific date is given, otherwise use natural language from transcript or null if not mentioned.'),
    })
  ),
});
export type ExtractActionItemsOutput = z.infer<typeof ExtractActionItemsOutputSchema>;

export async function extractActionItems(input: ExtractActionItemsInput): Promise<ExtractActionItemsOutput> {
  return extractActionItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractActionItemsPrompt',
  input: { schema: ExtractActionItemsInputSchema },
  output: { schema: ExtractActionItemsOutputSchema },
  prompt: `You are an AI assistant specialized in extracting action items from meeting transcripts. Your goal is to identify all actionable statements and extract the task description, the assigned owner, and any associated deadline.

If an owner is not explicitly mentioned for a task, assume 'Unassigned'.
If a deadline is not explicitly mentioned, return null. Format dates as YYYY-MM-DD when a specific date is given. Otherwise, use natural language from the transcript if a specific date is not available.

Here is the meeting transcript:
{{{transcript}}}

Extract the action items in a structured JSON array format. Make sure to wrap the array in an object with a single key 'actionItems'.`,
});

const extractActionItemsFlow = ai.defineFlow(
  {
    name: 'extractActionItemsFlow',
    inputSchema: ExtractActionItemsInputSchema,
    outputSchema: ExtractActionItemsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
