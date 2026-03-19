
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for $0 (Startup Alternatives)

If you are a startup in a region where phone verification or credit card requirements are a barrier, use these **truly free** alternatives to host your Next.js application:

### 1. Cloudflare Pages (Highly Recommended)
- **Cost**: $0 (Free Plan).
- **Setup Steps**:
    1. Go to **Workers & Pages** in your Cloudflare dashboard.
    2. Click **Create** > **Pages** > **Connect to Git**.
    3. Select your repository.
    4. In **Build settings**, select **Next.js** from the **Framework preset** dropdown.
    5. Add an Environment Variable: `NODE_VERSION` = `20`.
    6. Click **Save and Deploy**.
- **Why?**: Unlimited bandwidth and no phone verification required in most regions.

### 2. Netlify
- **Cost**: $0 (Starter Plan).
- **Setup**: Connect your GitHub repository. Netlify automatically detects Next.js. Select the default settings.
- **Why?**: Extremely user-friendly for startups with no credit card requirement on the free tier.

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
1. **Deploy Modules**: Add a "Visibility Schedule" to hide materials until a specific date.
2. **Flash Test Banks**: Schedule 100-item exams to appear only during designated mock board sessions.

Good luck, Future RMT!
