"use client"

interface ChartSkeletonProps {
  height?: number;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ height = 300 }) => {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="flex items-end justify-center h-full space-x-2 px-4 pb-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-t"
            style={{
              width: '20px',
              height: `${Math.random() * 80 + 20}%`
            }}
          />
        ))}
      </div>
    </div>
  );
};