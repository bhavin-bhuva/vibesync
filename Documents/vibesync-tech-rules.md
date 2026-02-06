# VibeSync - Technical Rules & Guidelines

**Version:** 1.0  
**Last Updated:** January 22, 2026  
**Status:** Active  
**Applies To:** All VibeSync development

---

## Table of Contents

1. [Introduction](#introduction)
2. [Technology Stack Standards](#technology-stack-standards)
3. [Project Structure](#project-structure)
4. [Code Style & Conventions](#code-style--conventions)
5. [TypeScript Guidelines](#typescript-guidelines)
6. [React & Component Guidelines](#react--component-guidelines)
7. [Routing & Navigation](#routing--navigation)
8. [State Management](#state-management)
9. [Styling Guidelines](#styling-guidelines)
10. [Backend Architecture & Standards](#backend-architecture--standards)
11. [Performance Standards](#performance-standards)
12. [Security Guidelines](#security-guidelines)
13. [Testing Requirements](#testing-requirements)
14. [Error Handling](#error-handling)
15. [Accessibility Standards](#accessibility-standards)
16. [Git & Version Control](#git--version-control)
17. [Code Review Process](#code-review-process)
18. [Documentation Standards](#documentation-standards)

---

## Introduction

This document defines the technical standards, best practices, and coding conventions for the VibeSync project. All developers must adhere to these guidelines to ensure code quality, maintainability, and consistency across the codebase.

### Purpose
- Maintain code consistency across the team
- Ensure high code quality and maintainability
- Prevent common bugs and anti-patterns
- Facilitate code reviews and onboarding
- Establish performance and security baselines

### Scope
These rules apply to:
- All frontend code (React, TypeScript)
- All backend code (when implemented)
- Configuration files
- Documentation
- Git commits and pull requests

---

## Technology Stack Standards

### Required Versions

#### Frontend
- **Node.js:** 18.x or higher (LTS recommended)
- **npm:** 9.x or higher
- **React:** 19.2.3 (exact version)
- **React Router:** 7.12.0 (exact version)
- **TypeScript:** 5.9.2 or higher
- **TailwindCSS:** 4.1.13 or higher
- **Vite:** 7.1.7 or higher

#### Development Tools
- **TypeScript Compiler:** Use project's tsconfig.json
- **ESLint:** (To be configured)
- **Prettier:** (To be configured)

### Approved Libraries

#### Core Dependencies
✅ **Allowed:**
- `react` - UI framework
- `react-dom` - React DOM renderer
- `react-router` - Routing library
- `@react-router/node` - Server-side routing
- `@react-router/serve` - Production server
- `tailwindcss` - Styling framework
- `html5-qrcode` - QR code scanning
- `react-qr-code` - QR code generation
- `isbot` - Bot detection

#### Development Dependencies
✅ **Allowed:**
- `@react-router/dev` - Development tools
- `@tailwindcss/vite` - Vite integration
- `@types/*` - TypeScript type definitions
- `vite` - Build tool
- `vite-tsconfig-paths` - Path resolution
- `typescript` - Type checking

❌ **Prohibited Without Approval:**
- jQuery or similar DOM manipulation libraries
- Moment.js (use native Date or date-fns)
- Lodash (use native ES6+ methods where possible)
- CSS-in-JS libraries (styled-components, emotion) - Use TailwindCSS
- Redux (use Context API unless justified)

### Adding New Dependencies

**Process:**
1. Check if functionality can be achieved with existing dependencies
2. Evaluate bundle size impact (use bundlephobia.com)
3. Check maintenance status (last update, GitHub stars, issues)
4. Verify TypeScript support
5. Get approval from tech lead
6. Document reason in PR description

**Criteria for Approval:**
- Active maintenance (updated within 6 months)
- Good TypeScript support
- Minimal bundle size impact (< 50KB gzipped)
- No security vulnerabilities
- Compatible with React 19 and React Router 7

---

## Project Structure

### Directory Organization

```
vibesync/
├── app/                          # Application source code
│   ├── components/               # Reusable components
│   │   ├── auth-layout.tsx      # Auth-specific layouts
│   │   ├── chat/                # Chat feature components
│   │   ├── friends/             # Friend management components
│   │   ├── status/              # Status feature components
│   │   └── ui/                  # Generic UI components
│   ├── contexts/                # React Context providers
│   │   └── theme-context.tsx   # Theme management
│   ├── routes/                  # Route components
│   │   ├── *.tsx               # Route files
│   │   └── +types/             # Generated route types
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions (future)
│   ├── hooks/                   # Custom React hooks (future)
│   ├── services/                # API services (future)
│   ├── app.css                  # Global styles
│   ├── root.tsx                 # Root component
│   └── routes.ts                # Route configuration
├── public/                       # Static assets
├── .react-router/               # Generated files (gitignored)
├── node_modules/                # Dependencies (gitignored)
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── react-router.config.ts       # React Router configuration
├── vibesync-prd.md              # Product Requirements Document
└── vibesync-tech-rules.md       # This document
```

### File Naming Conventions

#### Components
- **Format:** `kebab-case.tsx`
- **Examples:** `message-input.tsx`, `qr-scanner.tsx`, `user-profile-bar.tsx`
- **Rule:** Use descriptive names that indicate component purpose

#### Routes
- **Format:** `kebab-case.tsx`
- **Examples:** `add-friend.tsx`, `conversation-detail.tsx`, `status.tsx`
- **Rule:** Match URL structure when possible

#### Contexts
- **Format:** `kebab-case-context.tsx`
- **Examples:** `theme-context.tsx`, `auth-context.tsx`
- **Rule:** Always suffix with `-context`

#### Types
- **Format:** `kebab-case.ts` or `kebab-case.d.ts`
- **Examples:** `user.ts`, `message.types.ts`
- **Rule:** Use `.types.ts` for type-only files

#### Utilities
- **Format:** `kebab-case.ts`
- **Examples:** `date-formatter.ts`, `validation.ts`
- **Rule:** Group related utilities in single file

### Component Organization

#### Feature-Based Structure
Group components by feature/domain:

```
components/
├── chat/              # All chat-related components
│   ├── bottom-nav.tsx
│   ├── conversation-list.tsx
│   ├── message-area.tsx
│   └── message-input.tsx
├── friends/           # All friend-related components
│   ├── qr-scanner.tsx
│   └── friend-code-input.tsx
└── ui/                # Generic, reusable UI components
    ├── button.tsx
    ├── input.tsx
    └── avatar.tsx
```

**Rules:**
- ✅ Group by feature/domain, not by type
- ✅ Keep related components together
- ✅ Generic components go in `ui/`
- ❌ Don't create `containers/`, `presentational/` folders

---

## Code Style & Conventions

### General Principles

1. **Readability First:** Code is read more than written
2. **Consistency:** Follow existing patterns
3. **Simplicity:** Prefer simple solutions over clever ones
4. **DRY:** Don't Repeat Yourself (but avoid premature abstraction)
5. **YAGNI:** You Aren't Gonna Need It (don't over-engineer)

### Formatting

**Use Consistent Formatting:**
- **Indentation:** 2 spaces (no tabs)
- **Line Length:** Max 100 characters (soft limit)
- **Semicolons:** Optional (be consistent within file)
- **Quotes:** Double quotes for JSX, single for JS/TS
- **Trailing Commas:** Always use in multiline

**Example:**
```typescript
// ✅ Good
const user = {
  name: "John Doe",
  email: "john@example.com",
  age: 25,
};

// ❌ Bad
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 25
}
```

### Naming Conventions

#### Variables & Functions
- **Format:** `camelCase`
- **Examples:** `userName`, `handleSubmit`, `isLoading`
- **Rule:** Use descriptive names, avoid abbreviations

```typescript
// ✅ Good
const isUserAuthenticated = true;
const handleButtonClick = () => {};

// ❌ Bad
const isAuth = true;
const handleClick = () => {};
```

#### Constants
- **Format:** `UPPER_SNAKE_CASE` for true constants, `camelCase` for config objects
- **Examples:** `MAX_FILE_SIZE`, `API_BASE_URL`

```typescript
// ✅ Good
const MAX_RETRY_ATTEMPTS = 3;
const API_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
};

// ❌ Bad
const maxRetryAttempts = 3;
const api_endpoints = {};
```

#### Types & Interfaces
- **Format:** `PascalCase`
- **Examples:** `User`, `Message`, `ConversationListProps`
- **Rule:** Use descriptive names, suffix props with `Props`

```typescript
// ✅ Good
interface User {
  id: string; // UUID
  name: string;
}

interface ButtonProps {
  variant: "primary" | "secondary";
  onClick: () => void;
}

// ❌ Bad
interface user {
  id: string; // UUID
  name: string;
}

interface Props {
  variant: string;
  onClick: Function;
}
```

#### Components
- **Format:** `PascalCase`
- **Examples:** `MessageInput`, `QRScanner`, `UserProfileBar`
- **Rule:** Use descriptive names that indicate component purpose

```typescript
// ✅ Good
export function MessageInput() {}
export function QRScanner() {}

// ❌ Bad
export function Input() {}
export function Scanner() {}
```

#### Boolean Variables
- **Prefix:** `is`, `has`, `should`, `can`
- **Examples:** `isLoading`, `hasError`, `shouldRender`, `canEdit`

```typescript
// ✅ Good
const isAuthenticated = true;
const hasUnreadMessages = false;
const shouldShowModal = true;

// ❌ Bad
const authenticated = true;
const unreadMessages = false;
const showModal = true;
```

#### Event Handlers
- **Prefix:** `handle` or `on`
- **Examples:** `handleSubmit`, `handleClick`, `onSuccess`

```typescript
// ✅ Good
const handleFormSubmit = (e: FormEvent) => {};
const handleButtonClick = () => {};

// ❌ Bad
const submit = () => {};
const click = () => {};
```

---

## TypeScript Guidelines

### TypeScript Configuration

**Use Strict Mode:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "verbatimModuleSyntax": true
  }
}
```

### Type Definitions

#### Prefer Interfaces for Objects
```typescript
// ✅ Good
interface User {
  id: string; // UUID
  name: string;
  email: string;
}

// ❌ Avoid (unless you need union/intersection)
type User = {
  id: string; // UUID
  name: string;
  email: string;
};
```

#### Use Type for Unions/Primitives
```typescript
// ✅ Good
type Theme = "light" | "dark" | "system";
type Status = "pending" | "success" | "error";

// ❌ Bad
interface Theme {
  value: "light" | "dark" | "system";
}
```

#### Avoid `any`
```typescript
// ✅ Good
function processData(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }
  return JSON.stringify(data);
}

// ❌ Bad
function processData(data: any): string {
  return data.toString();
}
```

#### Use Explicit Return Types for Functions
```typescript
// ✅ Good
function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}

// ⚠️ Acceptable for simple cases
const add = (a: number, b: number) => a + b;

// ❌ Bad for complex functions
function complexCalculation(data) {
  // ... complex logic
  return result;
}
```

#### Proper Event Typing
```typescript
// ✅ Good
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// ❌ Bad
const handleSubmit = (e: any) => {};
```

#### Component Props Typing
```typescript
// ✅ Good
interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = "primary", size = "md", onClick, children }: ButtonProps) {
  // ...
}

// ❌ Bad
export function Button(props: any) {
  // ...
}
```

### Type Exports

```typescript
// ✅ Good - Export types for reuse
export interface User {
  id: string; // UUID
  name: string;
}

export type UserRole = "admin" | "user" | "guest";

// ✅ Good - Export types from components
export interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export function MessageInput(props: MessageInputProps) {
  // ...
}
```

---

## React & Component Guidelines

### Component Structure

#### Functional Components Only
```typescript
// ✅ Good
export function UserProfile({ user }: UserProfileProps) {
  return <div>{user.name}</div>;
}

// ❌ Bad (no class components)
export class UserProfile extends React.Component {
  render() {
    return <div>{this.props.user.name}</div>;
  }
}
```

#### Component Organization Pattern
```typescript
// 1. Imports
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

// 2. Types/Interfaces
interface MessageInputProps {
  onSendMessage: (text: string) => void;
  placeholder?: string;
}

// 3. Component
export function MessageInput({ onSendMessage, placeholder = "Type a message..." }: MessageInputProps) {
  // 3a. Hooks
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  // 3b. Event handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };
  
  // 3c. Render helpers (if needed)
  const renderIcon = () => {
    return <svg>...</svg>;
  };
  
  // 3d. Return JSX
  return (
    <form onSubmit={handleSubmit}>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button type="submit">Send</Button>
    </form>
  );
}
```

### Hooks Guidelines

#### Hook Order (Rules of Hooks)
```typescript
export function MyComponent() {
  // 1. State hooks
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  
  // 2. Context hooks
  const theme = useTheme();
  
  // 3. Router hooks
  const navigate = useNavigate();
  const params = useParams();
  
  // 4. Ref hooks
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 5. Effect hooks (last)
  useEffect(() => {
    // side effects
  }, []);
  
  // ... rest of component
}
```

#### Custom Hooks
```typescript
// ✅ Good - Prefix with 'use'
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
}

// Usage
const [theme, setTheme] = useLocalStorage("theme", "dark");
```

#### useEffect Best Practices
```typescript
// ✅ Good - Proper dependencies
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// ✅ Good - Cleanup
useEffect(() => {
  const timer = setTimeout(() => {
    console.log("Delayed action");
  }, 1000);
  
  return () => clearTimeout(timer);
}, []);

// ❌ Bad - Missing dependencies
useEffect(() => {
  fetchUserData(userId);
}, []); // userId should be in deps

// ❌ Bad - No cleanup for subscriptions
useEffect(() => {
  const subscription = subscribe();
  // Missing: return () => subscription.unsubscribe();
}, []);
```

### Props Guidelines

#### Destructure Props
```typescript
// ✅ Good
export function Button({ variant, size, onClick, children }: ButtonProps) {
  return <button className={variant}>{children}</button>;
}

// ❌ Bad
export function Button(props: ButtonProps) {
  return <button className={props.variant}>{props.children}</button>;
}
```

#### Default Props
```typescript
// ✅ Good - Default parameters
export function Button({ variant = "primary", size = "md" }: ButtonProps) {
  // ...
}

// ❌ Bad - Don't use defaultProps (deprecated in React 19)
Button.defaultProps = {
  variant: "primary",
};
```

#### Children Prop
```typescript
// ✅ Good
interface LayoutProps {
  children: React.ReactNode;
}

// ❌ Bad
interface LayoutProps {
  children: any;
}
```

### Conditional Rendering

```typescript
// ✅ Good - Boolean && for simple conditions
{isLoading && <Spinner />}

// ✅ Good - Ternary for if/else
{isAuthenticated ? <Dashboard /> : <Login />}

// ✅ Good - Early return for complex conditions
if (!user) {
  return <div>Please log in</div>;
}

return <UserProfile user={user} />;

// ❌ Bad - Nested ternaries
{isLoading ? <Spinner /> : isError ? <Error /> : isSuccess ? <Success /> : null}

// ✅ Better - Use function or component
{renderContent()}
```

### Lists & Keys

```typescript
// ✅ Good - Use unique, stable keys
{messages.map((message) => (
  <MessageBubble key={message.id} message={message} />
))}

// ⚠️ Acceptable - Index as key only if list never reorders
{staticItems.map((item, index) => (
  <div key={index}>{item}</div>
))}

// ❌ Bad - No key
{messages.map((message) => (
  <MessageBubble message={message} />
))}

// ❌ Bad - Random key
{messages.map((message) => (
  <MessageBubble key={Math.random()} message={message} />
))}
```

### Client-Side Only Components

For components that use browser APIs (camera, localStorage, etc.):

```typescript
// ✅ Good - Prevent SSR hydration errors
import { useState, useEffect } from "react";

export function QRScannerWrapper() {
  const [mounted, setMounted] = useState(false);
  const [Scanner, setScanner] = useState<any>(null);
  
  useEffect(() => {
    setMounted(true);
    import("./qr-scanner").then((mod) => {
      setScanner(() => mod.QRScanner);
    });
  }, []);
  
  if (!mounted || !Scanner) {
    return null;
  }
  
  return <Scanner />;
}
```

---

## Routing & Navigation

### Route File Structure

```typescript
// app/routes/conversation-detail.tsx

import type { Route } from "./+types/conversation-detail";

// Meta tags
export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Conversation ${params.id} - VibeSync` },
    { name: "description", content: "Chat conversation" },
  ];
}

// Loader (server-side data fetching)
export async function loader({ params }: Route.LoaderArgs) {
  const conversation = await fetchConversation(params.id);
  return { conversation };
}

// Component
export default function ConversationDetail({ loaderData }: Route.ComponentProps) {
  const { conversation } = loaderData;
  return <div>{conversation.name}</div>;
}
```

### Navigation

```typescript
// ✅ Good - Use navigate from useNavigate
import { useNavigate } from "react-router";

export function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/conversations");
  };
  
  return <button onClick={handleClick}>Go to Conversations</button>;
}

// ✅ Good - Use Link for navigation
import { Link } from "react-router";

export function Menu() {
  return <Link to="/settings">Settings</Link>;
}

// ❌ Bad - Don't use window.location
const handleClick = () => {
  window.location.href = "/conversations";
};
```

### Route Parameters

```typescript
// ✅ Good - Type-safe params
import { useParams } from "react-router";

export default function ConversationDetail() {
  const { id } = useParams<{ id: string }>();
  
  // ...
}
```

---

## State Management

### Local State (useState)

Use for component-specific state:

```typescript
// ✅ Good
export function MessageInput() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // ...
}
```

### Context API

Use for global/shared state:

```typescript
// ✅ Good - contexts/theme-context.tsx
import { createContext, useContext, useState } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

### When to Use What

- **useState:** Component-specific state (form inputs, toggles, local UI state)
- **useContext:** Global state (theme, auth, user preferences)
- **URL State:** Navigation state (search params, filters)
- **Server State:** Data from API (use loaders in React Router)

---

## Styling Guidelines

### TailwindCSS Standards

#### Use Utility Classes
```typescript
// ✅ Good
<button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
  Click me
</button>

// ❌ Bad - Don't use inline styles
<button style={{ padding: "8px 16px", background: "purple" }}>
  Click me
</button>
```

#### Responsive Design
```typescript
// ✅ Good - Mobile-first
<div className="w-full lg:w-96 p-4 md:p-6 lg:p-8">
  Content
</div>
```

#### Dark Mode
```typescript
// ✅ Good - Use dark: variant
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

#### Custom Classes in app.css
```css
/* ✅ Good - Reusable utility classes */
.glass-dark {
  @apply bg-white/90 dark:bg-gray-900/75;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  @apply border border-gray-200 dark:border-white/10;
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

#### Component-Specific Styles
```typescript
// ✅ Good - Compose utilities
const baseStyles = "font-medium rounded-lg transition-all duration-200";
const variants = {
  primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
  secondary: "bg-white/10 text-gray-900 dark:text-white",
};

<button className={`${baseStyles} ${variants[variant]}`}>
  {children}
</button>
```

### Animation Guidelines

```css
/* ✅ Good - Define in app.css */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

```typescript
// ✅ Good - Use in components
<div className="animate-fade-in">
  Content
</div>
```

### Design Tokens

Use CSS custom properties for theming:

```css
:root {
  --color-primary: hsl(262, 83%, 58%);
  --color-secondary: hsl(198, 93%, 60%);
  --gradient-primary: linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(198, 93%, 60%) 100%);
}
```

---

## Backend Architecture & Standards

> **Status:** 📋 Planned - Backend implementation pending  
> **Timeline:** Phase 2 (Q2 2026)

This section defines the technical standards and architecture for the VibeSync backend system. While the current implementation uses mock data, these guidelines will govern all future backend development.

### Backend Technology Stack

#### Core Runtime & Framework

**Node.js Runtime:**
- **Version:** Node.js 20.x LTS (minimum 18.x)
- **Package Manager:** npm 10.x or pnpm 8.x
- **TypeScript:** 5.9.2+ (same as frontend)

**Web Framework:**
Choose ONE of the following (pending decision):

**Option 1: Express.js** (Recommended for familiarity)
```json
{
  "express": "^4.19.0",
  "@types/express": "^4.17.21"
}
```
- ✅ Mature ecosystem
- ✅ Large community
- ✅ Extensive middleware
- ⚠️ Less performant than alternatives

**Option 2: Fastify** (Recommended for performance)
```json
{
  "fastify": "^4.26.0",
  "@fastify/cors": "^9.0.0",
  "@fastify/jwt": "^8.0.0"
}
```
- ✅ High performance
- ✅ TypeScript-first
- ✅ Schema-based validation
- ⚠️ Smaller ecosystem

#### Database

**Primary Database: PostgreSQL**
```json
{
  "pg": "^8.11.0",
  "drizzle-orm": "^0.30.0",  // ORM
  "@types/pg": "^8.11.0"
}
```

**Why PostgreSQL:**
- ✅ ACID compliance
- ✅ JSON support (for flexible fields)
- ✅ Full-text search
- ✅ Excellent performance
- ✅ Strong TypeScript support via Drizzle ORM

**Alternative: MongoDB** (If document model preferred)
```json
{
  "mongoose": "^8.2.0",
  "@types/mongoose": "^5.11.97"
}
```

#### Real-Time Communication

**WebSocket: Socket.io**
```json
{
  "socket.io": "^4.7.0",
  "@types/socket.io": "^3.0.2"
}
```

**Features:**
- Real-time messaging
- Typing indicators
- Online status updates
- Read receipts
- Auto-reconnection
- Room-based messaging

#### Authentication & Security

```json
{
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "@types/jsonwebtoken": "^9.0.6",
  "@types/bcrypt": "^5.0.2",
  "helmet": "^7.1.0",
  "cors": "^2.8.5"
}
```

#### File Storage

**AWS S3 (or compatible)**
```json
{
  "@aws-sdk/client-s3": "^3.540.0",
  "@aws-sdk/s3-request-presigner": "^3.540.0"
}
```

**Alternative: Cloudinary**
```json
{
  "cloudinary": "^2.0.3"
}
```

#### Caching

**Redis**
```json
{
  "redis": "^4.6.13",
  "@types/redis": "^4.0.11"
}
```

**Use Cases:**
- Session storage
- Rate limiting
- Message queue
- Cache layer
- Online user tracking

#### Validation & Utilities

```json
{
  "zod": "^3.22.4",           // Schema validation
  "date-fns": "^3.3.1",        // Date manipulation
  "nanoid": "^5.0.6",          // ID generation
  "winston": "^3.12.0",        // Logging
  "dotenv": "^16.4.5"          // Environment variables
}
```

---

### Backend Project Structure

```
vibesync-backend/
├── src/
│   ├── config/                   # Configuration files
│   │   ├── database.ts          # Database connection
│   │   ├── redis.ts             # Redis connection
│   │   ├── socket.ts            # Socket.io config
│   │   └── env.ts               # Environment validation
│   ├── models/                   # Database models/schemas
│   │   ├── user.model.ts
│   │   ├── message.model.ts
│   │   ├── conversation.model.ts
│   │   ├── status.model.ts
│   │   └── friend-request.model.ts
│   ├── controllers/              # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── message.controller.ts
│   │   ├── conversation.controller.ts
│   │   ├── friend.controller.ts
│   │   └── status.controller.ts
│   ├── services/                 # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── message.service.ts
│   │   ├── notification.service.ts
│   │   └── file-upload.service.ts
│   ├── routes/                   # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── message.routes.ts
│   │   ├── conversation.routes.ts
│   │   ├── friend.routes.ts
│   │   └── status.routes.ts
│   ├── middleware/               # Express/Fastify middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── upload.middleware.ts
│   ├── socket/                   # WebSocket handlers
│   │   ├── connection.handler.ts
│   │   ├── message.handler.ts
│   │   ├── typing.handler.ts
│   │   └── presence.handler.ts
│   ├── utils/                    # Utility functions
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   ├── validators.util.ts
│   │   └── logger.util.ts
│   ├── types/                    # TypeScript types
│   │   ├── express.d.ts         # Express type extensions
│   │   ├── socket.types.ts
│   │   └── api.types.ts
│   ├── db/                       # Database migrations/seeds
│   │   ├── migrations/
│   │   └── seeds/
│   ├── tests/                    # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── app.ts                    # Express/Fastify app setup
│   ├── server.ts                 # Server entry point
│   └── socket-server.ts          # WebSocket server
├── .env.example                  # Environment template
├── .env                          # Environment variables (gitignored)
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── drizzle.config.ts             # ORM config (if using Drizzle)
└── README.md                     # Backend documentation
```

---

### API Design Standards

#### RESTful API Principles

**URL Structure:**
```
/api/v1/{resource}/{id?}/{sub-resource?}
```

**Examples:**
```
GET    /api/v1/users/:id              # Get user
PUT    /api/v1/users/:id              # Update user
GET    /api/v1/conversations          # List conversations
GET    /api/v1/conversations/:id      # Get conversation
GET    /api/v1/conversations/:id/messages  # Get messages
POST   /api/v1/messages               # Send message
GET    /api/v1/friends                # List friends
POST   /api/v1/friends/request        # Send friend request
```

#### HTTP Methods

- **GET:** Retrieve resource(s)
- **POST:** Create new resource
- **PUT:** Update entire resource
- **PATCH:** Partial update
- **DELETE:** Remove resource

#### Status Codes

**Success:**
- `200 OK` - Successful GET, PUT, PATCH, DELETE
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE with no response body

**Client Errors:**
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Duplicate resource
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded

**Server Errors:**
- `500 Internal Server Error` - Unexpected server error
- `503 Service Unavailable` - Server temporarily down

#### Response Format

**Success Response:**
```typescript
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful" // Optional
}
```

**Error Response:**
```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

**Pagination:**
```typescript
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Request/Response Examples

**Register User:**
```typescript
// POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

// Response: 201 Created
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "friendCode": "A1B2-C3D4-E5F6",
      "createdAt": "2026-01-22T10:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 3600
    }
  }
}
```

**Send Message:**
```typescript
// POST /api/v1/messages
{
  "conversationId": 1,
  "content": "Hello, how are you?",
  "type": "text"
}

// Response: 201 Created
{
  "success": true,
  "data": {
    "id": 123,
    "conversationId": 1,
    "senderId": 1,
    "content": "Hello, how are you?",
    "type": "text",
    "timestamp": "2026-01-22T10:05:00Z",
    "read": false,
    "delivered": true
  }
}
```

---

### Database Schema Design

#### PostgreSQL Schema (Drizzle ORM)

**Users Table:**
```typescript
// src/models/user.model.ts
import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  friendCode: varchar('friend_code', { length: 17 }).unique().notNull(), // Format: XXXX-XXXX-XXXX
  avatar: varchar('avatar', { length: 500 }),
  status: varchar('status', { length: 500 }).default('Hey there! I am using VibeSync'),
  online: boolean('online').default(false),
  lastSeen: timestamp('last_seen'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Indexes
// CREATE INDEX idx_users_friend_code ON users(friend_code);
// CREATE INDEX idx_users_email ON users(email);
```

**Friendships Table:**
```typescript
export const friendships = pgTable('friendships', {
  id: serial('id').primaryKey(),
  userId1: integer('user_id_1').notNull().references(() => users.id),
  userId2: integer('user_id_2').notNull().references(() => users.id),
  status: varchar('status', { length: 20 }).default('accepted'), // 'accepted'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Composite unique constraint to prevent duplicates
// CREATE UNIQUE INDEX idx_friendships_users ON friendships(LEAST(user_id_1, user_id_2), GREATEST(user_id_1, user_id_2));
```

**Friend Requests Table:**
```typescript
export const friendRequests = pgTable('friend_requests', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').notNull().references(() => users.id),
  receiverId: integer('receiver_id').notNull().references(() => users.id),
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'accepted', 'declined'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Indexes
// CREATE INDEX idx_friend_requests_receiver ON friend_requests(receiver_id);
// CREATE UNIQUE INDEX idx_friend_requests_unique ON friend_requests(sender_id, receiver_id) WHERE status = 'pending';
```

**Conversations Table:**
```typescript
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 20 }).default('direct'), // 'direct', 'group' (future)
  name: varchar('name', { length: 255 }), // For group chats
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Conversation Participants Table:**
```typescript
export const conversationParticipants = pgTable('conversation_participants', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull().references(() => conversations.id),
  userId: integer('user_id').notNull().references(() => users.id),
  unreadCount: integer('unread_count').default(0),
  lastReadAt: timestamp('last_read_at'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Indexes
// CREATE INDEX idx_conv_participants_user ON conversation_participants(user_id);
// CREATE INDEX idx_conv_participants_conv ON conversation_participants(conversation_id);
// CREATE UNIQUE INDEX idx_conv_participants_unique ON conversation_participants(conversation_id, user_id);
```

**Messages Table:**
```typescript
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull().references(() => conversations.id),
  senderId: integer('sender_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  type: varchar('type', { length: 20 }).default('text'), // 'text', 'image', 'video', 'file'
  mediaUrl: varchar('media_url', { length: 500 }),
  read: boolean('read').default(false),
  delivered: boolean('delivered').default(false),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
});

// Indexes
// CREATE INDEX idx_messages_conversation ON messages(conversation_id, timestamp DESC);
// CREATE INDEX idx_messages_sender ON messages(sender_id);
```

**Status Updates Table:**
```typescript
export const statusUpdates = pgTable('status_updates', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  type: varchar('type', { length: 20 }).notNull(), // 'image', 'video'
  mediaUrl: varchar('media_url', { length: 500 }).notNull(),
  caption: varchar('caption', { length: 500 }),
  backgroundColor: varchar('background_color', { length: 7 }).default('#8B5CF6'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(), // timestamp + 24 hours
});

// Indexes
// CREATE INDEX idx_status_user_active ON status_updates(user_id, expires_at) WHERE expires_at > NOW();
```

**Status Views Table:**
```typescript
export const statusViews = pgTable('status_views', {
  id: serial('id').primaryKey(),
  statusId: integer('status_id').notNull().references(() => statusUpdates.id),
  viewerId: integer('viewer_id').notNull().references(() => users.id),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
});

// Indexes
// CREATE INDEX idx_status_views_status ON status_views(status_id);
// CREATE UNIQUE INDEX idx_status_views_unique ON status_views(status_id, viewer_id);
```

---

### Authentication & Authorization

#### JWT Token Strategy

**Access Token:**
- **Lifetime:** 15 minutes
- **Storage:** Memory/Session (frontend)
- **Purpose:** API authentication

**Refresh Token:**
- **Lifetime:** 7 days
- **Storage:** HttpOnly cookie
- **Purpose:** Obtain new access token

**Token Payload:**
```typescript
interface JWTPayload {
  userId: number;
  email: string;
  iat: number;  // Issued at
  exp: number;  // Expiration
}
```

#### Authentication Flow

```typescript
// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

export class AuthService {
  async register(name: string, email: string, password: string) {
    // 1. Validate input
    // 2. Check if email exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // 4. Generate unique friend code
    const friendCode = await this.generateUniqueFriendCode();
    
    // 5. Create user
    const [user] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      friendCode,
    }).returning();
    
    // 6. Generate tokens
    const tokens = this.generateTokens(user.id, user.email);
    
    return { user, tokens };
  }
  
  async login(email: string, password: string) {
    // 1. Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // 2. Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    
    // 3. Generate tokens
    const tokens = this.generateTokens(user.id, user.email);
    
    // 4. Update last seen
    await db.update(users)
      .set({ lastSeen: new Date(), online: true })
      .where(eq(users.id, user.id));
    
    return { user, tokens };
  }
  
  generateTokens(userId: number, email: string) {
    const accessToken = jwt.sign(
      { userId, email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );
    
    const refreshToken = jwt.sign(
      { userId, email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );
    
    return { accessToken, refreshToken, expiresIn: 900 }; // 15 min
  }
  
  async generateUniqueFriendCode(): Promise<string> {
    // Generate format: XXXX-XXXX-XXXX
    let code: string;
    let exists = true;
    
    while (exists) {
      const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const part3 = Math.random().toString(36).substring(2, 6).toUpperCase();
      code = `${part1}-${part2}-${part3}`;
      
      const existing = await db.query.users.findFirst({
        where: eq(users.friendCode, code)
      });
      
      exists = !!existing;
    }
    
    return code!;
  }
}
```

#### Auth Middleware

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: number;
  email: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided'
        }
      });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JWTPayload;
    
    // Attach user to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired'
        }
      });
    }
    
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token'
      }
    });
  }
};
```

---

### WebSocket (Socket.io) Implementation

#### Socket Server Setup

```typescript
// src/socket-server.ts
import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';

interface SocketData {
  userId: number;
  email: string;
}

export function initializeSocketServer(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });
  
  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as SocketData;
      socket.data.userId = decoded.userId;
      socket.data.email = decoded.email;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    
    console.log(`User ${userId} connected`);
    
    // Join user's personal room
    socket.join(`user:${userId}`);
    
    // Update online status
    updateUserOnlineStatus(userId, true);
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      updateUserOnlineStatus(userId, false);
    });
    
    // Message handlers
    require('./socket/message.handler').register(socket, io);
    require('./socket/typing.handler').register(socket, io);
    require('./socket/presence.handler').register(socket, io);
  });
  
  return io;
}
```

#### Message Handler

```typescript
// src/socket/message.handler.ts
import { Socket, Server } from 'socket.io';
import { db } from '../config/database';
import { messages, conversationParticipants } from '../models';

export function register(socket: Socket, io: Server) {
  // Send message
  socket.on('message:send', async (data: {
    conversationId: number;
    content: string;
    type: 'text' | 'image' | 'video';
  }) => {
    try {
      const userId = socket.data.userId;
      
      // 1. Save message to database
      const [message] = await db.insert(messages).values({
        conversationId: data.conversationId,
        senderId: userId,
        content: data.content,
        type: data.type,
        delivered: true,
      }).returning();
      
      // 2. Get conversation participants
      const participants = await db.query.conversationParticipants.findMany({
        where: eq(conversationParticipants.conversationId, data.conversationId)
      });
      
      // 3. Emit to all participants except sender
      participants.forEach(participant => {
        if (participant.userId !== userId) {
          io.to(`user:${participant.userId}`).emit('message:new', {
            id: message.id,
            conversationId: message.conversationId,
            senderId: userId,
            content: message.content,
            type: message.type,
            timestamp: message.timestamp,
          });
          
          // Update unread count
          db.update(conversationParticipants)
            .set({ unreadCount: participant.unreadCount + 1 })
            .where(eq(conversationParticipants.id, participant.id));
        }
      });
      
      // 4. Acknowledge to sender
      socket.emit('message:sent', {
        id: message.id,
        timestamp: message.timestamp,
      });
      
    } catch (error) {
      socket.emit('message:error', {
        message: 'Failed to send message'
      });
    }
  });
  
  // Mark message as read
  socket.on('message:read', async (data: { messageId: number }) => {
    await db.update(messages)
      .set({ read: true })
      .where(eq(messages.id, data.messageId));
    
    // Notify sender
    const message = await db.query.messages.findFirst({
      where: eq(messages.id, data.messageId)
    });
    
    if (message) {
      io.to(`user:${message.senderId}`).emit('message:read', {
        messageId: data.messageId,
        readBy: socket.data.userId,
      });
    }
  });
}
```

#### Typing Indicator

```typescript
// src/socket/typing.handler.ts
export function register(socket: Socket, io: Server) {
  socket.on('typing:start', (data: { conversationId: number }) => {
    // Broadcast to other users in conversation
    socket.to(`conversation:${data.conversationId}`).emit('typing:user', {
      userId: socket.data.userId,
      conversationId: data.conversationId,
      typing: true,
    });
  });
  
  socket.on('typing:stop', (data: { conversationId: number }) => {
    socket.to(`conversation:${data.conversationId}`).emit('typing:user', {
      userId: socket.data.userId,
      conversationId: data.conversationId,
      typing: false,
    });
  });
}
```

---

### File Upload & Storage

#### S3 Upload Service

```typescript
// src/services/file-upload.service.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET!;
const CDN_URL = process.env.CDN_URL;

export class FileUploadService {
  async uploadAvatar(file: Buffer, mimeType: string, userId: number): Promise<string> {
    const key = `avatars/${userId}/${nanoid()}.${this.getExtension(mimeType)}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimeType,
      ACL: 'public-read',
    }));
    
    return CDN_URL ? `${CDN_URL}/${key}` : `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }
  
  async uploadStatusMedia(file: Buffer, mimeType: string, userId: number): Promise<string> {
    const key = `status/${userId}/${nanoid()}.${this.getExtension(mimeType)}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimeType,
      ACL: 'public-read',
      // Auto-delete after 25 hours
      Expires: new Date(Date.now() + 25 * 60 * 60 * 1000),
    }));
    
    return CDN_URL ? `${CDN_URL}/${key}` : `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }
  
  async uploadMessageMedia(file: Buffer, mimeType: string, conversationId: number): Promise<string> {
    const key = `messages/${conversationId}/${nanoid()}.${this.getExtension(mimeType)}`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimeType,
      ACL: 'private', // Messages are private
    }));
    
    // Generate presigned URL (valid for 7 days)
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    const url = await getSignedUrl(s3Client, command, { expiresIn: 7 * 24 * 60 * 60 });
    
    return url;
  }
  
  private getExtension(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
    };
    return map[mimeType] || 'bin';
  }
}
```

---

### Caching Strategy (Redis)

```typescript
// src/config/redis.ts
import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis() {
  await redisClient.connect();
  console.log('Redis connected');
}

// Cache utilities
export class CacheService {
  // Cache user sessions
  async cacheUserSession(userId: number, sessionData: any, ttl: number = 3600) {
    await redisClient.setEx(
      `session:${userId}`,
      ttl,
      JSON.stringify(sessionData)
    );
  }
  
  // Cache online users
  async setUserOnline(userId: number) {
    await redisClient.sAdd('online_users', userId.toString());
  }
  
  async setUserOffline(userId: number) {
    await redisClient.sRem('online_users', userId.toString());
  }
  
  async getOnlineUsers(): Promise<number[]> {
    const users = await redisClient.sMembers('online_users');
    return users.map(id => parseInt(id));
  }
  
  // Rate limiting
  async incrementRateLimit(key: string, windowSeconds: number = 60): Promise<number> {
    const current = await redisClient.incr(`ratelimit:${key}`);
    
    if (current === 1) {
      await redisClient.expire(`ratelimit:${key}`, windowSeconds);
    }
    
    return current;
  }
  
  // Cache conversations
  async cacheConversationMessages(conversationId: number, messages: any[], ttl: number = 300) {
    await redisClient.setEx(
      `conversation:${conversationId}:messages`,
      ttl,
      JSON.stringify(messages)
    );
  }
}
```

---

### Rate Limiting

```typescript
// src/middleware/rate-limit.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';

export const rateLimitMiddleware = (
  maxRequests: number = 100,
  windowSeconds: number = 60
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `ratelimit:${req.ip}:${req.path}`;
    
    try {
      const current = await redisClient.incr(key);
      
      if (current === 1) {
        await redisClient.expire(key, windowSeconds);
      }
      
      if (current > maxRequests) {
        return res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later',
            retryAfter: windowSeconds
          }
        });
      }
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));
      
      next();
    } catch (error) {
      // If Redis fails, allow the request but log error
      console.error('Rate limit error:', error);
      next();
    }
  };
};

// Usage in routes
// router.post('/api/v1/auth/login', rateLimitMiddleware(5, 300), authController.login);
```

---

### Logging & Monitoring

```typescript
// src/utils/logger.util.ts
import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'vibesync-api' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Write errors to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

// Usage
// logger.info('User logged in', { userId: 1 });
// logger.error('Database connection failed', { error: err.message });
```

**Structured Logging:**
```typescript
// Log all API requests
app.use((req, res, next) => {
  logger.info('API Request', {
    method: req.method,
    path: req.path,
    userId: req.user?.userId,
    ip: req.ip,
  });
  next();
});
```

---

### Environment Variables

```bash
# .env.example

# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Frontend
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vibesync
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=vibesync-uploads
CDN_URL=https://cdn.vibesync.com

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB in bytes
MAX_AVATAR_SIZE=2097152  # 2MB

# Email (Future)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@vibesync.com
SMTP_PASS=your-email-password

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=60  # seconds
RATE_LIMIT_MAX=100    # requests per window
```

---

### Deployment & DevOps

#### Docker Setup

**Dockerfile:**
```dockerfile
# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/vibesync
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: vibesync
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/backend-ci.yml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: vibesync_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: password
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/vibesync_test
          REDIS_URL: redis://localhost:6379
      
      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to production
        # Add deployment steps here
        run: echo "Deploy to production"
```

---

### API Documentation

Use **Swagger/OpenAPI** for API documentation:

```typescript
// src/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VibeSync API',
      version: '1.0.0',
      description: 'Real-time chat application API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.vibesync.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to API routes
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };

// In app.ts
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

---

### Backend Security Checklist

- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Sanitize user inputs
- ✅ Use parameterized queries (prevent SQL injection)
- ✅ Hash passwords with bcrypt (12+ rounds)
- ✅ Use JWT with short expiration
- ✅ Implement CORS properly
- ✅ Use helmet.js for security headers
- ✅ Validate all inputs with Zod
- ✅ Log security events
- ✅ Keep dependencies updated
- ✅ Use environment variables for secrets
- ✅ Implement request size limits
- ✅ Enable CSRF protection
- ✅ Implement account lockout after failed attempts

---


## Performance Standards

### Code Splitting

```typescript
// ✅ Good - Lazy load heavy components
import { lazy, Suspense } from "react";

const QRScanner = lazy(() => import("./qr-scanner"));

export function AddFriend() {
  return (
    <Suspense fallback={<div>Loading scanner...</div>}>
      <QRScanner />
    </Suspense>
  );
}
```

### Memoization

```typescript
// ✅ Good - Memoize expensive calculations
import { useMemo } from "react";

export function MessageList({ messages }: MessageListProps) {
  const sortedMessages = useMemo(() => {
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  }, [messages]);
  
  return <div>{/* render sortedMessages */}</div>;
}

// ✅ Good - Memoize callbacks passed to children
import { useCallback } from "react";

export function Parent() {
  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []);
  
  return <Child onClick={handleClick} />;
}
```

### Image Optimization

```typescript
// ✅ Good - Use appropriate formats
<img src="/avatar.webp" alt="User avatar" loading="lazy" />

// ✅ Good - Lazy load images
<img src="/photo.jpg" loading="lazy" alt="Photo" />
```

### Bundle Size

- Monitor bundle size with `npm run build`
- Keep total bundle < 500KB gzipped
- Lazy load routes and heavy components
- Tree-shake unused code

---

## Security Guidelines

### Input Validation

```typescript
// ✅ Good - Validate and sanitize
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleSubmit = (email: string) => {
  if (!validateEmail(email)) {
    setError("Invalid email address");
    return;
  }
  // proceed
};
```

### XSS Prevention

```typescript
// ✅ Good - React escapes by default
<div>{userInput}</div>

// ⚠️ Dangerous - Only use when necessary
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />

// ❌ Bad - Never trust user input
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Authentication

```typescript
// ✅ Good - Store tokens securely
// Use httpOnly cookies for tokens (backend implementation)
// Never store sensitive data in localStorage

// ⚠️ Acceptable for non-sensitive data
localStorage.setItem("theme", "dark");

// ❌ Bad
localStorage.setItem("authToken", token);
```

### Environment Variables

```typescript
// ✅ Good - Use environment variables for secrets
const API_URL = import.meta.env.VITE_API_URL;

// ❌ Bad - Hardcode secrets
const API_KEY = "sk_live_123456789";
```

---

## Testing Requirements

### Unit Tests (Future)

```typescript
// Example structure
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
  
  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText("Click me").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Coverage Goals

- **Unit Tests:** 80% coverage for utilities and hooks
- **Component Tests:** 70% coverage for UI components
- **Integration Tests:** Critical user flows
- **E2E Tests:** Main user journeys

---

## Error Handling

### Error Boundaries

```typescript
// ✅ Good - Implement in root.tsx
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404
      ? "The requested page could not be found."
      : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
  }
  
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
    </main>
  );
}
```

### Try-Catch

```typescript
// ✅ Good - Handle errors gracefully
const fetchUserData = async (userId: number) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    // Show user-friendly error message
    setError("Unable to load user data. Please try again.");
    return null;
  }
};
```

### User Feedback

```typescript
// ✅ Good - Show feedback for errors
const [error, setError] = useState<string | null>(null);

