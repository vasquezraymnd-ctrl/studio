
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for $0 (Startup Alternatives)

If you are a startup in a region where phone verification or credit card requirements are a barrier, use these **truly free** alternatives to host your Next.js application:

### 1. Netlify (Recommended Alternative)
- **Cost**: $0 (Starter Plan).
- **Setup**: Connect your GitHub repository. Netlify automatically detects Next.js.
- **Why?**: Netlify has a very generous free tier and often has fewer verification hurdles than Google Cloud or Vercel in certain regions.

### 2. Cloudflare Pages
- **Cost**: $0 (Free Plan).
- **Setup**: Connect GitHub and select "Next.js" as the framework preset.
- **Why?**: Cloudflare offers unlimited bandwidth on their free tier and is highly accessible globally. It handles Next.js App Router via their `@cloudflare/next-on-pages` adapter.

### 3. The Backend (Firebase Spark Plan)
- **Cost**: $0 (Spark Plan).
- **Setup**: Go to the [Firebase Console](https://console.firebase.google.com/).
- **Security**: Your `apiKey` and `authDomain` are public-facing by design in Firebase. Security is handled via **Firestore Security Rules** (already configured in this project).

## 👥 How to Manage Students

As the administrator, you manage your users via the **Firebase Console**:

1. **View Enrollments**: Go to **Authentication > Users**. You can see every student who has registered.
2. **Revoking Access**: To stop a student from using the platform, select their user record and click "Disable account" or "Delete account."
3. **Password Resets**: If a student forgets their key, they can click "Forgot Key?" on the login screen, or you can trigger a reset email manually from the "Users" tab.
4. **Admin Privileges**: The platform automatically grants Admin access to any email containing the word "admin" (e.g., `admin.synapse@gmail.com`).

Good day, Future RMT!
