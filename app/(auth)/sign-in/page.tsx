import React from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return <SignIn routing="hash" />;
};

export default SignInPage;
