import { HexclaveClientApp } from "@hexclave/next";

export const hexclaveClientApp = new HexclaveClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    accountSettings: "/account",
    afterSignIn: "/app",
    afterSignUp: "/app",
    afterSignOut: "/",
    home: "/",
    default: {
      type: "handler-component",
    },
  },
});
