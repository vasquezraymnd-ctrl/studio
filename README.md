
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for $0 (Startup Guide)

If you are facing hurdles with credit cards or phone verification on other platforms, use **Cloudflare Pages**. It is free, fast, and does not typically require strict verification for hobby/startup projects.

### 🛠 Cloudflare Pages Deployment Steps

1.  **Go to Workers & Pages**: In your Cloudflare dashboard, click **Workers & Pages** in the left sidebar.
2.  **Select Pages**: Do NOT create a "Worker". Click the **Pages** tab at the top of the main area.
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

### 📦 How to Push to GitHub (The "HOW DO I PUSH" Guide)

If Cloudflare says there are "No Branches", you must push your code from your computer to GitHub using these commands in your terminal:

1.  **Initialize Git** (if not already done):
    ```bash
    git init
    ```
2.  **Add your files**:
    ```bash
    git add .
    ```
3.  **Commit your changes**:
    ```bash
    git commit -m "Initial Synapse Startup Deploy"
    ```
4.  **Rename branch to main**:
    ```bash
    git branch -M main
    ```
5.  **Connect to your GitHub repo**:
    (Replace `YOUR_URL` with the link GitHub gives you, e.g., `https://github.com/username/repo.git`)
    ```bash
    git remote add origin YOUR_URL
    ```
6.  **Push the code**:
    ```bash
    git push -u origin main
    ```

### ⚠️ Troubleshooting: "No Production Branch"
If the branch dropdown is empty:
- **Push your code first**: You must follow the "How to Push" steps above before Cloudflare can see any branches.
- **Check the branch name**: Ensure you have a branch named `main`.
- **Refresh**: Once you push your code, refresh the Cloudflare setup page.

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
