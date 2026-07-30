import type { ExperienceType } from "@/lib/content";

// Migrated from Firestore (Fase 2). Sorted by year, descending — matches
// the previous `.orderBy("year", "desc")` Firestore query.
export const experiences: ExperienceType[] = [
  {
    "id": "u3v1hMKOWjtpgWATMfSv",
    "title": "IT Staff & Web Administrator",
    "company": "LPPM Universitas Syiah Kuala",
    "year": "2025 - Present",
    "logo": "/experience/u3v1hMKOWjtpgWATMfSv.png",
    "description": "I run the IT side of things at LPPM USK, from server access and incident response to keeping 90+ academic journals online at publications.usk.ac.id. I also led the zero-data-loss migration from OJS 2 to OJS 3, and built out the backup and monitoring systems behind it."
  },
  {
    "id": "1sugNhLGWSOxIfZqDX02",
    "title": "Full-Stack Developer Intern",
    "company": "BMKG Aceh Besar",
    "year": "2024",
    "logo": "/experience/1sugNhLGWSOxIfZqDX02.webp",
    "description": "Spent this internship embedded with the BMKG Aceh Besar team, pitching in on whatever came up day to day. The main deliverable was a leave management system built with React, Tailwind, Express, and MySQL, covering both employee and admin workflows."
  },
  {
    "id": "BsgBEOpesyBTDoPq9Vc0",
    "title": "Mobile Developer Student",
    "company": "Bangkit Academy",
    "year": "2024",
    "logo": "/experience/BsgBEOpesyBTDoPq9Vc0.jpg",
    "description": "One of two mobile developers on MediGuide, an AI health chatbot built as a capstone project with a team of 7. I handled the Android side end to end, from Figma wireframes through implementation, and integrated the chatbot model handed off by the ML and Cloud Computing teams."
  },
  {
    "id": "FQqFUNx0BhBvD6bDMWQs",
    "title": "Informatics Graduate",
    "company": "Universitas Syiah Kuala",
    "year": "2021 - 2025",
    "logo": "/experience/FQqFUNx0BhBvD6bDMWQs.png",
    "description": "Graduated with a Bachelor's degree in Informatics, Cum Laude. Along the way I picked up practical experience teaching, organizing, and building things outside the classroom, which shaped how I work just as much as the coursework did."
  }
];
