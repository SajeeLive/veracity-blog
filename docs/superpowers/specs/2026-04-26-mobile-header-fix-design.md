# Spec: Mobile Header Drawer Navigation

## 1. Problem Statement
The header title and action buttons (Log In, My Desk, Logout) collide on mobile devices because they are forced into a single horizontal row. A simple stacked layout might feel cluttered for more complex navigation.

## 2. Proposed Solution
Use a Shadcn UI Drawer to encapsulate all action buttons on mobile devices.

### Layout Behavior
- **Mobile (< 768px)**:
  - Title stays at the top, left-aligned.
  - A "Menu" icon (using `material-symbols-outlined` for consistency) appears on the right.
  - Clicking the icon opens a bottom drawer containing:
    - Navigation links (Log In, My Desk, Logout, etc.).
    - A clear header/title inside the drawer ("Navigation").
- **Desktop (>= 768px)**:
  - Title and buttons remain on the same horizontal line.
  - Title on left, buttons on right (current behavior).
  - Drawer menu icon is hidden.

## 3. Technical Changes

### `frontend/src/components/Header.tsx`
- Add `HeaderMobileMenu` component using `Drawer` from `@/components/ui/drawer`.
- Integrate `HeaderMobileMenu` into the `Header` compound component.
- Ensure the drawer content matches the authentication state.

### `frontend/src/routes/__root.tsx`
- Update the layout to include `Header.MobileMenu` for mobile view.
- Hide the desktop button group on mobile using `hidden md:flex`.

## 4. Verification Plan
- **Manual Visual Check**:
  - Open the application in a mobile-sized viewport (< 768px).
  - Verify "The Ledger" is on top-left and a menu icon is on the right.
  - Click the menu icon and verify the bottom drawer opens with the correct buttons.
  - Expand to desktop size and verify the original layout is preserved and the menu icon is gone.
