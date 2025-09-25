# System Architecture: Legal AI

This document outlines the system architecture, user roles, data models, and technology stack for the Legal AI application.

### System Architecture

*   **Frontend**: A modern web application built with **Next.js** using the App Router. The UI is created with **React**, **TypeScript**, and styled using **Tailwind CSS** and **ShadCN UI** for a professional component library.
*   **Backend**: Backend logic is handled by a combination of Next.js Server Components and Server Actions. For all generative AI features, the application uses **Genkit**, which orchestrates calls to Google's AI models.
*   **Database**: **Firebase Firestore** is used as the primary NoSQL database to store user data. **Firebase Authentication** is used for user sign-up, login, and session management.

### User Roles and Interactions

The system is designed with four distinct user roles, each with tailored interactions:

1.  **Admin**:
    *   **Interactions**: Accesses a dedicated admin dashboard to view analytics on user activity and manage all users in the system.
2.  **Advocate**:
    *   **Interactions**: Experiences a dashboard focused on professional legal work. They can use the AI chat for case management, perform in-depth document reviews, and search the case law database.
3.  **Student**:
    *   **Interactions**: Sees a dashboard geared towards legal studies. They can use the AI to understand complex topics, conduct legal research, review documents, and translate legal texts.
4.  **Public**:
    *   **Interactions**: Has access to a simplified dashboard designed for an introduction to the legal system. They can ask general legal questions and use the terminology explainer.

### Workflows and Navigation

*   **Authentication**: Users register or log in through a dedicated authentication flow (`/login`, `/register`). After login, they are directed to the appropriate dashboard based on their role.
*   **Dashboard Navigation**: Users navigate through a persistent sidebar that provides access to core features like AI chat, document review, and case law search.
*   **Admin Navigation**: Admins have a separate, secure layout with its own sidebar for navigating between the admin dashboard and user management pages.

### Technology Stack

*   **Frontend Framework**: Next.js (with React)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Components**: ShadCN UI
*   **Generative AI**: Genkit (with Google AI models)
*   **Database**: Firebase Firestore
*   **Authentication**: Firebase Authentication

### Data Models

*   **User Data (`users` collection)**:
    *   `uid` (string)
    *   `name` (string)
    *   `email` (string)
    *   `role` (string)
    *   `createdAt` (string)

*   **Transactional & System Data**: The application does not currently have dedicated Firestore collections for `cases`, `transactions`, `logs`, or `analytics`. The dashboards use placeholder data.

*   **External Data**: The primary external integration is with Google's AI services, managed via the **Genkit** library.
