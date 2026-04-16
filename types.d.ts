import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, contains run-time safe information about the session.
   */
  interface Session {
    accessToken?: string
    user: {
      /** The user's postal address. */
      role: string
    } & DefaultSession["user"]
  }
}
