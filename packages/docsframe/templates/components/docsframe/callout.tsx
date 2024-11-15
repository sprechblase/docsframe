import { cn } from "@/lib/utils";

interface CalloutProps {
  children?: React.ReactNode;
  className: React.HTMLAttributes<HTMLHeadingElement>;
}

export function Callout({ children, className }: CalloutProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground bg-background text-foreground",
        className
      )}
    >
      <div className="text-sm [&_p]:leading-relaxed">{children}</div>
    </div>
  );
}
