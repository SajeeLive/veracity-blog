<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Form Implementation

When implementing forms (e.g., sign up, sign in, create blog):
- **Library:** Always use TanStack Form.
- **State Management:** Employ React `useReducer` and Finite State Machine (FSM) patterns to ensure form states are managed deterministically and are easy to reason about.
- **Form Submission:** Employ React `useTransition` for non-blocking form submission.

## State toggle
1. If a state toggle has a side-effect of making an API call (ex: toggle delete state of a Blog), employ React `useOptimistic` for non-blocking interaction.