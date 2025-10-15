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

### Typical Data Flow (Example: User Registration)

1.  **UI Form Submission**: A user fills out the registration form in the Next.js frontend (`src/app/register/page.tsx`).
2.  **Frontend Validation**: The data is validated on the client-side using `zod` to ensure all fields (name, email, password) meet the required format.
3.  **Backend Request**: Upon successful validation, a request is sent to the backend. In this architecture, this is a direct call to Firebase Authentication (`createUserWithEmailAndPassword`) from a Client Component.
4.  **Database Storage**: After the user is created in Firebase Authentication, a corresponding user document is created in the Firestore `users` collection with a normalized schema.
5.  **UI Response**: A response is sent back to the user interface, which then shows a success toast notification and redirects the user to the login page.

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

### System Wireframes and Data Elements

This section provides a conceptual blueprint of the application's user interface and its underlying data structure.

#### 1. Authentication Wireframes

These screens handle user access and onboarding.

*   **Login Screen (`/login`)**
    *   **UI Components**: Email Input, Password Input, "Remember Me" Checkbox, Sign-In Button, Social Login Buttons (Google, GitHub), "Forgot Password" Link.
    *   **Data Elements**: `email` (string), `password` (string), `rememberMe` (boolean)

*   **Registration Screen (`/register`)**
    *   **UI Components**: First Name Input, Last Name Input, Email Input, Password Input, Create Account Button.
    *   **Data Elements**: `firstName` (string), `lastName` (string), `email` (string), `password` (string)

*   **Welcome/Landing Screen (`/`)**
    *   **UI Components**: Application Logo, Welcome Text, "Get Started" Button (links to Login).
    *   **Data Elements**: None (static page).

#### 2. Main Application Wireframes

These are the core screens users interact with after logging in.

*   **Main Dashboard (`/dashboard`)**
    *   **Description**: A role-based landing page that provides quick access to key features.
    *   **UI Components**: Welcome Message, Role-specific "Quick Access" Cards, "Recent Activity" list.
    *   **Data Elements**: `user.name` (string), `user.role` (string), `recentActivities` (array - currently static)

*   **LegalAI Chat (`/dashboard/case-management`)**
    *   **Description**: The primary conversational interface for interacting with the AI.
    *   **UI Components**: Chat Message History, Text Input with Command Menu (`/draft`, `/search`), Send Button, File Attachment Icon.
    *   **Data Elements**: `message` (string), `history` (array), `user.role` (string), `selectedLlm` (string)

*   **Document Review (`/dashboard/document-review`)**
    *   **Description**: Allows users to upload documents for AI-powered analysis.
    *   **UI Components**: File Upload Area, Text Area for instructions, "Analyze Document" Button, Results Panel.
    *   **Data Elements**: `documentDataUri` (string), `userQuery` (string), `analysisResults` (string)

*   **Case Law Search (`/dashboard/search`)**
    *   **Description**: A dedicated interface for searching the legal database.
    *   **UI Components**: Search Input, Filter Inputs (Court, Judge, Year), Search Button, Results Table.
    *   **Data Elements**: `query` (string), `filters` (object), `results` (array of `CaseLaw` objects)

#### 3. Admin-Specific Wireframes

These screens are for administrators to manage the application.

*   **Admin Dashboard (`/admin/dashboard`)**
    *   **Description**: An at-a-glance view of platform usage and analytics.
    *   **UI Components**: Stat Cards (Total Users), User Growth Chart, "Recent Signups" List.
    *   **Data Elements**: (Currently uses placeholder data) `totalUsers` (number), `newSignups` (number)

*   **User Management (`/admin/users`)**
    *   **Description**: A real-time table for viewing and managing all users.
    *   **UI Components**: User Search Bar, Table of Users, Action Menu (Edit, Delete).
    *   **Data Elements**: `users` (array of `User` objects from Firestore)