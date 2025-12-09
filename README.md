
# 🚀 Josep Núñez Riba | Tech Strategy Portfolio

<div align="center">
  
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  
  <p align="center">
    <b>Professional portfolio representing expertise in Digital Transformation, Enterprise Architecture, and Cloud Strategy.</b>
  </p>
</div>

---

## 📋 Overview

This project is a modern, high-performance personal portfolio website designed to showcase professional experience, certifications, and strategic projects. It is built with a focus on **clean architecture**, **accessibility**, and **user experience**.

The site serves as a central hub for professional branding, featuring a multi-language interface (CA/ES/EN) and an interactive timeline of achievements.

## ✨ Key Features

*   **🌍 Multi-language Support:** robust i18n implementation using React Context, supporting Catalan, Spanish, and English seamlessly.
*   **📱 Fully Responsive:** "Mobile-first" design approach using Tailwind CSS, ensuring perfect rendering on all devices.
*   **🎨 Modern UI/UX:**
    *   Glassmorphism effects and smooth gradients.
    *   Interactive "Infinite Scroll" for certifications.
    *   Smart auto-scroll navigation for better usability.
*   **⚡ Performance Optimized:** Built with Vite for lightning-fast HMR and optimized production builds.
*   **🧩 Modular Architecture:** Strict separation between UI Components (`/components`) and Content Data (`aboutMe.ts`, `experienceInfo.ts`), making updates easy without touching the code.

## 🛠️ Tech Stack

*   **Core:** React 18, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Deployment:** GitHub Pages (via GitHub Actions)
*   **Fonts:** Inter (Sans) & Playfair Display (Serif)

## 📂 Project Structure

```bash
src/
├── components/      # UI Components (Hero, Experience, Education...)
├── context/         # React Context (Language State)
├── data/            # (Conceptual) Data files separated from logic
│   ├── aboutMe.ts
│   ├── experienceInfo.ts
│   ├── constants.ts
│   └── translations.ts
├── types.ts         # TypeScript Interfaces
└── main.tsx         # Entry point
```

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JosepNR97/JNR.git
    cd JNR
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 📝 Content Management

Updating the portfolio content does not require modifying React components. All data is centralized:

*   **Personal Info & Nav:** `src/aboutMe.ts`
*   **Work History:** `src/experienceInfo.ts`
*   **Images & Links:** `src/constants.ts`

## 📄 License

© 2025 Josep Núñez Riba. All rights reserved.
