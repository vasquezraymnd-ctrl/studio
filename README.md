
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🎉 DEPLOYMENT SUCCESSFUL
Your project is now live! Follow the steps below to manage and update your site.

### 🚨 CRITICAL FIX: Node.JS Compatibility Error
If you see a "Node.JS Compatibility Error" on your live site, follow these steps:
1. Log in to **Cloudflare Dashboard** -> **Workers & Pages** -> Your Project.
2. Go to **Settings** -> **Functions** -> **Compatibility Flags**.
3. In the input field, type exactly: **`nodejs_compat`**
4. Add this flag to both **Production** and **Preview**.
5. **Redeploy**: Go to the **Deployments** tab and click **Retry Deployment** on your latest build, OR push a new commit from the Editor.

---

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
git commit -m "Apply latest updates"
git push origin main
```
Cloudflare will automatically detect the push and rebuild your site in ~1 minute.

---

### 🚀 POST-DEPLOYMENT STEPS
1. **Access the Portal**: Go to your live URL.
2. **Admin Access**: Sign in with an email containing "admin" (e.g., `admin@synapse.edu`) to unlock the **Command Center**.
3. **Add Content**: Use the Command Center to upload real study modules and bulk JSON test banks.
