import { render, screen } from '@testing-library/react';
import { MyBlogCard } from './MyBlogCard';
import { describe, it, expect, vi } from 'vitest';

// Mock Link from @tanstack/react-router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

describe('MyBlogCard', () => {
  const mockBlog = {
    id: '1',
    title: 'Test Blog',
    content: 'Test Content',
    createdAt: '2026-04-26T10:00:00.000Z',
    updatedAt: '2026-04-26T11:00:00.000Z',
    isDeleted: false,
  };

  it('renders blog title and content', () => {
    render(
      <MyBlogCard blog={mockBlog}>
        <MyBlogCard.Title />
        <MyBlogCard.Content />
      </MyBlogCard>
    );

    expect(screen.getByText('Test Blog')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders metadata correctly', () => {
    render(
      <MyBlogCard blog={mockBlog}>
        <MyBlogCard.CreatedAt />
        <MyBlogCard.UpdatedAt />
      </MyBlogCard>
    );

    // Date formatting in MyBlogCard: .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    // For 2026-04-26 it should be "26 APR 2026"
    expect(screen.getByText(/Created: 26 APR 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Updated: 26 APR 2026/i)).toBeInTheDocument();
  });

  it('shows deleted status when isDeleted is true', () => {
    render(
      <MyBlogCard blog={{ ...mockBlog, isDeleted: true }}>
        <MyBlogCard.Status />
      </MyBlogCard>
    );

    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  it('does not show deleted status when isDeleted is false', () => {
    render(
      <MyBlogCard blog={mockBlog}>
        <MyBlogCard.Status />
      </MyBlogCard>
    );

    expect(screen.queryByText('Deleted')).not.toBeInTheDocument();
  });

  it('renders actions with link to edit', () => {
    render(
      <MyBlogCard blog={mockBlog}>
        <MyBlogCard.Actions />
      </MyBlogCard>
    );

    const link = screen.getByText('Edit Manuscript');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/my-desk/blog/$blogId');
  });
});
