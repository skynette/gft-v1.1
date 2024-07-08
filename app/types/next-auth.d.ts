import NextAuth, { Profile as NextAuthProfile, DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        companyAPIKey?: string;
        user: {
            id?: string;
            firstName?: string;
            lastName?: string;
            email: string;
            name: string;
            image: string;
            picture?: string;
            role: string;
            companyAPIKey?: string;
        };
    }
    interface User extends DefaultUser {
        companyAPIKey?: string;
        token?: string;
        role?: string;
    }

    // interface User {
    //     token?: string;
    //     role?: string;
    // }

    interface JWT {
        accessToken?: string;
        companyAPIKey?: string;
        id?: string;
        firstName?: string;
        lastName?: string;
        picture?: string;
        role: string;
    }

    interface Profile extends NextAuthProfile {
        given_name?: string;
        family_name?: string;
        picture?: string;
        sub?: string;
    }

    interface CredentialsInputs {
        email: string;
        password: string;

    }
}