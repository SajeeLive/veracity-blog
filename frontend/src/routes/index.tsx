import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc/client'
import { useAppStore } from '@/store/appStore'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const searchQuery = useAppStore((state) => state.searchQuery);

  // TODO: preloader
  const { data, isLoading, error } = useQuery(
    trpc.blog.getAllBlogs.queryOptions({
      search: searchQuery || undefined,
      take: 6,
    })
  );

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
      {isLoading ? (
        <div className="text-center font-typewriter text-lg">Loading dispatches...</div>
      ) : error ? (
        <div className="text-center font-typewriter text-red-600">Error: {error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {data?.map((post: any, index: number) => {
            // Apply slight rotation for visual interest based on index
            const rotationClass = index % 3 === 1 ? 'rotate-1' : index % 3 === 2 ? '-rotate-1' : '';
            return (
              <Link to="/blog/$blogId" params={{ blogId: post.id }} key={post.id} className="block group">
                <BlogCard post={{...post, rotationClass}} />
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      <nav className="mt-24 flex justify-center items-center gap-4 md:gap-12">
        <button className="relative active:scale-95 transition-transform duration-75">
          <div className="absolute -right-1 -bottom-1 w-full h-full hatch-shadow"></div>
          <div className="relative bg-[#36454F] text-[#F5F5DC] font-typewriter font-bold px-8 py-3 stamp-btn border-2 border-[#36454F]">
            Prev
          </div>
        </button>
        <div className="font-typewriter text-sm opacity-50">Page I</div>
        <button className="relative active:scale-95 transition-transform duration-75">
          <div className="absolute -right-1 -bottom-1 w-full h-full hatch-shadow"></div>
          <div className="relative bg-[#36454F] text-[#F5F5DC] font-typewriter font-bold px-8 py-3 stamp-btn border-2 border-[#36454F]">
            Next
          </div>
        </button>
      </nav>
    </>
  )
}

function BlogCard({ post }: { post: any }) {
  // Format date to Roman numerals/vintage format if needed, or just use toLocaleDateString
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  return (
    <article className={`relative h-full ${post.rotationClass || ''}`}>
      <div className="absolute inset-0 translate-x-3 translate-y-3 hatch-shadow group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-200"></div>
      <div className="relative h-full bg-white p-8 torn-edge sketchy-border min-h-[400px] flex flex-col">
        <header className="mb-6">
          <h3 className="font-typewriter font-bold text-2xl text-[#202f38] leading-tight">{post.title}</h3>
          <div className="w-full h-px bg-[#36454f33] mt-2"></div>
        </header>
        <div className="flex-grow">
          <p className="font-typewriter text-[#43474b] line-clamp-6 leading-relaxed">
            {post.content.substring(0, 150)}... {/* Using content as excerpt for now */}
          </p>
        </div>
        <footer className="mt-8 pt-4 border-t border-dashed border-[#36454f33] flex justify-between items-end font-typewriter text-xs">
          <span className="font-bold">Author: {post.author.handle}</span>
          <span className="opacity-60 italic">{formattedDate}</span>
        </footer>
      </div>
    </article>
  )
}


