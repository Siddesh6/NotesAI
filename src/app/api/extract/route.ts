
import { NextRequest, NextResponse } from 'next/server';
import { extractActionItems } from '@/ai/flows/extract-action-items-flow';
import { assignPriorityToActionItems } from '@/ai/flows/assign-priority-flow';

// Allow this route to run for up to 60 seconds (Vercel/App Hosting requirement for AI)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { transcript, userId } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const runId = crypto.randomUUID();
    console.log(`[${runId}] Starting extraction for user: ${userId}`);

    // State: TASK_EXTRACTION
    console.log(`[${runId}] Phase 1: Extracting action items...`);
    const extractionResult = await extractActionItems({ transcript });
    
    if (!extractionResult || !extractionResult.actionItems) {
      throw new Error('AI failed to return structured action items.');
    }

    // State: PRIORITY_SCORING
    console.log(`[${runId}] Phase 2: Scoring priorities for ${extractionResult.actionItems.length} items...`);
    const prioritizedResults = await assignPriorityToActionItems({
      action_items: extractionResult.actionItems.map(item => ({
        task_description: item.task_description,
        source_sentence: item.task_description,
        confidence_score: 95,
        deadline: item.deadline || undefined,
        owner: item.owner || 'Unassigned'
      }))
    });

    console.log(`[${runId}] Extraction successful.`);

    return NextResponse.json({
      runId,
      tasks: prioritizedResults.action_items,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Extraction Pipeline Error:', error);
    
    // Provide a more descriptive error message if possible
    const errorMessage = error.message || 'Internal processing error';
    return NextResponse.json({ 
      error: 'Failed to process transcript', 
      details: errorMessage 
    }, { status: 500 });
  }
}
