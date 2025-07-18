import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { useState, useEffect } from "react";

import OrgIcon from "@/components/org-icon";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolledPast, setScrolledPast] = useState(false);

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
      <div
        className={`fixed w-full z-40 transition-all duration-300 flex justify-center
        ${scrolledPast ? "top-4 sm:top-6" : "top-0 left-0"}
      `}
      >
        <div
          className={`transition-all duration-300 
          ${
            scrolledPast
              ? "w-[95%] sm:w-[90%] md:w-[85%] lg:w-[70%] xl:w-[60%] rounded-full shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm py-2 px-4 sm:px-6 md:px-8"
              : "w-full max-w-7xl py-2 bg-transparent px-4 sm:px-6 lg:px-8"
          }
        `}
        >
          <Navbar className="p-0 min-h-0 bg-transparent">
            <NavbarBrand>
              <OrgIcon size={36} />
              <p className="font-bold ml-2 text-lg">
                Ai<span className="font-bold text-2xl">∀</span>i
              </p>
            </NavbarBrand>

            <NavbarContent className="gap-2 sm:gap-4" justify="end">
              <NavbarItem>
                <Button
                  className="font-medium bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/40 dark:hover:bg-orange-800/60 dark:text-orange-400 min-w-[100px]"
                  color="primary"
                  size="md"
                  variant="flat"
                  onPress={() => window.location.href = "/auth"}
                >
                  Sign In
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
