
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for $0 (Truly Free Startup Guide)

If you are a startup in a region where phone verification or credit card requirements are a barrier for Google Cloud or Vercel, use **Cloudflare Pages**. It is free, fast, and reliable.

### 🛠 Cloudflare Pages Deployment Steps

1.  **Go to Workers & Pages**: In your Cloudflare dashboard, click **Workers & Pages** in the left sidebar.
2.  **Select Pages**: Do NOT create a Worker. Click the **Pages** tab at the top of the list.
3.  **Connect to Git**: Click **Connect to Git** (or Create application > Pages).
4.  **Connect GitHub**: Connect your account and select your `mobilesynapse` repository.
5.  **Set up builds and deployments**: On this screen:
    - **Framework preset**: Select **Next.js**.
    - **Build command**: `npm run build` (automatic).
    - **Output directory**: `.vercel/output` (automatic).
6.  **Environment Variables**: Add this variable for compatibility:
    - Key: `NODE_VERSION`
    - Value: `20`
7.  **Save and Deploy**: Your site will be live at a `*.pages.dev` address.

## 👥 How to Manage Students & Content

### Student Access
As the administrator, you manage your users via the **Firebase Console**:
1. **View Enrollments**: Go to **Authentication > Users**.
2. **Revoking Access**: Select a student and click "Disable account" or "Delete account."
3. **Admin Privileges**: Any email containing the word "admin" (e.g., `admin.user@gmail.com`) automatically gains access to the **Command Center**.

### Scheduling Content
In the **Admin Command Center**, you can:
1. **Deploy Modules**: Add a "Visibility Schedule" to hide materials until a specific date.
2. **Flash Test Banks**: Schedule 100-item exams to appear only during designated mock board sessions.

Good luck, Future RMT!
