# Project Details: Basic UI/Backend Structure Setup

This document outlines the tasks and evaluation criteria for setting up the basic UI and backend structure for the Legal AI application.

---

## 1. Task Breakdown

### Task 1: Setup Basic UI Structure (5 Marks)
*   **Objective**: Implement a modern, responsive, and scalable UI foundation using Next.js, ShadCN UI, and Tailwind CSS.
*   **Key Components**:
    *   **Root Layout (`src/app/layout.tsx`)**: Global layout with theme provider and Firebase integration.
    *   **Dashboard Layout (`src/app/dashboard/layout.tsx`)**: Main application shell with a persistent sidebar and header.
    *   **Admin Layout (`src/app/admin/layout.tsx`)**: Secure layout for administrative functions.
    *   **UI Components (`src/components/ui/`)**: Leverage pre-built, production-ready components from ShadCN for consistency (Buttons, Cards, Forms, etc.).
    *   **Styling (`src/app/globals.css`)**: Centralized theme and styling using CSS variables for easy customization.

### Task 2: Setup Backend Structure (5 Marks)
*   **Objective**: Establish a robust backend foundation using Next.js Server Actions, Genkit for AI, and Firebase for data and authentication.
*   **Key Components**:
    *   **Genkit Initialization (`src/ai/genkit.ts`)**: Centralized setup for the Genkit AI toolkit and Google AI models.
    *   **AI Flows (`src/ai/flows/`)**: Organized structure for individual AI capabilities (e.g., chat, document analysis).
    *   **Firebase Integration (`src/firebase/`)**: Modular setup for Firebase services (Auth, Firestore) with custom hooks (`useUser`, `useCollection`) for easy data access.
    *   **Service Layer (`src/services/`)**: Simulated services (e.g., `legal-search.ts`) to mimic data retrieval for RAG models.

### Task 3: Implement Authentication Flow (5 Marks)
*   **Objective**: Create a complete and secure user authentication system using Firebase Authentication.
*   **Key Components**:
    *   **Login Page (`src/app/login/page.tsx`)**: UI and logic for email/password and social (Google, GitHub) login.
    *   **Registration Page (`src/app/register/page.tsx`)**: UI and logic for new user sign-up, including creating a corresponding user document in Firestore.
    *   **User State Management (`src/firebase/use-user.ts`)**: A custom hook to provide the current user's authentication state across the application.
    *   **Role-based Redirection**: Logic to redirect users to the correct dashboard (e.g., `/admin` or `/dashboard`) based on their role after login.

### Task 4: Develop Core Feature Pages (5 Marks)
*   **Objective**: Build the primary feature pages with placeholder data and UI components, ready for full functionality integration.
*   **Key Components**:
    *   **Main Dashboard (`src/app/dashboard/page.tsx`)**: Role-based landing page with quick-access links.
    *   **LegalAI Chat (`src/app/dashboard/case-management/page.tsx`)**: The primary conversational interface.
    *   **Document Review (`src/app/dashboard/document-review/page.tsx`)**: File upload and analysis interface.
    *   **Admin User Management (`src/app/admin/users/page.tsx`)**: Real-time table for viewing and managing users from Firestore.

---

## 2. Evaluation Criteria

Each task will be evaluated based on the following criteria, with each criterion worth 2 marks.

### 1. Component Selection
*   **2 Marks (Excellent)**: All selected components (UI libraries, backend services) are optimal for the task, demonstrating a clear understanding of project requirements.
*   **1 Mark (Good)**: Most component selections are appropriate, but some alternatives might have been better.
*   **0 Marks (Needs Improvement)**: Component selection is poor or inappropriate for the task.

### 2. Hardware/Simulation Setup
*   **2 Marks (Excellent)**: The simulation environment is set up correctly and efficiently. The configuration is stable and well-documented.
*   **1 Mark (Good)**: The setup is functional but may have minor instabilities or could be configured more efficiently.
*   **0 Marks (Needs Improvement)**: The setup is non-functional or poorly configured.

### 3. Initial Code Development
*   **2 Marks (Excellent)**: The initial code is clean, well-structured, and follows best practices. The implementation is robust and scalable.
*   **1 Mark (Good)**: The code is functional but could be cleaner or better structured. Some minor issues may be present.
*   **0 Marks (Needs Improvement)**: The code is messy, poorly structured, or contains significant errors.

### 4. Working Demo
*   **2 Marks (Excellent)**: The feature demo is fully functional, intuitive, and bug-free. It perfectly showcases the intended functionality.
*   **1 Mark (Good)**: The demo is mostly functional but has some minor bugs or usability issues.
*   **0 Marks (Needs Improvement)**: The demo is non-functional, buggy, or fails to demonstrate the core feature.
