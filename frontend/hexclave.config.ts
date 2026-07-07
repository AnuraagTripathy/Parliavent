import type { HexclaveConfig } from "@hexclave/next/config";

export const config: HexclaveConfig = {
  auth: {
    allowSignUp: true,
    password: {
      allowSignIn: true,
    },
    otp: {
      allowSignIn: true,
    },
  },
};
