"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAccount } from "@/lib/actions/user.actions";

type AuthTypes = "sign-in" | "sign-up";

const formSchema = (authType: AuthTypes) => {
  return z.object({
    // Use the standard z.string().email() for validation
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    firstName:
      authType === "sign-up"
        ? z.string().min(2, "First name is required")
        : z.string().optional(),
    lastName:
      authType === "sign-up"
        ? z.string().min(2, "Last name is required")
        : z.string().optional(),
  });
};

export default function AuthForm({ type }: { type: AuthTypes }) {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const authFormSchema = formSchema(type);

  // 1. Define your form and get access to formState.errors
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  // Destructure errors from formState for easier access
  const {
    formState: { errors },
  } = form;

  // 2. Define a submit handler.
  // Corrected the type inference here
  const onSubmit = async (values: z.infer<typeof authFormSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const { firstName, lastName, email, password } = values;
        const user = await createAccount({
          firstName: firstName || "",
          lastName: lastName || "",
          email: email || "",
        });
        setUserId(user.accountId);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      // Handle error appropriately, e.g., show a notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Inpaint.ai
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        {type === "sign-in" ? "Sign in" : "Sign up"} to Inpaint.ai
      </p>

      <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
        {type === "sign-up" && (
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstName">First name</Label>
              {/* 2. Register the input */}
              <Input
                id="firstName"
                placeholder="Tyler"
                type="text"
                {...form.register("firstName")}
              />
              {/* 3. Display the error message */}
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastName">Last name</Label>
              {/* 2. Register the input */}
              <Input
                id="lastName"
                placeholder="Durden"
                type="text"
                {...form.register("lastName")}
              />
              {/* 3. Display the error message */}
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </LabelInputContainer>
          </div>
        )}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          {/* 2. Register the input */}
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            {...form.register("email")}
          />
          {/* 3. Display the error message */}
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          {/* 2. Register the input */}
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            {...form.register("password")}
          />
          {/* 3. Display the error message */}
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {type === "sign-up" ? "Sign up" : "Sign in"}
          {isLoading && (
            <svg
              className="ml-2 inline h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {!isLoading && " →"}
          <BottomGradient />
        </button>

        <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        <div className="flex items-center justify-center gap-1">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {type === "sign-up"
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>
          <Link
            className="text-sm font-medium text-neutral-800 hover:underline dark:text-neutral-200"
            href={type === "sign-up" ? "/sign-in" : "/sign-up"}
          >
            {type === "sign-up" ? "Sign in" : "Sign up"}
          </Link>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
