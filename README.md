
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for $0 (Startup Guide)

To host your app for free without phone verification issues, use **Cloudflare Pages**.

### 💻 WHERE IS MY TERMINAL?
The terminal is **NOT** inside the running app (the prototype). It is inside the **Editor**.
1. **Switch to Editor:** Look for the "Editor" tab or button in your Firebase Studio interface to see your code.
2. **Look at the bottom:** Once in the Editor, look at the very bottom of the screen for a tab labeled "Terminal".
3. **If you don't see it:** Look for a small horizontal bar at the very bottom and drag it up.
4. **Shortcut:** Press **`Ctrl + `** (the key next to '1') to toggle it.
5. **Top Menu:** Go to **Terminal > New Terminal** in the top navigation bar.

### 📦 FIRST TIME PUSH TO GITHUB (The Commands)
Once the terminal is open in the **Editor**, copy and paste these commands exactly as shown:

```bash
# 1. Initialize git
git init

# 2. Add your files
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

### 🛠 Cloudflare Pages Deployment Steps (AFTER PUSHING)

1. **Go to Workers & Pages**: In your Cloudflare dashboard, click **Workers & Pages** in the left sidebar.
2. **Select Pages**: Click the **Pages** tab at the top. (Do NOT stay on "Workers").
3. **Connect to Git**: Click **Connect to Git**.
4. **Connect GitHub**: Select your repository.
5. **Set up builds and deployments**: 
    - **Framework preset**: Select **Next.js**.
    - **Build command**: `npm run build`
    - **Output directory**: `.vercel/output`
6. **Environment Variables**: Add `NODE_VERSION` with value `20`.
7. **Save and Deploy**.

### ⚠️ Troubleshooting: "No Production Branch"
If Cloudflare doesn't see a branch:
- **Push first**: Cloudflare cannot see a branch if the repository is empty. Run the Terminal commands above first.
- **Refresh**: Once the push is successful, the `main` branch will appear in Cloudflare.
