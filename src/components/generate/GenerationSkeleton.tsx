import { Skeleton } from "@/components/ui/skeleton";

export function GenerationSkeleton() {
  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-test-id="generation-skeleton">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2" data-test-id={`skeleton-card-${index}`}>
          <Skeleton className="h-[60px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      ))}
    </div>
  );
}