{error && (
  <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
    {error}
  </div>
)}
```

---

## Accessibility Standards

### Semantic HTML

```typescript
// ✅ Good
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

// ❌ Bad
<div className="nav">
  <div className="link">Home</div>
</div>
```

### ARIA Labels

```typescript
// ✅ Good
<button aria-label="Close modal" onClick={onClose}>
  <svg>...</svg>
</button>

<input
  type="text"
  aria-label="Search conversations"
  placeholder="Search..."
/>
```

### Keyboard Navigation

```typescript
// ✅ Good - Support keyboard events
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  }}
>
  Click me
</div>
```

### Focus Management

```typescript
// ✅ Good - Visible focus states
<button className="focus:outline-none focus:ring-2 focus:ring-purple-500">
  Click me
</button>
```

---

## Git & Version Control

### Branch Naming

- **Format:** `type/short-description`
- **Types:** `feature/`, `bugfix/`, `hotfix/`, `refactor/`, `docs/`
- **Examples:**
  - `feature/qr-code-scanner`
  - `bugfix/message-input-overflow`
  - `refactor/theme-context`
  - `docs/update-readme`

### Commit Messages

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(chat): add message input component

Implemented message input with send button integration.
Includes emoji support and character limit.

Closes #123
```

```
fix(qr-scanner): resolve dual camera stream issue

Fixed bug where camera stream was displayed twice.
Moved scanner to client-side only component.

Fixes #456
```

