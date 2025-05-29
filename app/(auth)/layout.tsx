import Navigation from "@/components/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  );
}