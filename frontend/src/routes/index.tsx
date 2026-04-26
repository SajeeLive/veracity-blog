import { createFileRoute, Link } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { useAppStore } from '@/store/appStore'
import { useState, useEffect, useMemo } from 'react'
import { BlogCard, BlogCardSkeleton, type BlogPost } from '@/components/BlogCard'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const searchQuery = useAppStore((state) => state.searchQuery);
  const debouncedSearchQuery = useAppStore((state) => state.debouncedSearchQuery);
  const setIsSearching = useAppStore((state) => state.setIsSearching);
  
  const [pageIndex, setPageIndex] = useState(0);

  // Reset page index when search changes
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearchQuery]);

  const { 
    data, 
    isLoading, 
    isFetching,
    error, 
    fetchNextPage, 
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    trpc.blog.getAllBlogs.infiniteQueryOptions(
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
    return (data?.pages[pageIndex]?.items as BlogPost[]) || [];
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
      {/* Hero Section / Context */}
      <section className="mb-16 text-center">
        <h2 className="font-serif text-[48px] leading-[1.2] tracking-[-0.02em] text-[#202f38] mb-4 italic">Dispatch from the Inkwell</h2>
        <p className="font-typewriter text-[18px] leading-[1.6] text-[#43474b] max-w-2xl mx-auto italic opacity-75">
          Archived thoughts, analog meditations, and the slow resonance of the written word.
        </p>
      </section>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 min-h-[800px]">
        {isLoading || (isFetching && !data) ? (
          Array.from({ length: 6 }).map((_, index) => {
            const rotationClass = index % 3 === 1 ? 'rotate-1' : index % 3 === 2 ? '-rotate-1' : '';
            return <BlogCardSkeleton key={index} rotationClass={rotationClass} />;
          })
        ) : error ? (
          <div className="col-span-full text-center font-typewriter text-red-600">Error: {error.message}</div>
        ) : currentPageData.length === 0 ? (
          <div className="col-span-full text-center font-typewriter text-lg opacity-50 mt-12 italic">
            No dispatches found in the archives for "{searchQuery}"
          </div>
        ) : (
          currentPageData.map((post: BlogPost, index: number) => {
            // Apply slight rotation for visual interest based on index
            const rotationClass = index % 3 === 1 ? 'rotate-1' : index % 3 === 2 ? '-rotate-1' : '';
            return (
              <Link to="/blog/$blogId" params={{ blogId: post.id }} key={post.id} className="block group">
                <BlogCard post={post} rotationClass={rotationClass} />
              </Link>
            )
          })
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
