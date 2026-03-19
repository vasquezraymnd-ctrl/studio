# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for Free

You can host this entire platform for free using **Firebase App Hosting** (Spark Plan) and **GitHub**.

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

### 2. Connect to Firebase App Hosting
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Select your project (`studio-7922254713-4e326`).
- Navigate to **Build > App Hosting** in the left sidebar.
- Click **Get Started** and connect your GitHub account.
- Select your repository and the `main` branch.
- Firebase App Hosting will automatically detect the Next.js framework and use your `apphosting.yaml` configuration.

### 3. Deploy & Monitor
- Click **Finish and Deploy**.
- Firebase will provide you with a secure `web.app` or `firebaseapp.com` domain.
- **Automatic Updates**: Every time you push changes to your GitHub `main` branch, Firebase will automatically build and re-deploy your app.

## 🛠 Core Systems
- **Synapse Engine**: 100-item skippable assessments with a confirm-to-submit workflow and instant rationalization.
- **Reviewee Profile**: Personalized identity tracking for names, institutions, and historical assessment scores.
- **Global Library**: A searchable, centralized hub for all deployed study modules.
- **Command Center**: Admin-only portal for deploying study materials and flashing JSON-based test banks.

## 🩺 Subject Specializations
The platform is optimized for the 6 core Board Exam subjects:
- **Clinical Chemistry**
- **Microbiology & Parasitology**
- **Hematology**
- **Blood Banking & Serology**
- **Clinical Microscopy**
- **MT Laws & Histopath**

Good day, Future RMT!
