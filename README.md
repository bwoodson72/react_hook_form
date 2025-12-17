# Modern React Forms — Portfolio Showcase

This project demonstrates how I build modern, accessible, and type‑safe forms in React. It’s a portfolio piece that highlights best practices for validation, UX, and developer ergonomics using React, TypeScript, react‑hook‑form, Zod, and Vite.

## Highlights

- Type‑safe validation with Zod, wired into react‑hook‑form via the Zod resolver
- Client‑side validation messages with friendly error text
- Conditional fields: the Website field appears only when a Company is entered
- Async submission state with a disabled button and a “Sending…” label
- Accessible labels and focus styles out of the box
- Modern styling with utility classes (Tailwind)
- Lightweight build and dev server via Vite + React + TypeScript

## Tech Stack

- React + TypeScript
- Vite
- react‑hook‑form
- Zod (+ @hookform/resolvers)
- Tailwind CSS

## Form Schema & Rules (excerpt)

The form collects basic contact information and a message, with validation enforced by Zod:

- firstName: required, minimum 2 characters
- lastName: required, minimum 2 characters
- company: optional
- website: optional, must be a valid URL if provided (only shown when company has a value)
- email: required, must be a valid email
- message: required, minimum 10 characters

Validation is defined once in a Zod schema and inferred as TypeScript types for full type safety.

## Getting Started

Prerequisites: Node.js 18+ recommended.

1. Install dependencies
   - npm install
2. Start the dev server
   - npm run dev
3. Build for production
   - npm run build
4. Preview the production build (optional)
   - npm run preview

Then open the local URL shown in your terminal to try the form.

## Project Structure (key files)

- src/component/form.tsx — form component with react‑hook‑form + Zod
- src/App.tsx — mounts the form
- src/main.tsx — React app bootstrap
- src/index.css — global styles and Tailwind import

## Accessibility & UX Notes

- Explicit labels: every control has a visible `<label>` tied via `htmlFor`
- Programmatic error linking: errors use `aria-describedby` to point to field-specific messages
- Screen reader announcement: error messages are rendered with `role="alert"` for immediate announcement
- Valid/invalid state: fields toggle `aria-invalid` based on Zod/react-hook-form validation
- Required cues: required fields set `aria-required="true"` and include visual indicators (`*` in labels)
- Submission state: the `<form>` exposes `aria-busy` while submitting; the submit button sets `disabled` and `aria-disabled`
- Native validation disabled: `noValidate` on the `<form>` prevents conflicting browser tooltips in favor of accessible custom messages
- Keyboard and focus: custom focus styles make tab order and active elements clearly visible
- Helpful input types: `type="email"`, `type="url"`, and `inputMode`/`autoComplete` hints improve mobile and assistive tech UX
- Conditional fields: the Website input is only rendered when Company has a value, keeping DOM order and focus behavior predictable

## Customization

- Validation: edit the Zod schema in `src/component/form.tsx`
- Fields: add/remove inputs and register them with `react-hook-form`
- Styles: adjust utility classes in the JSX or extend `src/index.css`

## Why This Matters

Forms are critical UX. This example shows how I approach correctness (schema validation), resilience (type‑safety), accessibility, and a smooth developer workflow.

## License

This project is provided for portfolio demonstration purposes. Feel free to reference the structure and patterns.
