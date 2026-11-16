// Radix-based shadcn/ui Dialog composition; deliberately static in every state.
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRef, type ReactNode } from "react";
import { X } from "lucide-react";
export function Modal({
  open,
  onOpenChange,
  title,
  children,
  trigger,
  variant,
  description,
  placement = "center",
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  children: ReactNode;
  trigger?: ReactNode;
  variant: string;
  description?: string;
  placement?: "center" | "drawer";
}) {
  const returnFocus = useRef<HTMLElement | null>(null);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal
        container={document.getElementById(`${variant}-portal`) || undefined}
      >
        <div className={`portal-scope ${variant}`}>
          <DialogPrimitive.Overlay className="dialog-overlay" />
          <DialogPrimitive.Content
            className={`dialog-content ${placement}`}
            onOpenAutoFocus={() => {
              returnFocus.current = document.activeElement as HTMLElement;
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              returnFocus.current?.focus();
            }}
          >
            <div className="dialog-heading">
              <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
              <DialogPrimitive.Close
                className="icon-button"
                aria-label="Close dialog"
              >
                <X aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>
            <DialogPrimitive.Description
              className={description ? "" : "sr-only"}
            >
              {description ||
                "Use the controls to explore. Escape closes this dialog."}
            </DialogPrimitive.Description>
            {children}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
