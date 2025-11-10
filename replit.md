# Kastor - Data Detective Game

## Overview

Kastor is an interactive educational game that teaches data analysis and investigation skills through detective-style case solving. Players take on the role of a data detective, investigating game-related incidents by analyzing charts, logs, and data patterns. The application features a chat-based narrative interface with multiple cases of increasing difficulty, teaching concepts like data integrity, log analysis, and pattern recognition.

The game includes an interactive Evidence Board where players can organize evidence nodes, drag them around, and create connections between related pieces to visualize relationships. The board uses a clean, modern design consistent with the chat interface style.

The game is built as a full-stack web application with a React frontend and Express backend, designed to run on Replit with support for PostgreSQL database persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**State Management**: The application uses Zustand for state management with two primary stores:
- `useDetectiveGame`: Manages game state including current case, progress, evidence collection, scoring, and achievements. Persists game progress to localStorage for continuity across sessions.
- `useAudio`: Handles audio playback for background music and sound effects

**UI Component Library**: Radix UI primitives with custom styled components using Tailwind CSS for a dark detective-themed interface. The design system uses CSS custom properties for theming with a slate/amber color scheme.

**3D Capabilities**: Integration of React Three Fiber and Drei for potential 3D scene rendering, though currently focused on 2D detective interface

**Animation**: Framer Motion for smooth transitions and interactive feedback throughout the game

**Data Visualization**: Recharts library for rendering interactive charts and graphs that present case data to players

**Design Pattern**: Component-based architecture with clear separation between game logic (stores), presentation (components), and data (case story files)

**Evidence Board System**: Interactive node-based interface using @dnd-kit for drag-and-drop functionality. Features:
- Draggable evidence nodes with type-based color coding (blue/green/purple/pink/orange)
- SVG-based connection lines between related evidence
- Percentage-based positioning (0-1 coordinates) for responsive layout
- Auto-layout grid system for new evidence placement
- ResizeObserver for dynamic dimension measurement
- Board state persisted to localStorage with debounced saves
- Clean, minimal UI design matching chat interface (slate color scheme)

### Backend Architecture

**Framework**: Express.js server with TypeScript

**Development Setup**: Custom Vite middleware integration for hot module replacement in development mode

**Storage Interface**: Abstracted storage layer with in-memory implementation (`MemStorage`) that can be swapped for database-backed implementation. The interface defines CRUD operations for user management.

**API Structure**: RESTful API design with `/api` prefix for all endpoints (routes to be implemented)

**Production Build**: Uses esbuild to bundle server code for production deployment

### Data Architecture

**Case Story System**: Story-driven progression with node-based narrative structure. Each case consists of multiple nodes representing different stages of investigation.

**Story Node Structure**:
- Messages with different speakers (detective, client, narrator, system)
- Data visualizations (charts, tables, logs)
- Multiple-choice questions with correctness validation
- Evidence and clue collection mechanics
- Auto-advance capabilities for narrative flow

**Progress Persistence**: Game state persists to localStorage including:
- Current case and node position
- Collected clues and evidence
- Score and stars earned
- Unlocked cases and achievements

**Evidence Types**: Structured evidence system with multiple types (CHARACTER, DATA, DIALOGUE, PHOTO, DOCUMENT) each with specific metadata

### External Dependencies

**Database**: 
- Drizzle ORM configured for PostgreSQL (via `@neondatabase/serverless`)
- Schema defined in `shared/schema.ts` with user table
- Migration support through drizzle-kit

**Third-Party UI Libraries**:
- Radix UI components for accessible, unstyled primitives
- Tailwind CSS for utility-first styling
- Framer Motion for animations
- Lucide React for icons

**Development Tools**:
- TypeScript for type safety across client and server
- Vite with custom configuration for client bundling
- tsx for server-side TypeScript execution
- GLSL shader support via vite-plugin-glsl

**Asset Handling**: Support for 3D models (GLTF/GLB) and audio files (MP3, OGG, WAV)

**Internationalization**: Content currently in Korean (ko) as evidenced by HTML lang attribute and game text

**Query Management**: TanStack Query (React Query) configured with custom fetch utilities for API communication

**Session Management**: Dependencies suggest session handling capabilities (connect-pg-simple for PostgreSQL session store)