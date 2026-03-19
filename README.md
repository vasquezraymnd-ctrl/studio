# Synapse | RMT Medical Study Platform

A high-performance "Spotify-style" review application for Clinical Laboratory Science students.

## 🚀 How to Publish for Free

You can host this entire platform for free using **Firebase App Hosting** and **GitHub**.

### 1. Create a GitHub Repository
- Go to [GitHub](https://github.com) and create a new repository (Public or Private).
- Push this code to your repository:
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
- Firebase will automatically detect the Next.js setup and the `apphosting.yaml` file.

### 3. Deploy
- Click **Finish and Deploy**.
- Firebase will provide you with a unique `web.app` or `firebaseapp.com` domain (e.g., `synapse-rmt.web.app`).
- Every time you push new code to GitHub, your app will automatically update.

## 🛠 Features
- **Synapse Engine**: 100-item skippable assessments with instant rationalization.
- **Reviewee Profile**: Track scores, institutions, and progress.
- **Global Library**: Searchable database of all deployed study modules.
- **Admin Portal**: Deploy new materials and flash test banks via JSON.

## 🩺 Subject Navigation
The dashboard is optimized for the 6 core CLS subjects:
- Clinical Chemistry
- Microbiology & Parasitology
- Hematology
- Blood Banking & Serology
- Clinical Microscopy
- MT Laws & Histopath

Good day, Future RMT!
