import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-[3px] group-[.toaster]:border-primary group-[.toaster]:shadow-[4px_4px_0px_#36454F] group-[.toaster]:font-mono group-[.toaster]:rounded-none paper-texture sketch-border",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:font-mono",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-none group-[.toast]:font-mono",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-none group-[.toast]:font-mono",
          success: "group-[.toaster]:!border-green-800 group-[.toaster]:!text-green-800",
          error: "group-[.toaster]:!border-destructive group-[.toaster]:!text-destructive",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
