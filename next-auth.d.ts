import NextAuth, { Profile as NextAuthProfile } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      firstName?: string;
      lastName?: string;
      email: string;
      name: string;
      image: string;
      picture?: string;
      role: string;
    };
  }

  interface User {
    token?: string;
  }

  interface JWT {
    accessToken?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
  }

  interface Profile extends NextAuthProfile {
    given_name?: string;
    family_name?: string;
    picture?: string;
    sub?: string;
  }
}
