
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

### 📦 WHERE AND HOW TO PUSH (The "Where" Guide)

You push your code to **GitHub**. Think of GitHub as the "Cloud storage" for your code that Cloudflare "reads" from.

1.  **Create a GitHub Repo**: Go to [github.com/new](https://github.com/new) and create a repository named `synapse-rmt`.
2.  **Initialize Git** (in your terminal):
    ```bash
    git init
    ```
3.  **Add your files**:
    ```bash
    git add .
    ```
4.  **Commit your changes**:
    ```bash
    git commit -m "Initial Synapse Startup Deploy"
    ```
5.  **Rename branch to main**:
    ```bash
    git branch -M main
    ```
6.  **Connect to your GitHub repo**:
    (Replace `YOUR_URL` with the link GitHub gives you, e.g., `https://github.com/username/synapse-rmt.git`)
    ```bash
    git remote add origin YOUR_URL
    ```
7.  **Push the code**:
    ```bash
    git push -u origin main
    ```

### ⚠️ Troubleshooting: "No Production Branch"
If the branch dropdown is empty in Cloudflare:
- **Push your code first**: Cloudflare cannot see a branch if there is no code on GitHub.
- **Check the branch name**: Ensure you ran `git branch -M main`.
- **Refresh**: Once you push, Cloudflare will automatically see the `main` branch.

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