### Pull Request Guidelines

**PR Title:** Same format as commit messages

**PR Description Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on mobile

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
```

---

## Code Review Process

### Reviewer Checklist

- [ ] Code follows style guidelines
- [ ] TypeScript types are correct
- [ ] No `any` types (unless justified)
- [ ] Component structure is clean
- [ ] Props are properly typed
- [ ] Error handling is present
- [ ] Performance considerations addressed
- [ ] Accessibility standards met
- [ ] Tests added (when applicable)
- [ ] Documentation updated

### Review Comments

**Use constructive language:**
- ✅ "Consider using `useMemo` here to optimize performance"
- ✅ "Could we extract this into a separate component for reusability?"
- ❌ "This code is bad"
- ❌ "Why did you do it this way?"

**Severity Levels:**
- 🔴 **Blocker:** Must be fixed before merge
- 🟡 **Important:** Should be addressed
- 🟢 **Suggestion:** Nice to have
- 💡 **Question:** Seeking clarification

---

## Documentation Standards

### Code Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Prevent hydration errors by loading scanner client-side only
useEffect(() => {
  import("./qr-scanner").then(setScanner);
}, []);

// ❌ Bad - Obvious comment
// Set the count to 0
const count = 0;
```

### JSDoc for Complex Functions

```typescript
/**
 * Validates and formats a friend code
 * @param code - Raw friend code input
 * @returns Formatted code (XXXX-XXXX-XXXX) or null if invalid
 * @example
 * formatFriendCode("123456789012") // "1234-5678-9012"
 */
export function formatFriendCode(code: string): string | null {
  // implementation
}
```

