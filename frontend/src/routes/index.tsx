import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS, type BlogPost } from '@/data/mockData'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
        {BLOG_POSTS.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      <nav className="mt-24 flex justify-center items-center gap-12">
        <button className="relative active:scale-95 transition-transform duration-75">
          <div className="absolute -right-1 -bottom-1 w-full h-full hatch-shadow"></div>
          <div className="relative bg-[#36454F] text-[#F5F5DC] font-typewriter font-bold px-8 py-3 stamp-btn border-2 border-[#36454F]">
            Prev
          </div>
        </button>
        <div className="font-typewriter text-sm opacity-50">Page IV of XII</div>
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

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className={`relative group ${post.rotationClass || ''}`}>
      <div className="absolute inset-0 translate-x-3 translate-y-3 hatch-shadow group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-200"></div>
      <div className="relative bg-white p-8 torn-edge sketchy-border min-h-[400px] flex flex-col">
        <header className="mb-6">
          <h3 className="font-typewriter font-bold text-2xl text-[#202f38] leading-tight">{post.title}</h3>
          <div className="w-full h-px bg-[#36454f33] mt-2"></div>
        </header>
        <div className="flex-grow">
          <p className="font-typewriter text-[#43474b] line-clamp-6 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <footer className="mt-8 pt-4 border-t border-dashed border-[#36454f33] flex justify-between items-end font-typewriter text-xs">
          <span className="font-bold">Author: {post.author}</span>
          <span className="opacity-60 italic">{post.date}</span>
        </footer>
      </div>
    </article>
  )
}


