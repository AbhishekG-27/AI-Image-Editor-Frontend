"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const DropDown = () => {
  const [isArrowDown, setIsArrowDown] = useState(true);

  const ChangeArrowDirection = (isOpen: boolean) => {
    if (isOpen) {
      setIsArrowDown(false);
    } else {
      setIsArrowDown(true);
    }
  };

  return (
    <DropdownMenu onOpenChange={ChangeArrowDirection}>
      <DropdownMenuTrigger className="text-gray-700 hover:text-black font-medium transition-all duration-200 hover:scale-105 relative group cursor-pointer text-sm flex gap-2 items-center justify-center focus:outline-none">
        <span>Products</span>
        <div className="transition-transform duration-200">
          {isArrowDown ? (
            <FaArrowDown
              className="text-gray-600 group-hover:text-black transition-colors duration-200"
              size={10}
            />
          ) : (
            <FaArrowUp
              className="text-gray-600 group-hover:text-black transition-colors duration-200"
              size={10}
            />
          )}
        </div>
        {/* Hover underline effect */}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white/95 backdrop-blur-lg border-2 border-gray-200 rounded-xl shadow-lg p-2 mt-2 min-w-[180px]">
        <Link href="/image-generation">
          <DropdownMenuItem className="text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 font-medium text-sm focus:bg-gray-50 focus:text-black">
            Text to Image
          </DropdownMenuItem>
        </Link>
        <Link href="/image-editor">
          <DropdownMenuItem className="text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 font-medium text-sm focus:bg-gray-50 focus:text-black">
            Image Inpainting
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDown;
