import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";
import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { useState, useEffect } from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 60) {
        setScrolledPast(true);
      } else {
        setScrolledPast(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900/20">
      <div className={`fixed w-full z-40 transition-all duration-300 flex justify-center
        ${scrolledPast 
          ? 'top-4 sm:top-6' 
          : 'top-0 left-0'}
      `}>
        <div className={`transition-all duration-300 
          ${scrolledPast 
            ? 'w-[95%] sm:w-[90%] md:w-[85%] lg:w-[70%] xl:w-[60%] rounded-full shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm py-2 px-4 sm:px-6 md:px-8' 
            : 'w-full max-w-7xl py-2 bg-transparent px-4 sm:px-6 lg:px-8'}
        `}>
          <Navbar className="p-0 min-h-0 bg-transparent">
            <NavbarBrand>
              <Logo size={36} />
              <p className="font-bold ml-2 text-lg">
                CC-PERC
              </p>
            </NavbarBrand>
            
            <NavbarContent justify="end" className="gap-2 sm:gap-4">
              <NavbarItem>
                <Button 
                  as={Link}
                  href="/login" 
                  size="md"
                  color="primary" 
                  variant="flat"
                  className="font-medium bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/40 dark:hover:bg-orange-800/60 dark:text-orange-400 min-w-[100px]"
                >
                  Login
                </Button>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
        </div>
      </div>
      
      {/* Add padding to account for the fixed navbar */}
      {/* <div className="pt-16 sm:pt-24"></div> */}
      
      {children}
    </div>
  );
}
