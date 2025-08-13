"use client";
import { useEffect, useRef, useState } from "react";
import { useWindowScroll } from "react-use";
import { PiPaperPlane, PiPaperPlaneTiltLight } from "react-icons/pi";
import { IoMenu, IoClose } from "react-icons/io5";
import Button from "./Button";
import Link from "next/link";
import DropDown from "./DropDown";
import { getCurrentSession } from "@/lib/actions/user.actions";

const Navbar = () => {
  const navItems = [
    { text: "Home", key: "home", route: "/" },
    { text: "Pricing", key: "nav-item2", route: "/pricing" },
    { text: "About", key: "nav-item3", route: "/about" },
    { text: "Contact", key: "nav-item4", route: "/contact-us" },
  ];

  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const { y: currentScrollY } = useWindowScroll();
  const lastScrollY = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [credits, setCredits] = useState(null); // Default credits

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const getCurrentUser = async () => {
    try {
      const user = await getCurrentSession();
      if (!user) setCurrentUser(null);
      else {
        setCurrentUser(user);
        setCredits(user.credits);
      }
    } catch (error) {
      // console.error("Error fetching current user:", error);
      return null;
    }
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

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div
      ref={navContainerRef}
      className={`fixed z-50 top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
        isNavVisible ? "top-6 opacity-100" : "-top-24 opacity-0"
      } w-[90%] h-16`}
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between px-6 py-3 bg-white/95 backdrop-blur-lg border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 relative">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {currentUser === null ? (
              <Link href="/sign-in">
                <Button
                  id="login-button"
                  rightIcon={<PiPaperPlaneTiltLight className="w-4 h-4" />}
                  title="Login"
                  containerClass="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full md:flex hidden items-center cursor-pointer justify-center gap-2 transition-all duration-200 hover:scale-105 font-medium text-sm"
                  leftIcon={null}
                  onClick={() => {}}
                  disabled={false}
                />
              </Link>
            ) : (
              <Link href="/profile">
                <Button
                  id="profile-button"
                  title="Profile"
                  containerClass="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full md:flex hidden items-center cursor-pointer justify-center gap-2 transition-all duration-200 hover:scale-105 font-medium text-sm"
                  rightIcon={<PiPaperPlaneTiltLight className="w-4 h-4" />}
                  leftIcon={null}
                  onClick={() => {}}
                  disabled={false}
                />
              </Link>
            )}

            {/* Mobile toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-black text-2xl p-2 focus:outline-none cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
              </button>
            </div>
          </div>

          {/* Centered Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                href={item.route}
                key={item.key}
                className="text-gray-700 hover:text-black font-medium transition-all duration-200 hover:scale-105 relative group cursor-pointer"
              >
                {item.text}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
            <DropDown />
          </div>

          {/* Right side - Available credits */}
          {credits && (
            <div className="credits-display bg-black text-white px-5 py-2 rounded-full flex items-center gap-2 font-semibold text-sm select-none shadow-lg cursor-default">
              <span className="text-gray-300 tracking-wide uppercase">
                Available Credits:
              </span>
              <span className="text-white text-lg tracking-wider">
                {credits}
              </span>
              <PiPaperPlane className="w-5 h-5 text-white animate-float" />
              <style>{`
              @keyframes float {
                0%,
                100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-6px);
                }
              }
              .animate-float {
                animation: float 3s ease-in-out infinite;
              }
            `}</style>
            </div>
          )}
        </nav>

        {/* Mobile Nav Items */}
        <div
          className={`md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-lg border-2 border-gray-200 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 border-transparent"
          }`}
        >
          <div className="flex flex-col py-6 gap-6 w-full items-center">
            {navItems.map((item, index) => (
              <Link
                href={item.route}
                key={item.key}
                className="text-gray-700 hover:text-black font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isMobileMenuOpen
                    ? "fadeInUp 0.3s ease-out forwards"
                    : "none",
                }}
              >
                {item.text}
              </Link>
            ))}

            {/* Mobile-only buttons */}
            <div className="flex flex-col gap-4 mt-4 w-full max-w-xs">
              {currentUser === null ? (
                <Link href="/sign-in" className="w-full">
                  <Button
                    id="mobile-login-button"
                    rightIcon={<PiPaperPlaneTiltLight className="w-4 h-4" />}
                    title="Login"
                    containerClass="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full w-full flex items-center cursor-pointer justify-center gap-2 transition-all duration-200 hover:scale-105 font-medium"
                    leftIcon={null}
                    onClick={() => setIsMobileMenuOpen(false)}
                    disabled={false}
                  />
                </Link>
              ) : (
                <Link href="/profile" className="w-full">
                  <Button
                    id="mobile-profile-button"
                    title="Profile"
                    containerClass="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full w-full flex items-center cursor-pointer justify-center gap-2 transition-all duration-200 hover:scale-105 font-medium"
                    rightIcon={<PiPaperPlaneTiltLight className="w-4 h-4" />}
                    leftIcon={null}
                    onClick={() => setIsMobileMenuOpen(false)}
                    disabled={false}
                  />
                </Link>
              )}

              <Link href="/image-editor" className="w-full">
                <Button
                  id="mobile-launch-button"
                  title="Launch"
                  containerClass="bg-white hover:bg-gray-50 border-2 border-black hover:border-gray-800 text-black px-6 py-3 rounded-full w-full flex items-center cursor-pointer justify-center gap-2 transition-all duration-200 hover:scale-105 font-medium"
                  rightIcon={<PiPaperPlaneTiltLight className="w-4 h-4" />}
                  leftIcon={null}
                  onClick={() => setIsMobileMenuOpen(false)}
                  disabled={false}
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;
