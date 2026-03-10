# NotesAI: Project Workflow Overview

NotesAI is an AI-powered platform designed to automate the transition from meeting transcripts to actionable task lists. Below is the complete end-to-end workflow of the application.

## 1. Authentication & Identity
- **Onboarding**: Users sign up or log in using Email/Password or **Google Sign-In**.
- **Profile Initialization**: Upon first login, a `UserProfile` document is created in Firestore (`/users/{userId}`).
- **User Isolation**: All subsequent data operations are scoped to the user's UID via Firestore Security Rules.
- **Profile Customization**: Users can update their display name and upload a profile photo (stored as a Data URI) via the Account Settings dialog.

## 2. Meeting Data Input
- **Transcription Entry**: Users navigate to the Dashboard and provide meeting notes in three ways:
    - **Pasting**: Directly typing or pasting text into the main editor.
    - **Text Upload**: Uploading `.txt` files which are read into the editor.
    - **PDF Upload**: Uploading `.pdf` files (simulated parsing).
- **Demo Mode**: Users can load sample text to test the extraction engine instantly.

## 3. The AI Extraction Pipeline
When the user clicks **"Run Extraction"**, the following sequence occurs:
1. **Run Initialization**: A unique `Run` document and `Transcript` document are created in Firestore.
2. **API Call**: The frontend sends a `POST` request to `/api/extract` with the transcript and user context.
3. **Genkit Flows**: The server executes two main AI flows:
    - **`extractActionItemsFlow`**: Uses Gemini (via Genkit) to identify actionable statements, assign owners (defaulting to "Unassigned"), and extract deadlines.
    - **`assignPriorityFlow`**: Takes the extracted tasks and applies a scoring algorithm based on urgency keywords (e.g., "ASAP", "Urgent") and deadline proximity.
4. **Real-time Feedback**: The frontend listens to a `logEvents` sub-collection. The server (and client simulation) emits logs for states like `TASK_EXTRACTION` and `PRIORITY_SCORING`, which appear in the **Execution Pipeline** terminal.

## 4. Task Management & Analytics
- **Task Repository**: Extracted tasks are saved to `/users/{userId}/tasks/{taskId}`.
- **Real-time Sync**: The dashboard uses the `useCollection` hook to reflect task changes (completion status, deletions) instantly.
- **Metrics Panel**:
    - **Priority Distribution**: A bar chart showing the volume of High, Medium, and Low tasks.
    - **Completion Rate**: A pie chart tracking "Pending" vs "Completed" tasks.
    - **Performance**: Displays average AI confidence and overall progress percentage.

## 5. Export & External Integration
- **Global Export**: Users can download their entire task list as **JSON**, **CSV**, or a formatted **PDF** simulation.
- **Task-Specific Actions**:
    - **Sharing**: Copying task details or using the Web Share API.
    - **Tool Export**: Specific "Copy for Jira" and "Copy for Trello" buttons format the task details into Markdown/Markup compatible with those platforms.

## 6. Security & Error Handling
- **Security Rules**: Firestore rules ensure `isOwner(userId)` for every read/write operation.
- **Permission Errors**: If a rule is violated, a specialized `FirestorePermissionError` is emitted globally to help with debugging during development.
- **Non-Blocking UI**: All Firestore writes use "non-blocking" patterns, meaning the UI updates optimistically while data syncs in the background.
