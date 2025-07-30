"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
      <DropdownMenuTrigger className="text-white cursor-pointer relative ms-10 text-xs uppercase flex gap-2 items-center justify-center">
        <span>Products</span>
        {isArrowDown ? (
          <FaArrowDown color="white" size={12} />
        ) : (
          <FaArrowUp color="white" size={12} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/image-generator">
          <DropdownMenuItem>Image Generation</DropdownMenuItem>
        </Link>
        <Link href="/image-editor">
          <DropdownMenuItem>Inpainting</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDown;
