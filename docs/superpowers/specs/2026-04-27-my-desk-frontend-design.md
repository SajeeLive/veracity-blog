# Design Spec: My Desk Frontend Integration

## 1. Overview
Complete the "My Desk" frontend implementation to allow authenticated users to manage their blog posts. This includes listing posts, searching, and providing navigation to the creation flow.

## 2. Navigation & Header
- **Dynamic Header**:
  - Location check: If `pathname.startsWith('/my-desk')`.
  - Buttons:
    - `LogoutButton`: Existing.
    - `WriteButton`: New, links to `/my-desk/blog/write`.
    - `MyDeskButton`: Hidden if on `/my-desk`.
  - Search: Use existing `Header.Search` connected to `appStore.searchQuery`.

## 3. My Desk Index (`/my-desk/index.tsx`)
- **Query**: Use `trpc.myDesk.getMyBlogs.useInfiniteQuery` with `take: 10`.
- **Search**: React to `appStore.debouncedSearchQuery`.
- **Layout**: 
  - Grid (1 col mobile, 2 col md, 3 col lg).
  - Cards with random/asymmetric rotations (-2deg to 2deg).
- **Card Content**:
  - Title, snippet (content), date.
  - Edit/Delete actions (placeholders for now if not defined in router).

## 4. Components
- **MyBlogCard**:
  - Follow React compound pattern (Root, Title, Content, Metadata, Actions).
  - Children/Sub-components to include:
    1. **Title**: Blog title.
    2. **Content**: Snippet of blog content.
    3. **CreatedAt**: Date of creation.
    4. **UpdatedAt**: Date of last update.
    5. **Status**: Indicator if blog `isDeleted`.
  - Add "Edit" link to `/my-desk/blog/$blogId`.
  - Remove "Author" section (redundant for My Desk).

## 5. Visual Style
- **Theme**: Vintage ledger/typewriter.
- **Background**: Paper texture overlay.
- **Borders**: Sketchy/hand-drawn.
- **Shadows**: Cross-hatch/hatch-shadow.

## 6. Success Criteria
- [ ] List user's blogs on `/my-desk`.
- [ ] Search works via Header search bar.
- [ ] Pagination/Infinite scroll works.
- [ ] Header shows "Write" and "Logout" on My Desk page.
- [ ] Layout matches `my-desk-template.html` aesthetics.
