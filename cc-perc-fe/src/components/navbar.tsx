import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { motion } from "framer-motion";
import { useState } from "react";

import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";

const navItems = [
  { label: "Analyze", href: "/analyze" },
  { label: "Examples", href: "/examples" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeroUINavbar
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-orange-200 dark:border-orange-800"
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left side - Logo and navigation */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-2"
            color="foreground"
            href="/"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              className="text-2xl"
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              🧠
            </motion.div>
            <div className="flex flex-col">
              <p className="font-bold text-lg bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                CC-PERC
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                AI Homepage Analysis
              </p>
            </div>
          </Link>
        </NavbarBrand>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-6 justify-start ml-8">
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors font-medium"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      {/* Right side - Actions */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link
            isExternal
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            href="https://github.com/your-repo/cc-perc"
            title="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden md:flex gap-3">
          <Button
            as={Link}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            href="/login"
            variant="light"
          >
            Log In
          </Button>
          <Button
            as={Link}
            className="text-sm font-medium px-6"
            color="primary"
            href="/signup"
            variant="solid"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link
          isExternal
          className="text-gray-500"
          href="https://github.com/your-repo/cc-perc"
        >
          <GithubIcon className="w-5 h-5" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
        <div className="mx-4 mt-4 flex flex-col gap-4">
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors text-lg"
                href={item.href}
                onPress={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
            <Button
              as={Link}
              className="justify-start text-gray-600"
              href="/login"
              variant="light"
              onPress={() => setIsMenuOpen(false)}
            >
              Log In
            </Button>
            <Button
              as={Link}
              className="justify-start"
              color="primary"
              href="/signup"
              variant="solid"
              onPress={() => setIsMenuOpen(false)}
            >
              Get Started
            </Button>
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
