# Design Spec: Back Navigation Button for Blog Details

## Overview
Add a "Back to Listing" navigation button on the blog details page (`/blog/$blogId`) to allow users to easily return to the main blog feed.

## Goals
- Provide a clear navigation path back to the home page.
- Maintain the project's unique "typewriter" and "sketchy" aesthetic.
- Ensure consistent layout and spacing with existing components.

## Proposed Changes

### Frontend

#### 1. Blog Details Page (`frontend/src/routes/blog/$blogId.tsx`)
- Import `Link` from `@tanstack/react-router`.
- Use Material Symbols icon `arrow_back` (consistent with `Header.tsx`).
- Import `Button` (or `buttonVariants`) from `@/components/ui/button`.
- Modify `RouteComponent` to include a navigation container above the `BlogDetailsCard`.

#### 2. Layout & Styling
- The button will use the `outline` variant of the `Button` component, which already includes the `.sketchy-border` class.
- The button will be wrapped in a `div` with `max-w-3xl mx-auto mb-8` to align with the blog card.
- Font will be `font-typewriter`.

## Architecture & Data Flow
- **Navigation:** Uses TanStack Router's `Link` for client-side navigation to `/`.
- **State:** No new state required.

## Testing Strategy
- **Manual Test:** 
    1. Navigate to `/`.
    2. Click on a blog post to go to `/blog/$blogId`.
    3. Verify the "Back" button appears above the post.
    4. Click the "Back" button and verify it returns to `/`.
- **Visual Check:** Verify the button follows the `sketchy-border` and `font-typewriter` styles.

## Success Criteria
- [ ] "Back" button is visible above the blog card.
- [ ] Clicking the button navigates to the root route.
- [ ] Styling matches the "veracity-blog" theme.
