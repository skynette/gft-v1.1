import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const clientIdStr = process.env.GOOGLE_CLIENT_ID as string;
const clientSecretStr = process.env.GOOGLE_CLIENT_SECRET as string;
const secretStr = process.env.NEXTAUTH_SECRET as string;

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: clientIdStr,
            clientSecret: clientSecretStr,
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.id = (user.id || profile?.sub) as string;
                token.firstName = profile?.given_name as string;
                token.lastName = profile?.family_name as string;
                token.picture = profile?.picture as string;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user.id = token.id as string;
            session.user.firstName = token.firstName as string;
            session.user.lastName = token.lastName as string;
            session.user.picture = token.picture as string;
            return session;
        },
    },
    secret: secretStr,
});

export { handler as GET, handler as POST };
