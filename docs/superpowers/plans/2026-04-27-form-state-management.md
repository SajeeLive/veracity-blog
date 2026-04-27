# Form State Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement FSM pattern for form state management in blog routes and centralize character limit constants.

**Architecture:** Use `useReducer` for FSM in React components and refactor Zod schemas to use shared constants.

**Tech Stack:** React, TanStack Form, TanStack Query, Zod, NestJS.

---

### Task 1: Centralize Backend Constants

**Files:**
- Modify: `backend/src/my-desk/my-desk.types.ts`

- [ ] **Step 1: Add BLOG_LIMITS constant**
```typescript
export const BLOG_LIMITS = {
  TITLE: { MIN: 5, MAX: 100 },
  CONTENT: { MIN: 10, MAX: 10000 },
} as const;
```

- [ ] **Step 2: Update schemas to use constants**
```typescript
export const UpdateMyBlogSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(BLOG_LIMITS.TITLE.MIN).max(BLOG_LIMITS.TITLE.MAX).optional(),
  content: z.string().min(BLOG_LIMITS.CONTENT.MIN).max(BLOG_LIMITS.CONTENT.MAX).optional(),
  isDeleted: z.boolean().optional(),
});

export const CreateMyBlogSchema = z.object({
  title: z.string().min(BLOG_LIMITS.TITLE.MIN).max(BLOG_LIMITS.TITLE.MAX),
  content: z.string().min(BLOG_LIMITS.CONTENT.MIN).max(BLOG_LIMITS.CONTENT.MAX),
});
```

- [ ] **Step 3: Commit changes**
```bash
git add backend/src/my-desk/my-desk.types.ts
git commit -m "feat(backend): centralize blog character limits"
```

### Task 2: Implement FSM in Create Blog Route

**Files:**
- Modify: `frontend/src/routes/my-desk/blog/write.tsx`

- [ ] **Step 1: Define Reducer and Hook**
Add `FormState`, `FormAction`, `formReducer`, and `useFormFlow` to the file.

- [ ] **Step 2: Integrate FSM into Component**
- Use `useFormFlow` hook.
- Trigger `SUBMIT` in `onSubmit`.
- Trigger `SUCCESS` in `onSuccess`.
- Trigger `FAIL` in `onError`.
- Update button text and disabled states based on `flow.state.status`.

- [ ] **Step 3: Add Error Banner**
Show a stylized error banner if `status === 'error'`.

- [ ] **Step 4: Commit changes**
```bash
git add frontend/src/routes/my-desk/blog/write.tsx
git commit -m "feat(frontend): implement FSM for create blog form"
```

### Task 3: Implement FSM in Edit Blog Route

**Files:**
- Modify: `frontend/src/routes/my-desk/blog/$blogId.tsx`

- [ ] **Step 1: Define Reducer and Hook**
Add `FormState`, `FormAction`, `formReducer`, and `useFormFlow` to the file (consistent with Task 2).

- [ ] **Step 2: Integrate FSM into Component**
- Use `useFormFlow` hook.
- Trigger `SUBMIT` in `onSubmit`.
- Trigger `SUCCESS` in `onSuccess`.
- Trigger `FAIL` in `onError`.
- Update button text and disabled states based on `flow.state.status`.

- [ ] **Step 3: Add Error Banner**
Show a stylized error banner if `status === 'error'`.

- [ ] **Step 4: Commit changes**
```bash
git add frontend/src/routes/my-desk/blog/$blogId.tsx
git commit -m "feat(frontend): implement FSM for edit blog form"
```

### Task 4: Final Verification

- [ ] **Step 1: Verify Create Flow**
Manual test: Create a blog with valid and invalid data. Check UI states.

- [ ] **Step 2: Verify Edit Flow**
Manual test: Edit a blog with valid and invalid data. Check UI states.

- [ ] **Step 3: Run Backend Linter/Types**
Run: `cd backend && npm run lint` (or equivalent)
Run: `cd backend && npx tsc --noEmit`
