# **App Name**: Meeting Notes to Action Items Extractor

## Core Features:

- User Authentication: Secure user access to the application, leveraging Firebase Authentication for robust and scalable identity management.
- Transcript Submission: Provide a user interface for uploading or directly inputting meeting transcripts, serving as the primary source for action item extraction.
- AI Action Item Extraction Tool: An AI-powered tool that processes submitted transcripts to identify and extract actionable statements, including task descriptions, assigned owners, and identified deadlines, using natural language processing (NLP).
- Dynamic Priority Scoring Tool: Implement a generative AI tool to automatically assess and assign priority scores to each extracted action item based on factors like deadlines (e.g., today=high, 3 days=medium), presence of urgency keywords (e.g., 'urgent', 'ASAP'), and custom scoring logic.
- Structured Action Item Storage: Persistently store all extracted and processed action items, including their unique IDs, descriptions, owners, deadlines, priorities, and confidence scores, in Firebase Firestore.
- AI Workflow Logging & Audit Trail: Maintain a comprehensive logging system for each AI processing run, recording state transitions, processing times, tool calls, and final results in a structured JSON format in Firestore, facilitating debugging and operational insights.
- Action Item Retrieval & Display: Enable authenticated users to securely retrieve, view, and manage their extracted action items through a structured interface, with options for filtering and status updates (pending/completed).

## Style Guidelines:

- Primary brand color: A deep, rich violet (#603080). This hue communicates professionalism, clarity, and sophistication, grounding the application's serious purpose in efficient organization.
- Background color: A very subtle, almost white lavender-grey (#F4F0F5). This provides a clean, neutral canvas that enhances text readability and allows content to stand out, maintaining a light and airy feel.
- Accent color: A vibrant, clear blue (#4D4DE6). Used sparingly for calls to action, interactive elements, and key highlights, this color provides energetic contrast and guides user attention effectively.
- Universal font: 'Inter' (sans-serif). Chosen for its modern, objective, and neutral aesthetic, 'Inter' offers exceptional legibility across all text sizes, making it ideal for both headlines and the dense information in action item lists or transcripts.
- Utilize a consistent set of clean, minimalist line-art icons. Icons should be easily discernible and intuitively convey concepts like tasks, deadlines, ownership, and process states without requiring lengthy labels. Prioritize functional clarity over decorative elements.
- Employ a spacious, content-first layout with a clear visual hierarchy. Use grid-based arrangements for action item displays to ensure scannability and ease of comparison. Ample whitespace will reduce visual clutter, promoting focus on the core information.
- Incorporate subtle, micro-interactions and transitions to provide feedback and enhance user experience. Animations for loading states, task status changes, or successful submissions should be brief, purposeful, and smooth, guiding the user through workflows without distraction.