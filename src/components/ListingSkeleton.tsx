import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export function ListingSkeleton() {
  return (
    <Card className="h-full bg-neutral-900/40 border-neutral-800 rounded-none overflow-hidden">
      <CardHeader className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-4 w-12 rounded-full bg-white/5" />
          <Skeleton className="h-3 w-20 bg-white/5" />
        </div>
        <Skeleton className="h-6 w-3/4 bg-white/5" />
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <Skeleton className="h-4 w-full bg-white/5" />
        <Skeleton className="h-4 w-2/3 bg-white/5" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-10 bg-white/5" />
          <Skeleton className="h-4 w-12 bg-white/5" />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full bg-white/5" />
          <Skeleton className="h-3 w-16 bg-white/5" />
        </div>
        <Skeleton className="h-1 w-1 rounded-full bg-white/5" />
      </CardFooter>
    </Card>
  );
}
