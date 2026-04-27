import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { useAppStore } from '@/store/appStore'
import { MyBlogCard, type MyBlog } from '@/components/MyBlogCard'
import { useState, useEffect, useMemo } from 'react'

export const Route = createFileRoute('/my-desk/')({
  component: MyDeskIndex,
})

const rotations = ['rotate-[-1.5deg]', 'rotate-[0.5deg]', 'rotate-[-2deg]', 'rotate-[1.2deg]', 'rotate-[-0.8deg]'];

function MyDeskIndex() {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const debouncedSearchQuery = useAppStore((state) => state.debouncedSearchQuery);
  const setIsSearching = useAppStore((state) => state.setIsSearching);

  const [pageIndex, setPageIndex] = useState(0);
  const [lastQuery, setLastQuery] = useState(debouncedSearchQuery);

  if (debouncedSearchQuery !== lastQuery) {
    setPageIndex(0);
    setLastQuery(debouncedSearchQuery);
  }

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    trpc.myDesk.getMyBlogs.infiniteQueryOptions(
      {
        search: debouncedSearchQuery || undefined,
        take: 6,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  );

  // Sync searching state to store
  useEffect(() => {
    if (!isFetching) {
      setIsSearching(false);
    }
  }, [isFetching, setIsSearching]);

  const currentPageData = useMemo(() => {
    return (data?.pages[pageIndex]?.items as MyBlog[]) || [];
  }, [data, pageIndex]);

  const handleNext = () => {
    if (data?.pages[pageIndex + 1]) {
      setPageIndex(pageIndex + 1);
    } else if (hasNextPage) {
      fetchNextPage().then(() => {
        setPageIndex(pageIndex + 1);
      });
    }
  };

  const handlePrev = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const romanPages = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const pageLabel = romanPages[pageIndex] || `Page ${pageIndex + 1}`;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto pb-20 min-h-[800px] grid-auto-rows-min">
        {isLoading || (isFetching && !data) ? (
          Array.from({ length: 6 }).map((_, index) => {
            const rotationClass = rotations[index % rotations.length];
            return <MyBlogCard.Skeleton key={index} rotationClass={rotationClass} />;
          })
        ) : error ? (
          <div className="col-span-full text-center font-typewriter text-red-600">Error: {error.message}</div>
        ) : currentPageData.length === 0 ? (
          <div className="col-span-full text-center font-typewriter text-lg opacity-50 mt-12 italic">
            No manuscripts found in the archives for "{searchQuery}"
          </div>
        ) : (
          currentPageData.map((blog: MyBlog, index: number) => (
            <MyBlogCard key={blog.id} blog={blog} rotationClass={rotations[index % rotations.length]}>
              <MyBlogCard.Status />
              <MyBlogCard.Title />
              <MyBlogCard.Content />
              <MyBlogCard.CreatedAt />
              <MyBlogCard.UpdatedAt />
              <MyBlogCard.Actions />
            </MyBlogCard>
          ))
        )}
      </div>

      {/* Pagination */}
      <nav className="mt-24 flex justify-center items-center gap-4 md:gap-12">
        <button
          onClick={handlePrev}
          disabled={pageIndex === 0}
          className={`relative active:scale-95 transition-transform duration-75 ${pageIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <div className="absolute -right-1 -bottom-1 w-full h-full hatch-shadow"></div>
          <div className="relative bg-[#36454F] text-[#F5F5DC] font-typewriter font-bold px-8 py-3 stamp-btn border-2 border-[#36454F]">
            Prev
          </div>
        </button>

        <div className="font-typewriter text-sm opacity-50 flex flex-col items-center">
          <span>{pageLabel}</span>
          {(isFetchingNextPage || (isFetching && data)) && <span className="text-[10px] animate-pulse">Syncing...</span>}
        </div>

        <button
          onClick={handleNext}
          disabled={!hasNextPage && !data?.pages[pageIndex + 1]}
          className={`relative active:scale-95 transition-transform duration-75 ${(!hasNextPage && !data?.pages[pageIndex + 1]) ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <div className="absolute -right-1 -bottom-1 w-full h-full hatch-shadow"></div>
          <div className="relative bg-[#36454F] text-[#F5F5DC] font-typewriter font-bold px-8 py-3 stamp-btn border-2 border-[#36454F]">
            Next
          </div>
        </button>
      </nav>
    </>
  )
}
