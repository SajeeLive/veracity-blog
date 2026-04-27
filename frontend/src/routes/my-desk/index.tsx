import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { useAppStore } from '@/store/appStore'
import { MyBlogCard, type MyBlog } from '@/components/MyBlogCard'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export const Route = createFileRoute('/my-desk/')({
  component: MyDeskIndex,
})

const rotations = ['rotate-[-1.5deg]', 'rotate-[0.5deg]', 'rotate-[-2deg]', 'rotate-[1.2deg]', 'rotate-[-0.8deg]'];

function MyDeskIndex() {
  const debouncedSearchQuery = useAppStore((state) => state.debouncedSearchQuery);
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    trpc.myDesk.getMyBlogs.infiniteQueryOptions(
      { search: debouncedSearchQuery, take: 6 },
      {
        getNextPageParam: (lastPage: { nextCursor?: { id: string } }) => lastPage.nextCursor,
        initialPageParam: undefined as { id: string } | undefined,
      }
    )
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === 'pending') return <div className="text-center font-mono opacity-50 py-20">Opening archives...</div>;
  if (status === 'error') return <div className="text-center font-mono text-error py-20">Failed to reach the desk.</div>;

  const blogs = data.pages.flatMap((page) => page.items) as MyBlog[];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto pb-20">
        {blogs.map((blog: MyBlog, index: number) => (
          <MyBlogCard key={blog.id} blog={blog} rotationClass={rotations[index % rotations.length]}>
            <MyBlogCard.Status />
            <MyBlogCard.Title />
            <MyBlogCard.Content />
            <MyBlogCard.CreatedAt />
            <MyBlogCard.UpdatedAt />
            <MyBlogCard.Actions />
          </MyBlogCard>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-20 sketchy-border border-dashed opacity-50">
          <p className="font-serif italic text-xl">No manuscripts found.</p>
          <p className="font-mono text-sm mt-2">Start writing your first entry.</p>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-10 flex justify-center items-center">
        {isFetchingNextPage && <span className="material-symbols-outlined animate-spin" data-icon="progress_activity">progress_activity</span>}
      </div>
    </div>
  )
}
