
# NotesAI - Meeting Transcript Extractor

NotesAI is a professional AI-powered tool that automatically converts meeting transcripts into structured action items with assigned owners and priority scores.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Ensure your `.env` file contains your `GOOGLE_GENAI_API_KEY` and Firebase configuration.

3. **Run Locally**:
   ```bash
   npm run dev
   ```

## 📤 How to Push to Git

To push this project to a remote repository (like GitHub), run the following commands in your terminal:

1. **Initialize Git**:
   ```bash
   git init
   ```

2. **Add Files**:
   ```bash
   git add .
   ```

3. **Commit Changes**:
   ```bash
   git commit -m "Initial commit of NotesAI Prototyper"
   ```

4. **Connect to Remote**:
   *Replace `YOUR_REPO_URL` with your actual GitHub repository URL.*
   ```bash
   git remote add origin YOUR_REPO_URL
   ```

5. **Push to Main**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **AI**: Genkit 1.x with Gemini 2.5 Flash
- **Database**: Firestore (Real-time sync)
- **Styling**: Tailwind CSS + ShadCN UI
- **Auth**: Firebase Auth (Google & Email)
