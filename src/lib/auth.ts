import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  fetchOptions: {
    credentials
  },
  plugins: [
    inferAdditionalFields({
      user: {
        phone: { type: "string", required: false },
        role: { type: "string", required: true },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