### README Files

Each major feature should have a README:

```markdown
# QR Scanner Component

## Overview
QR code scanner for adding friends via camera.

## Usage
\`\`\`tsx
import { QRScanner } from "./qr-scanner";

<QRScanner
  onScanSuccess={(data) => console.log(data)}
  onClose={() => setShowScanner(false)}
/>
\`\`\`

## Props
- `onScanSuccess`: Callback when QR code is scanned
- `onClose`: Callback to close scanner

## Notes
- Requires camera permissions
- Client-side only (uses browser APIs)
```

---

## Enforcement

### Automated Checks (Future)

- **ESLint:** Code quality and style
- **Prettier:** Code formatting
- **TypeScript:** Type checking
- **Husky:** Pre-commit hooks
- **GitHub Actions:** CI/CD pipeline

### Manual Review

- All PRs require at least one approval
- Tech lead reviews for architectural changes
- Pair programming for complex features

---

## Updates & Amendments

This document is a living document and will be updated as the project evolves.

**Change Process:**
1. Propose change in team discussion
2. Document rationale
3. Update this document
4. Communicate to team
5. Update version number

---

## Appendix

### Quick Reference

#### File Naming
- Components: `kebab-case.tsx`
- Types: `kebab-case.ts`
- Contexts: `kebab-case-context.tsx`

#### Code Naming
- Variables/Functions: `camelCase`
- Components/Types: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Booleans: `isX`, `hasX`, `shouldX`
- Handlers: `handleX`, `onX`

#### Import Order
1. React imports
2. Third-party libraries
3. Internal components
4. Types
5. Styles

#### Component Structure
1. Imports
2. Types/Interfaces
3. Component function
   - Hooks
   - Event handlers
   - Render helpers
   - Return JSX

---

**End of Document**

*For questions or clarifications, contact the tech lead.*
