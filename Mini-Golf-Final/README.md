# ⛳ Web Golf

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

A modern, 3D minigolf game built for the web. This project, created for **CloneFest 2025**, combines realistic physics, an interactive 3D environment, and a clean user interface to deliver a polished and engaging golf experience.

---

## 📷 Screenshot


*Replace with an actual screenshot of your project.*

---

## 🌟 Live Demo
🔗 **Production:** [https://your-deployment-url.com](https://your-deployment-url.com) *(Replace with your deployment link)*

---

## 📋 Table of Contents
- ✨ Features
- 🚀 Tech Stack
- ⚡ Quick Start
- 🔧 Installation & Setup
- 📂 Project Structure
- 🎮 How to Play
- 🏆 CloneFest 2025
- 🤝 Contributing

---

## ✨ Features

### 🎯 Core Gameplay
✅ **Realistic 3D Environment**: Immerse yourself in a 3D world rendered with Three.js, complete with dynamic lighting and shadows.  
✅ **Physics-Based Ball Movement**: Experience satisfying ball mechanics, including velocity, friction, collisions, and sand traps.  
✅ **Intuitive Controls**: Simple click-and-drag controls for aiming and power, with a color-changing power bar and aim indicator.  
✅ **Interactive Camera**: Inspect the course with orbit, pan, and zoom controls. The camera automatically follows the ball during play.  
✅ **Multiple Levels**: Play through a variety of challenging courses, each with unique layouts, obstacles, and terrain.  

### 🎨 UI & UX
✅ **Real-time Game UI**: A clean, non-intrusive UI displays the current level, par, stroke count, and shot power.  
✅ **Persistent Scoring**: Your best score for each level is saved to your account, allowing you to track your progress.  
✅ **Responsive Design**: Enjoy a seamless experience on both desktop and mobile devices, with controls adapted for touchscreens.  
✅ **User Authentication**: Secure sign-up and login functionality powered by Supabase Auth.

---

## 🚀 Tech Stack

**Frontend**  
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **3D Rendering**: [Three.js](https://threejs.org/)
- **UI Library**: [React](https://reactjs.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

**Backend & Database**  
- **Platform**: [Supabase](https://supabase.io/)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for any future asset needs

---

## ⚡ Quick Start

**Prerequisites**  
- Node.js (v18 or later)
- npm, yarn, or pnpm
- A Supabase account

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/web-golf.git
cd web-golf
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Environment Variables**
Create a `.env.local` file in the root of your project and add your Supabase project credentials.
```.env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **Set Up Supabase Database**
Run the following SQL script in your Supabase project's SQL Editor to create the necessary tables and functions.
```sql
-- Create the scores table
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id INT NOT NULL,
  strokes INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, level_id)
);

-- Enable Row Level Security
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own scores
CREATE POLICY "Allow users to view their own scores"
ON scores FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for users to insert/update their scores
CREATE POLICY "Allow users to insert/update their own scores"
ON scores FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own scores"
ON scores FOR UPDATE
USING (auth.uid() = user_id);

-- Create the database function to update scores
CREATE OR REPLACE FUNCTION update_score(level_id_in INT, strokes_in INT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.scores (user_id, level_id, strokes)
  VALUES (auth.uid(), level_id_in, strokes_in)
  ON CONFLICT (user_id, level_id)
  DO UPDATE SET
    strokes = LEAST(scores.strokes, strokes_in);
END;
$$ LANGUAGE plpgsql;
```

5. **Run the Development Server**
```bash
npm run dev
```
The application will be available at `http://localhost:9002`.

---

## 📂 Project Structure
```
src
├── app/                  # Next.js App Router pages
│   ├── (game)/           # Layout and pages for the game itself
│   ├── (main)/           # Layout and pages for the main app (homepage, levels)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage component
├── components/           # Reusable React components
│   ├── game/             # Components specific to the game UI and canvas
│   ├── layout/           # Header, navigation, etc.
│   └── ui/               # ShadCN UI components
├── lib/                  # Helper functions, constants, and Supabase client
│   ├── levels.ts         # Definitions for all golf course levels
│   ├── supabase/         # Supabase client, server, and middleware logic
│   └── utils.ts          # Utility functions
└── public/               # Static assets (images, sounds)
```

---

## 🎮 How to Play

### Objective
The goal is simple: get the ball into the hole in as few strokes as possible. Try to beat the 'Par' for each course!

### Desktop Controls
- **Aim & Shoot**: **Left-click and drag** away from the ball to aim. The direction and distance determine the aim and power. **Release** to shoot.
- **Camera Orbit**: **Left-click and drag** to orbit the camera around the current view.

### Mobile Controls
- **Aim & Shoot**: **Tap and drag** on the screen to aim and set power. **Release** your finger to shoot.
- **Camera Orbit**: Use a **one-finger drag** to orbit the camera.

---

## 🏆 CloneFest 2025

This project fulfills the core requirements of the challenge by building a complete, functional web application with modern technologies.

- ✅ **Requirements**: Complete. A fully playable 3D golf game with authentication, persistent scoring, and multiple levels.

**Highlights**
- **Modern Tech Stack**: Leverages the Next.js App Router, Server Components, and TypeScript for a robust and performant application.
- **Interactive 3D Graphics**: Uses Three.js to create a dynamic and engaging 3D world in the browser.
- **Seamless Backend**: Integrates Supabase for authentication and database management, providing a complete backend solution with minimal setup.

---

## 🤝 Contributing
Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

---

**Contributors**
- Kathan1010 - Lead Developer
- Tapan Gupta — Contributor
- Dhruv Patel - Contributor

---

Built with ❤️ for CloneFest 2025.
