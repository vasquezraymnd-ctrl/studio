
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for $0 (Startup Alternatives)

If you are a startup in a region where phone verification or credit card requirements are a barrier, use these **truly free** alternatives to host your Next.js application:

### 1. Netlify (Recommended)
- **Cost**: $0 (Starter Plan).
- **Setup**: Connect your GitHub repository. Netlify automatically detects Next.js.
- **Why?**: Netlify has a very generous free tier and often has fewer verification hurdles than Google Cloud or Vercel in certain regions.

### 2. Cloudflare Pages
- **Cost**: $0 (Free Plan).
- **Setup**: Connect GitHub and select "Next.js" as the framework preset.
- **Why?**: Cloudflare offers unlimited bandwidth on their free tier and is highly accessible globally.

### 3. The Backend (Firebase Spark Plan)
- **Cost**: $0 (Spark Plan).
- **Security**: Security is handled via **Firestore Security Rules** (already configured in this project). Your `apiKey` is public by design; the rules prevent unauthorized access.

## 👥 How to Manage Students & Content

### Student Access
As the administrator, you manage your users via the **Firebase Console**:
1. **View Enrollments**: Go to **Authentication > Users**.
2. **Revoking Access**: Select a student and click "Disable account" or "Delete account."
3. **Admin Privileges**: Any email containing the word "admin" (e.g., `admin.user@gmail.com`) automatically gains access to the **Command Center**.

### Scheduling Content
In the **Admin Command Center**, you can:
1. **Deploy Modules**: Add a "Visibility Schedule" to hide materials until a specific date (e.g., the start of a specific review week).
2. **Flash Test Banks**: Schedule 100-item exams to appear only during designated mock board sessions.

Good luck, Future RMT!
