"use client";
import { useEffect, useRef, useState } from "react";
import { useWindowScroll } from "react-use";
import { PiPaperPlaneTiltLight } from "react-icons/pi";
import { IoMenu, IoClose } from "react-icons/io5";
import Button from "./Button";

const Navbar = () => {
  const navItems = [
    { text: "Prologue", key: "nav-item1" },
    { text: "Pricing", key: "nav-item2" },
    { text: "About", key: "nav-item3" },
    { text: "Contact", key: "nav-item4" },
  ];

  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const { y: currentScrollY } = useWindowScroll();
  const lastScrollY = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const threshold = 10; // small scroll offset to avoid jitter

    if (Math.abs(currentScrollY - lastScrollY.current) < threshold) return;

    if (currentScrollY > lastScrollY.current) {
      // scrolling down
      setIsNavVisible(false);
    } else {
      // scrolling up
      setIsNavVisible(true);
    }

    lastScrollY.current = currentScrollY;
  }, [currentScrollY]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on unmount just in case
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMobileMenuOpen]);

  return (
    <div
      ref={navContainerRef}
      className={`fixed z-50 top-0 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
        isNavVisible ? "top-4 opacity-100" : "-top-24 opacity-0"
      } w-full sm:w-[90vw] h-16`}
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between px-4 py-2 bg-neutral-950/80 backdrop-blur-md rounded-xl">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Button
              id="trial-button"
              rightIcon={<PiPaperPlaneTiltLight />}
              title="Start Free Trial"
              containerClass="bg-blue-50 md:flex hidden items-center cursor-pointer justify-center gap-1"
              leftIcon={null}
              onClick={() => {}}
              disabled={false}
            />
            {/* Mobile toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white text-2xl p-2 focus:outline-none cursor-pointer"
              >
                {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
              </button>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex">
              {navItems.map((item) => (
                <a key={item.key} className="nav-hover-btn cursor-pointer">
                  {item.text}
                </a>
              ))}
            </div>
            <Button
              id="launch-button"
              title="Launch"
              containerClass="bg-blue-50 flex items-center cursor-pointer justify-center gap-1"
              rightIcon={<PiPaperPlaneTiltLight />}
              leftIcon={null}
              onClick={() => {}}
              disabled={false}
            />
          </div>
        </nav>

        {/* Mobile Nav Items */}
        <div
          className={`md:hidden absolute top-16 left-0 w-full bg-neutral-900 border-t border-gray-700 transition-all duration-500 overflow-hidden ${
            isMobileMenuOpen
              ? "h-[90vh] opacity-100 flex justify-center items-center"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col py-4 gap-4 w-full items-center">
            {navItems.map((item) => (
              <a
                key={item.key}
                className="nav-hover-btn cursor-pointer"
                style={{ margin: "0px" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.text}
              </a>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
