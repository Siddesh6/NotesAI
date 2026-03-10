
import { NextRequest, NextResponse } from 'next/server';
import { extractActionItems } from '@/ai/flows/extract-action-items-flow';
import { assignPriorityToActionItems } from '@/ai/flows/assign-priority-flow';

export async function POST(req: NextRequest) {
  try {
    const { transcript, userId } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    // Workflow State Machine simulation/logging could happen here
    const runId = crypto.randomUUID();
    console.log(`[${runId}] RUN_START for user ${userId}`);

    // State: PARSING_TRANSCRIPT / TASK_EXTRACTION
    console.log(`[${runId}] STATE: TASK_EXTRACTION`);
    const { actionItems } = await extractActionItems({ transcript });

    // State: ENTITY_DETECTION / PRIORITY_SCORING
    console.log(`[${runId}] STATE: PRIORITY_SCORING`);
    const prioritizedResults = await assignPriorityToActionItems({
      action_items: actionItems.map(item => ({
        ...item,
        source_sentence: item.task_description, // Fallback if not provided
        confidence_score: 95,
        deadline: item.deadline || undefined,
        owner: item.owner || 'Unassigned'
      }))
    });

    console.log(`[${runId}] STATE: STRUCTURED_OUTPUT`);

    return NextResponse.json({
      runId,
      tasks: prioritizedResults.action_items,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Extraction Error:', error);
    return NextResponse.json({ error: 'Failed to process transcript' }, { status: 500 });
  }
}
