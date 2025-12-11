"use client";
import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed group z-20 w-full"
      >
        <div className="mx-auto mt-2 max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div
              className={cn(
                "transition-all duration-300 relative",
                isScrolled &&
                  "bg-background/50 max-w-[1300px] mx-auto rounded-2xl border backdrop-blur-lg px-6 lg:px-5"
              )}
            >
              {/* Horizontal border line at bottom - aligned with grid */}
              {!isScrolled && (
                <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-900/10 dark:bg-white/10" />
              )}

              <div className="relative flex flex-wrap items-center justify-between gap-6 pl-7 pr-7 py-3 lg:gap-0 lg:py-4 max-w-[1360px] mx-auto">
                <div className="flex w-full justify-between pl-7 lg:w-auto">
                  <Link
                    href="/"
                    aria-label="home"
                    className="flex items-center"
                  >
                    <Logo />
                  </Link>

                  <button
                    onClick={() => setMenuState(!menuState)}
                    aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                  >
                    <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                    <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                  </button>
                </div>

                <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                  <ul className="flex gap-8 text-sm">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                  <div className="lg:hidden">
                    <ul className="space-y-6 text-base">
                      {menuItems.map((item, index) => (
                        <li key={index}>
                          <Link
                            href={item.href}
                            className="text-muted-foreground hover:text-accent-foreground block duration-150"
                          >
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className={cn(isScrolled && "lg:hidden")}
                    >
                      <Link href="/dashboard">
                        <span>Dashboard</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        "bg-orange-500 hover:bg-orange-600",
                        isScrolled ? "lg:inline-flex" : "hidden"
                      )}
                    >
                      <Link href="#pricing">
                        <span>Get Started</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center -ml-[18px]", className)}>
      <img
        src="/orange-black-auditly.png"
        alt="Auditly360"
        className="h-8 w-auto"
      />
    </div>
  );
};
