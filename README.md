
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for $0 (Startup Guide)

To host your app for free without phone verification issues, use **Cloudflare Pages**.

### 💻 WHERE IS MY TERMINAL?
Look at the **bottom of your screen** in Firebase Studio. You should see a tab labeled "Terminal". 
- If you don't see it, press **`Ctrl + `** (the key next to '1') on your keyboard.
- Or go to the top menu: **Terminal > New Terminal**.

### 📦 HOW TO PUSH YOUR CODE (The Commands)
Once the terminal is open, copy and paste these commands one by one and press Enter:

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
# Replace the URL with your actual GitHub repo URL
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. Push the code
git push -u origin main
```

### 🛠 Cloudflare Pages Deployment Steps (AFTER PUSHING)

1.  **Go to Workers & Pages**: In your Cloudflare dashboard, click **Workers & Pages** in the left sidebar.
2.  **Select Pages**: Click the **Pages** tab at the top. (Do NOT stay on "Workers").
3.  **Connect to Git**: Click **Connect to Git**.
4.  **Connect GitHub**: Select your repository.
5.  **Set up builds and deployments**: 
    - **Framework preset**: Select **Next.js**.
    - **Build command**: `npm run build`
    - **Output directory**: `.vercel/output`
6.  **Environment Variables**: Add `NODE_VERSION` with value `20`.
7.  **Save and Deploy**.

### ⚠️ Troubleshooting: "No Production Branch"
If Cloudflare doesn't see a branch:
- **Push first**: Cloudflare cannot see a branch if the repository is empty. Run the Terminal commands above first.
- **Refresh**: Once the push is successful, the `main` branch will appear in Cloudflare.

## 👥 How to Manage Students

### Admin Access
Any email containing the word "admin" (e.g., `admin.user@gmail.com`) automatically gains access to the **Command Center**.

### Student Access
Manage users via the **Firebase Console** under **Authentication > Users**.
