"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { FaArrowDown } from "react-icons/fa";

export function ModelSelector() {
  const [selectedModel, setselectedModel] = useState("Flux");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="text-black cursor-pointer flex justify-between items-center"
        >
          {selectedModel}
          <span>{<FaArrowDown />}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-70" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(e) => {
              setselectedModel("Flux");
            }}
          >
            Flux
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              setselectedModel("Stable Diffusion");
            }}
          >
            Stable Diffusion
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              setselectedModel("Model 3");
            }}
          >
            Model 3<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              setselectedModel("Model 4");
            }}
          >
            Model 4<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
