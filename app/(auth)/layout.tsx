import Navigation from "@/components/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
              <Navigation />

          {children}
      </div>          
       
    );
  }