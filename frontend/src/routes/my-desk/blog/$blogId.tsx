import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { trpc, queryClient } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { BlogDetailsCard } from '@/components/BlogDetailsCard'
import { toast } from 'sonner'
import { BLOG_LIMITS } from '@/lib/constants'
import { useFormFlow } from '@/hooks/useFormFlow'

export const Route = createFileRoute('/my-desk/blog/$blogId')({
  component: AuthorBlogPreview,
})

const UpdateBlogSchema = z.object({
  title: z.string().min(BLOG_LIMITS.TITLE.MIN, `Title must be at least ${BLOG_LIMITS.TITLE.MIN} characters`).max(BLOG_LIMITS.TITLE.MAX, `Title cannot exceed ${BLOG_LIMITS.TITLE.MAX} characters`),
  content: z.string().min(BLOG_LIMITS.CONTENT.MIN, `Content must be at least ${BLOG_LIMITS.CONTENT.MIN} characters`).max(BLOG_LIMITS.CONTENT.MAX, `Content cannot exceed ${BLOG_LIMITS.CONTENT.MAX.toLocaleString()} characters`),
  isDeleted: z.boolean(),
})

function AuthorBlogPreview() {
  const { blogId } = Route.useParams()
  const flow = useFormFlow()

  const { data: blog, isLoading, error } = useQuery(
    trpc.myDesk.getMyBlogById.queryOptions({ id: blogId })
  )

  const updateMutation = useMutation(
    trpc.myDesk.updateMyBlog.mutationOptions({
      onSuccess: () => {
        flow.succeedSubmit()
        queryClient.invalidateQueries(trpc.myDesk.getMyBlogById.queryOptions({ id: blogId }))
        queryClient.invalidateQueries(trpc.myDesk.getMyBlogs.queryOptions({}))
        // Also invalidate public blog query if it exists
        queryClient.invalidateQueries(trpc.blog.getBlogById.queryOptions({ id: blogId }))
        toast.success('Record Applied', {
          description: 'The ledger has been updated and sealed with the new entry.',
        })
      },
      onError: (err) => {
        flow.failSubmit(err.message)
        toast.error('Sealing Failed', {
          description: `The archival process encountered an error: ${err.message}`,
        })
      }
    })
  )

  const form = useForm({
    defaultValues: {
      title: blog?.title || '',
      content: blog?.content || '',
      isDeleted: blog?.isDeleted || false,
    },
    onSubmit: async ({ value }) => {
      if (flow.state.status === 'error') {
        flow.retrySubmit()
      }
      flow.startSubmit()
      await updateMutation.mutateAsync({
        id: blogId,
        ...value,
      })
    },
    validators: {
      onSubmit: UpdateBlogSchema,
    },
  })

  // Sync form when blog data loads
  if (blog && form.state.values.title === '' && blog.title !== '') {
    form.setFieldValue('title', blog.title)
    form.setFieldValue('content', blog.content)
    form.setFieldValue('isDeleted', blog.isDeleted)
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <BlogDetailsCard.Skeleton />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="text-center py-20 font-typewriter text-destructive">
        Error: The ledger entry could not be retrieved.
      </div>
    )
  }

  const formattedCreatedAt = new Date(blog.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const formattedUpdatedAt = new Date(blog.updatedAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link to="/my-desk">
          <Button variant="outline" className="font-typewriter flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Desk
          </Button>
        </Link>
      </div>

      <div className="relative">
        {/* Cross-hatch "shadow" */}
        <div className="absolute inset-0 translate-x-3 translate-y-3 cross-hatch border-[2px] border-slate-800 opacity-20 pointer-events-none bg-white"></div>
        
        {/* The Paper Canvas */}
        <div className="relative paper-texture p-8 md:p-16 min-h-[600px] border-[3px] border-slate-800 sketch-border flex flex-col">
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col flex-grow"
          >
            {/* Error Banner */}
            {flow.state.status === 'error' && (
              <div
                role="alert"
                className="mb-8 p-4 sketchy-border bg-destructive/10 text-destructive text-sm font-mono text-center hatch-shadow"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span className="font-bold uppercase tracking-wider">Archival Error</span>
                </div>
                <p>{flow.state.message}</p>
              </div>
            )}

            {/* Header Area */}
            <div className="mb-12 border-b border-slate-300 pb-6">
              <form.Field
                name="title"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <input
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        if (flow.state.status === 'error') flow.retrySubmit()
                      }}
                      onBlur={field.handleBlur}
                      className="text-4xl md:text-5xl font-serif text-slate-800 bg-transparent border-b-2 border-dashed border-slate-300 focus:border-slate-800 focus:ring-0 p-2 placeholder-slate-300 leading-tight writing-field w-full"
                      placeholder="Title of your entry..."
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                      <em className="text-xs text-destructive font-mono">
                        {field.state.meta.errors.map((err: any) => typeof err === 'object' && err?.message ? err.message : String(err)).join(', ')}
                      </em>
                    ) : null}
                  </div>
                )}
              />
              <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
                <div className="font-mono text-xs text-slate-500 uppercase tracking-widest">
                   Created: {formattedCreatedAt} | Last Revision: {formattedUpdatedAt}
                </div>
                
                <form.Field
                  name="isDeleted"
                  children={(field) => (
                    <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.checked)
                          if (flow.state.status === 'error') flow.retrySubmit()
                        }}
                        className="w-4 h-4 border-2 border-slate-800 rounded-none bg-transparent checked:bg-slate-800"
                      />
                      <span className={field.state.value ? "text-destructive font-bold" : "text-slate-500"}>
                        {field.state.value ? "Marked for Disposal" : "Active Record"}
                      </span>
                    </label>
                  )}
                />
              </div>
            </div>

            {/* Focused Writing Interface */}
            <div className="flex-grow">
              <form.Field
                name="content"
                children={(field) => (
                  <div className="flex flex-col h-full gap-2">
                    <textarea
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        if (flow.state.status === 'error') flow.retrySubmit()
                      }}
                      onBlur={field.handleBlur}
                      className="w-full h-[600px] bg-transparent border-none focus:ring-0 font-typewriter text-lg md:text-xl text-slate-700 leading-[2.5rem] resize-none placeholder-slate-300 ruled-paper px-2 writing-field"
                      placeholder="Begin your correspondence here..."
                      spellCheck="false"
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                      <em className="text-xs text-destructive font-mono">
                        {field.state.meta.errors.map((err: any) => typeof err === 'object' && err?.message ? err.message : String(err)).join(', ')}
                      </em>
                    ) : null}
                  </div>
                )}
              />
            </div>

            {/* Footer Tally Marks & Word Count & Submit Button */}
            <div className="mt-12 flex flex-col md:flex-row justify-between items-center md:items-end border-t border-slate-200 pt-8 gap-8">
              <form.Subscribe
                selector={(state) => [state.values.title, state.values.content]}
                children={([title, content]) => (
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full md:w-auto font-mono text-xs text-slate-400 uppercase tracking-wider">
                    <div className="flex flex-col border-l-2 border-slate-200 pl-3">
                      <span className="text-[10px] opacity-60">Title Volume</span>
                      <span className="font-bold text-slate-600">{(title || '').length} / {BLOG_LIMITS.TITLE.MAX}</span>
                    </div>
                    <div className="flex flex-col border-l-2 border-slate-200 pl-3">
                      <span className="text-[10px] opacity-60">Content Volume</span>
                      <span className="font-bold text-slate-600">{(content || '').length} / {BLOG_LIMITS.CONTENT.MAX.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              />

              <div className="flex flex-col items-center gap-6 w-full md:w-auto">
                <div className="flex flex-col items-center gap-2">
                  {/* Submit Action: Seal */}
                  <button 
                    type="submit"
                    disabled={flow.state.status === 'submitting'}
                    className="w-20 h-20 bg-red-900 text-white flex items-center justify-center -rotate-2 hover:rotate-0 transition-transform active:scale-95 group shadow-xl disabled:opacity-50 disabled:grayscale relative"
                    title={flow.state.status === 'error' ? "Retry Seal" : "Apply Seal (Save Changes)"}
                  >
                    <span className="material-symbols-outlined text-4xl">
                      {flow.state.status === 'submitting' ? 'sync' : flow.state.status === 'error' ? 'history' : 'verified'}
                    </span>
                  </button>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-900 font-bold">
                    {flow.state.status === 'submitting' ? 'Sealing...' : flow.state.status === 'error' ? 'Try Again' : 'Apply Seal'}
                  </span>
                </div>

                <div className="flex gap-2 opacity-20">
                  <div className="w-1 h-6 bg-slate-800 rotate-12"></div>
                  <div className="w-1 h-6 bg-slate-800 -rotate-6"></div>
                  <div className="w-1 h-6 bg-slate-800 rotate-3"></div>
                  <div className="w-1 h-6 bg-slate-800 -rotate-12"></div>
                  <div className="w-6 h-1 bg-slate-800 -translate-x-6 translate-y-3 -rotate-12"></div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
