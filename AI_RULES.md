# MoodFlow AI Development Rules

## Tech Stack
- **React 18 & TypeScript**: Core framework for building a type-safe, component-based UI.
- **Vite**: High-performance build tool and development server.
- **Tailwind CSS**: Utility-first styling engine used for all layout and design.
- **Framer Motion**: Primary library for physics-based animations, gestures, and page transitions.
- **Lucide React**: Standardized icon library for consistent visual language.
- **Recharts**: Data visualization library for rendering mood and sleep trends.
- **React Context API**: Used for global state management (mood entries, streaks, and stats).
- **LocalStorage**: Simple persistence layer for user data.

## Development Rules

### 1. Styling & Design System
- **Tailwind Only**: Use Tailwind CSS utility classes for all styling. Do not create new CSS files.
- **Glassmorphism**: Maintain the "Glassmorphic" aesthetic. Use `backdrop-blur`, `bg-white/10`, and `border-white/10`.
- **GlassCard**: Always wrap content sections in the `<GlassCard />` component to ensure consistent depth and blur.
- **Gradients**: Use the predefined mood gradients from `constants.ts` for mood-related UI elements.

### 2. Components & Structure
- **Atomic Design**: Keep components small and focused. If a component exceeds 100 lines, refactor it into smaller sub-components.
- **Lucide Icons**: Use `lucide-react` for all icons. Ensure icons have consistent sizing (usually 20px or 24px).
- **Responsive Design**: All new UI must be mobile-first and responsive, fitting within the `max-w-md` container defined in `App.tsx`.

### 3. Animations
- **Framer Motion**: Use `motion` components for any element that enters, exits, or changes state.
- **Micro-interactions**: Add subtle `whileTap={{ scale: 0.95 }}` or `whileHover` effects to buttons and interactive cards.
- **Transitions**: Use `AnimatePresence` for smooth mounting/unmounting of modals and screens.

### 4. State Management
- **MoodContext**: Access and update all mood data through the `useMood` hook. Do not manage entries in local component state if they need to persist.
- **Type Safety**: Always define interfaces in `types.ts` for any new data structures.

### 5. Data Visualization
- **Recharts**: Use Recharts for any charts. Ensure they use the app's color palette (e.g., `#8B5CF6` for mood, `#22D3EE` for sleep).
- **Tooltips**: Customize Recharts tooltips to match the dark glass theme (`bg-[#1a2632]`).