export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {children}
    </div>
  );
}