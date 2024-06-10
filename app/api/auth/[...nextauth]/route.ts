import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log("sign in")
            console.log({user, account, profile, email, credentials})
            try {
                console.log("trynna post backend api to create")
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/google/`, {
                    email: user.email,
                });

                if (response.status === 200) {
                    user.token = response.data.token;
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error("SignIn Error:", error);
                return false;
            }
        },
        async jwt({ token, user }) {
            console.log("jwt")
            console.log({token, user})
            if (user) {
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("session")
            console.log({session, token})
            session.accessToken = token.accessToken as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || '',
});

export { handler as GET, handler as POST };
