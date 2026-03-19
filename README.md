
# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for Free (Zero-Cost Startup Guide)

You can host this entire platform for **$0/month** using **Firebase App Hosting (Spark Plan)** and **GitHub**. This is the ideal setup for a startup.

### 1. Create a GitHub Repository
- Log in to [GitHub](https://github.com) and create a new repository (Public or Private).
- Push this code from your workstation to your new repository:
  ```bash
  git init
  git add .
  git commit -m "initial commit"
  git remote add origin <your-repo-url>
  git push -u origin main
  ```

### 2. Connect to Firebase (The Spark Plan)
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Select your project (`studio-7922254713-4e326`).
- **Important**: Ensure your project is on the **Spark Plan** (Free). You can check this in the "Usage and Billing" section.
- Navigate to **Build > App Hosting** in the left sidebar.
- Click **Get Started** and connect your GitHub account.
- Select your repository and the `main` branch.
- Firebase App Hosting will automatically detect the Next.js framework.

### 3. Deploy & Scale
- Click **Finish and Deploy**.
- Firebase will provide you with a secure `web.app` or `firebaseapp.com` domain.
- **Continuous Deployment**: Every time you push a change to GitHub, your site will automatically update for free.

## 👥 How to Manage Students

As the administrator, you manage your users via the **Firebase Console**:

1. **View Enrollments**: Go to **Authentication > Users** to see a list of every registered student.
2. **Password Resets**: If a student forgets their access key, you can trigger a reset email or manually change it from the console.
3. **Revoking Access**: To stop a student from accessing the platform, you can "Disable" or "Delete" their account in the Authentication tab.
4. **Admin Privileges**: To grant Admin access to another user, ensure their email contains the word "admin" (e.g., `admin.staff@synapse.com`).

## 🛠 Core Systems
- **Synapse Engine**: "Blind" assessments where rationales are only shown in **Analysis Mode** after completion.
- **Scheduling**: Admins can set "Visibility Schedules" for modules and quizzes so they only appear at specific times.
- **Reviewee Profile**: Professional identity tracking for names, institutions, and historical scores.

Good day, Future RMT!
