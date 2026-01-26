import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  plugins: [
    inferAdditionalFields({
      user: {
        phone: { type: "string", required: false },
        role: { type: "string", required: true },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
