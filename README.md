
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for $0 (Startup Guide)

To host your app for free without phone verification issues, use **Cloudflare Pages**.

### 🛠 Cloudflare Pages Deployment Steps

1.  **Go to Workers & Pages**: In your Cloudflare dashboard, click **Workers & Pages** in the left sidebar.
2.  **Select Pages**: Click the **Pages** tab at the top. Do NOT use "Workers".
3.  **Connect to Git**: Click **Connect to Git**.
4.  **Connect GitHub**: Select your `mobilesynapse` repository.
5.  **Set up builds and deployments**: 
    - **Framework preset**: Select **Next.js**.
    - **Build command**: `npm run build`
    - **Output directory**: `.vercel/output`
6.  **Environment Variables**: Add `NODE_VERSION` with value `20`.
7.  **Save and Deploy**.

### 📦 HOW TO PUSH YOUR CODE (The Commands)

Run these commands in your terminal to send your code to the GitHub repository shown in your screenshot:

```bash
# 1. Initialize git
git init

# 2. Add all your files
git add .

# 3. Commit the changes
git commit -m "Initial Synapse Startup Deploy"

# 4. Create the main branch
git branch -M main

# 5. Connect to your specific GitHub repo
git remote add origin https://github.com/vasquezraymnd-ctrl/mobilesynapse.git

# 6. Push the code
git push -u origin main
```

### ⚠️ Troubleshooting: "No Production Branch"
If Cloudflare doesn't see a branch:
- **Push first**: Cloudflare cannot see a branch if the repository is empty. Run the commands above.
- **Refresh**: Once the push is successful, the `main` branch will appear in Cloudflare.

## 👥 How to Manage Students

### Admin Access
Any email containing the word "admin" (e.g., `admin.user@gmail.com`) automatically gains access to the **Command Center**.

### Student Access
Manage users via the **Firebase Console** under **Authentication > Users**.
