
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🎉 DEPLOYMENT SUCCESSFUL
Your project is now live at: `https://studio-9pm.pages.dev` (or your specific Cloudflare URL).

### 🚨 CRITICAL FIX: Node.JS Compatibility Error
If you see a "Node.JS Compatibility Error" on your live site, follow these steps:
1. Log in to **Cloudflare Dashboard** -> **Workers & Pages** -> Your Project.
2. Go to **Settings** -> **Functions** -> **Compatibility Flags**.
3. Add the `nodejs_compat` flag to both **Production** and **Preview**.
4. Go to **Deployments** and click **Retry Deployment** on your latest build.

---

### 🚀 POST-DEPLOYMENT STEPS
1. **Access the Portal**: Go to your live URL.
2. **Admin Access**: Sign in with an email containing "admin" (e.g., `admin@synapse.edu`) to unlock the **Command Center**.
3. **Add Content**: Use the Command Center to upload real study modules and bulk JSON test banks.
4. **Student Enrollment**: Students can now register directly on your live site.

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
git commit -m "Describe your change here"
git push origin main
```
Cloudflare will automatically detect the push and rebuild your site in ~1 minute.

---

### ⚠️ Troubleshooting: "Edge Runtime Error"
If your build fails, ensure every dynamic page (like `[subjectId]`) has this at the top:
`export const runtime = 'edge';`
(The AI has already applied this fix to your current files).
