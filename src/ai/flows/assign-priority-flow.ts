'use server';
/**
 * @fileOverview A Genkit flow for assigning priority scores to action items.
 *
 * - assignPriorityToActionItems - A function that assigns priority and priority scores to a list of action items.
 * - AssignPriorityToActionItemsInput - The input type for the assignPriorityToActionItems function.
 * - AssignPriorityToActionItemsOutput - The return type for the assignPriorityToActionItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema for a single action item
const ActionItemInputSchema = z.object({
  task_description: z.string().describe('The description of the action item.'),
  owner: z.string().optional().describe('The person assigned to the action item.'),
  deadline: z.string().optional().describe('The deadline for the action item in YYYY-MM-DD format (optional).'),
  source_sentence: z.string().describe('The original sentence from which the action item was extracted.'),
  confidence_score: z.number().min(0).max(100).optional().describe('A confidence score for the extraction (optional).')
});

// Input Schema for the flow
const AssignPriorityToActionItemsInputSchema = z.object({
  action_items: z.array(ActionItemInputSchema).describe('A list of action items to prioritize.'),
});
export type AssignPriorityToActionItemsInput = z.infer<typeof AssignPriorityToActionItemsInputSchema>;

// Output Schema for a single action item
const ActionItemOutputSchema = z.object({
  task_description: z.string().describe('The description of the action item.'),
  owner: z.string().optional().describe('The person assigned to the action item.'),
  deadline: z.string().optional().describe('The deadline for the action item in YYYY-MM-DD format (optional).'),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe('The calculated priority of the action item.'),
  priority_score: z.number().min(0).max(100).describe('The calculated priority score (0-100).'),
  confidence_score: z.number().min(0).max(100).optional().describe('A confidence score for the extraction (optional).')
});

// Output Schema for the flow
const AssignPriorityToActionItemsOutputSchema = z.object({
  action_items: z.array(ActionItemOutputSchema).describe('A list of action items with assigned priorities and scores.'),
});
export type AssignPriorityToActionItemsOutput = z.infer<typeof AssignPriorityToActionItemsOutputSchema>;

// Wrapper function to call the flow
export async function assignPriorityToActionItems(
  input: AssignPriorityToActionItemsInput
): Promise<AssignPriorityToActionItemsOutput> {
  return assignPriorityFlow(input);
}

// Urgency keywords for boosting priority
const URGENCY_KEYWORDS = ['urgent', 'asap', 'immediately', 'critical'];

// Helper function to calculate priority score and label
function calculatePriority(
  deadline: string | undefined | null,
  sourceSentence: string
): { priority: 'HIGH' | 'MEDIUM' | 'LOW'; priority_score: number } {
  let score = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

  // Base score based on deadline
  if (deadline) {
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

    // Check for invalid date
    if (isNaN(deadlineDate.getTime())) {
      // Treat as no deadline if invalid or unparseable
      score = 15;
    } else {
      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Use ceil to count today as 0 days diff

      if (diffDays <= 0) { // Today or past
        score = 85;
      } else if (diffDays <= 3) { // Within 3 days (tomorrow, day after, day after that)
        score = 55;
      } else { // More than 3 days
        score = 15;
      }
    }
  } else {
    // No deadline
    score = 15;
  }

  // Boost score based on urgency keywords
  const lowerCaseSourceSentence = sourceSentence.toLowerCase();
  for (const keyword of URGENCY_KEYWORDS) {
    if (lowerCaseSourceSentence.includes(keyword)) {
      score += 15; 
      break; // Only boost once for keywords to prevent excessive scores from multiple keywords
    }
  }

  // Ensure score is within 0-100 range
  score = Math.max(0, Math.min(100, score));

  // Determine priority label based on final score thresholds
  let priority: 'HIGH' | 'MEDIUM' | 'LOW';
  if (score >= 80) {
    priority = 'HIGH';
  } else if (score >= 40) {
    priority = 'MEDIUM';
  } else {
    priority = 'LOW';
  }

  return { priority, priority_score: score };
}

const assignPriorityFlow = ai.defineFlow(
  {
    name: 'assignPriorityFlow',
    inputSchema: AssignPriorityToActionItemsInputSchema,
    outputSchema: AssignPriorityToActionItemsOutputSchema,
  },
  async (input) => {
    const prioritizedActionItems = input.action_items.map((item) => {
      const { priority, priority_score } = calculatePriority(
        item.deadline,
        item.source_sentence
      );
      return {
        ...item,
        priority,
        priority_score,
        confidence_score: item.confidence_score, // Pass through existing confidence_score
      };
    });

    return { action_items: prioritizedActionItems };
  }
);
