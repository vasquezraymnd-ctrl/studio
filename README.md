
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🎉 DEPLOYMENT SUCCESSFUL
Your project is now live! Follow the steps below to manage and update your site.

### 💻 WHERE IS MY TERMINAL?
The terminal is **NOT** inside the running prototype. It is inside the **Editor**.
1. **Switch to Editor**: Click the "Editor" tab in your workspace.
2. **Reveal Panel**: Look at the very bottom of the screen for a thin horizontal bar and drag it up.
3. **Shortcut**: Press **`Ctrl + `** (the backtick key) to toggle it.
4. **Top Menu**: Go to **Terminal > New Terminal**.

### 📦 PUSHING NEW UPDATES
Whenever you click "Apply Changes" from the AI, you must run these in the Editor terminal:
```bash
git add .
git commit -m "Remove AI features and refine vetting pipeline"
git push origin main
```
Cloudflare will automatically detect the push and rebuild your site in ~1 minute.

---

### 🚀 POST-DEPLOYMENT STEPS
1. **Access the Portal**: Go to your live URL.
2. **Admin Access**: Sign in with an email containing "admin" (e.g., `admin@synapse.edu`) to unlock the **Command Center**.
3. **Manual Vetting**: Use the **Command Center** to upload vetted JSON test banks. This ensures all content is high-yield and secure from student exploitation.
4. **Schedule Releases**: Use the "Visibility Schedule" to time your module releases for specific study rotations.
