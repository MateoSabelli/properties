export function DashboardContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)] overflow-y-auto">
      {children}
    </div>
  );
}
