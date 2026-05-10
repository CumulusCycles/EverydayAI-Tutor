# Session 11 — Chatbot UI

**Branch:** `feature/chatbot-ui`
**Date:** May 10, 2026

---

## Goal

Build the React floating chat widget that connects to the API Gateway endpoint and lets users ask plain English questions about the site and content.

---

## Prompts

### Prompt 1

> Build a floating chat widget for the frontend that connects to the chatbot API.

1. src/components/ChatWidget.tsx — floating chat bubble + panel:
   - Fixed position, bottom-right corner
   - Collapsed state: orange circular button with chat icon
   - Expanded state: chat panel with message history, input field, send button
   - Calls POST /chat on the API Gateway endpoint (VITE_CHAT_API_URL from env)
   - Sends { message: string }, receives { response: string, citations: [] }
   - Shows citations as small source links below the response if present
   - Loading state while waiting for response
   - Error state if the request fails
   - Styled consistently with the site — use brand colors (orange #F97316, navy #0F172A, Tailwind classes)

2. src/App.tsx — add <ChatWidget /> so it appears on every page

3. .env.example — add VITE_CHAT_API_URL=https://your-api-gateway-url/chat

4. .env — add VITE_CHAT_API_URL with the actual ChatApiUrl output from the CDK deploy (check infrastructure CDK outputs or the GitHub Actions deploy log for the value)

Run lint and build checks when done.

### Result

Lint clean, build passes (54 modules — up from 53, ChatWidget picked up). Here's what was created/updated:

  - src/components/ChatWidget.tsx — floating orange bubble, expands to 360×480px chat panel; user messages in orange, assistant in beige; citation source badges below responses;
  loading "Thinking…" state; error message; Enter to send
  - src/App.tsx — <ChatWidget /> added after <Footer /> (fixed-position, outside the flex-col flow)
  - src/vite-env.d.ts — VITE_CHAT_API_URL declared in ImportMetaEnv
  - .env.example — VITE_CHAT_API_URL=https://your-api-gateway-url/chat appended
  - .env — actual API Gateway URL appended (gitignored, not committed)

  Ready to /ship.

---

## Notes

