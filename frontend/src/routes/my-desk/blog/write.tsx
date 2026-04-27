import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { trpc, queryClient } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'

export const Route = createFileRoute('/my-desk/blog/write')({
  component: WriteBlogPost,
})

const CreateBlogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(10000, 'Content cannot exceed 10,000 characters'),
})

function WriteBlogPost() {
  const navigate = useNavigate()

  const createMutation = useMutation(
    trpc.myDesk.createMyBlog.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.myDesk.getMyBlogs.queryOptions({}))
        toast.success('Record Created', {
          description: 'The ledger has been updated and a new entry has been sealed.',
        })
        // Redirect to the edit/preview page of the newly created blog
        navigate({ to: '/my-desk/blog/$blogId', params: { blogId: data.id } })
      },
      onError: (err) => {
        toast.error('Creation Failed', {
          description: `The archival process encountered an error: ${err.message}`,
        })
      }
    })
  )

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(value)
    },
    validators: {
      onChange: CreateBlogSchema,
    },
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
            {/* Header Area */}
            <div className="mb-12 border-b border-slate-300 pb-6">
              <form.Field
                name="title"
                children={(field) => (
                  <div className="flex flex-col gap-2">
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="text-4xl md:text-5xl font-serif text-slate-800 bg-transparent border-b-2 border-dashed border-slate-300 focus:border-slate-800 focus:ring-0 p-2 placeholder-slate-300 leading-tight writing-field w-full"
                      placeholder="Title of your new entry..."
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                      <em className="text-xs text-destructive font-mono">{field.state.meta.errors.join(', ')}</em>
                    ) : null}
                  </div>
                )}
              />
              <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
                <div className="font-mono text-xs text-slate-500 uppercase tracking-widest">
                   New Ledger Entry | Draft Status: Active
                </div>
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
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-full h-[600px] bg-transparent border-none focus:ring-0 font-typewriter text-lg md:text-xl text-slate-700 leading-[2.5rem] resize-none placeholder-slate-300 ruled-paper px-2 writing-field"
                      placeholder="Begin your correspondence here..."
                      spellCheck="false"
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                      <em className="text-xs text-destructive font-mono">{field.state.meta.errors.join(', ')}</em>
                    ) : null}
                  </div>
                )}
              />
            </div>

            {/* Footer Tally Marks & Word Count & Submit Button */}
            <div className="mt-12 flex flex-col md:flex-row justify-between items-center md:items-end border-t border-slate-200 pt-8 gap-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full md:w-auto font-mono text-xs text-slate-400 uppercase tracking-wider">
                <div className="flex flex-col border-l-2 border-slate-200 pl-3">
                  <span className="text-[10px] opacity-60">Title Volume</span>
                  <span className="font-bold text-slate-600">{form.getFieldValue('title').length} / 100</span>
                </div>
                <div className="flex flex-col border-l-2 border-slate-200 pl-3">
                  <span className="text-[10px] opacity-60">Content Volume</span>
                  <span className="font-bold text-slate-600">{form.getFieldValue('content').length} / 10,000</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 w-full md:w-auto">
                <div className="flex flex-col items-center gap-2">
                  {/* Submit Action: Seal */}
                  <button 
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-20 h-20 bg-red-900 text-white flex items-center justify-center -rotate-2 hover:rotate-0 transition-transform active:scale-95 group shadow-xl disabled:opacity-50 disabled:grayscale relative"
                    title="Apply Seal (Create Entry)"
                  >
                    <span className="material-symbols-outlined text-4xl">
                      {createMutation.isPending ? 'sync' : 'verified'}
                    </span>
                  </button>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-900 font-bold">Apply Seal</span>
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
