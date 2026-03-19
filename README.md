
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for $0 (The True Startup Guide)

To keep this platform **completely free** without needing a credit card for a billing account, follow this hybrid setup:

### 1. The Backend (Firebase Spark Plan)
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Select your project.
- Ensure you are on the **Spark Plan** (Free). 
- Use Firebase for **Authentication** and **Firestore**. These have huge free tiers that will likely never cost you a cent during your startup phase.

### 2. The Frontend (Vercel - Recommended for $0)
- Create a free account on [Vercel](https://vercel.com).
- Connect your GitHub repository.
- Vercel will automatically detect the Next.js project and deploy it.
- **Why Vercel?**: Unlike "Firebase App Hosting," Vercel's hobby tier is truly $0 and does not require a billing account or credit card to get started.

### 3. Deployment Steps
1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add your Firebase configuration (from `src/firebase/config.ts`) as Environment Variables in Vercel if you want extra security, though the public config is safe to keep in code.
4. Every time you push to GitHub, your site updates automatically.

## 👥 How to Manage Students

As the administrator, you manage your users via the **Firebase Console**:

1. **View Enrollments**: Go to **Authentication > Users**. You can see every student who has registered.
2. **Revoking Access**: To stop a student from using the platform, select their user record and click "Disable account" or "Delete account."
3. **Password Resets**: If a student forgets their key, you can send them a reset email manually from the "Users" tab, though the "Forgot Key?" button on the login screen handles this automatically.
4. **Admin Privileges**: The platform automatically grants Admin access to any email containing the word "admin" (e.g., `admin.synapse@gmail.com`).

Good day, Future RMT!
