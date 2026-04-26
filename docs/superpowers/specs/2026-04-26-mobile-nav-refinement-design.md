# Spec: Mobile Navigation Refinement

## 1. Problem Statement
The current mobile navigation drawer does not automatically close when a user navigates to a new page. Additionally, the buttons within the drawer are partially hardcoded and lack a dedicated "Close" button component that matches the project's styling.

## 2. Proposed Solution
Refine the `HeaderMobileMenu` to handle state locally and trigger closure on route changes. Extract and standardize the navigation buttons as separate functional components within the `Header` compound component.

### Behavioral Changes
- **Auto-Close**: The drawer will listen to location changes via `@tanstack/react-router` and close automatically upon successful navigation.
- **Controlled State**: Use a local `isOpen` state in `HeaderMobileMenu` to manage the drawer's visibility.

### Component Architecture
- **New Buttons**:
    - `Header.LoginButton`: Navigation to `/auth/sign-in`.
    - `Header.MyDeskButton`: Navigation to `/my-desk`.
    - `Header.LogoutButton`: Triggers logout action.
    - `Header.CloseButton`: Closes the drawer using `DrawerClose`.
- **Styling**: Ensure buttons inside the drawer use the same "stamped-ink" or "sketchy-border" styling as the rest of the application.

## 3. Technical Changes

### `frontend/src/components/Header.tsx`
- Refactor existing button components to be more reusable (pass optional `className` or `onClick`).
- Update `HeaderMobileMenu`:
    - Add `useState` for `open`.
    - Add `useEffect` with `useLocation` to set `open(false)` on path changes.
    - Pass `open` and `onOpenChange` to the `Drawer` component.
    - Use the new standardized button components inside `DrawerContent`.

## 4. Verification Plan
- **Manual Check**:
    - Open drawer on mobile.
    - Click "Log In". Verify drawer closes and user is on the Login page.
    - Click "My Desk" (when authenticated). Verify drawer closes and user is on the My Desk page.
    - Click "Close". Verify drawer closes.
- **Automated Check**:
    - Verify no console errors regarding state management or route transitions.
