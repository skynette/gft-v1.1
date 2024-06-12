import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios, { isAxiosError } from 'axios';

const clientIdStr = process.env.GOOGLE_CLIENT_ID as string;
const clientSecretStr = process.env.GOOGLE_CLIENT_SECRET as string;
const secretStr = process.env.NEXTAUTH_SECRET as string;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: clientIdStr,
            clientSecret: clientSecretStr,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                token: { label: 'Token', type: 'text' },
            },
            async authorize(credentials) {
                try {
                    // Request token from backend
                    const url = `${BASE_URL}/auth/token/`;

                    const tokenResponse = await axios.post(url, {
                        email: credentials?.email,
                        token: credentials?.token,
                    });

                    const user = tokenResponse.data;

                    // If no error and we have user data, return it
                    if (user) {
                        console.log("RETURNING FROM AUTHORIZE", { email: credentials?.email, ...user })
                        return { email: credentials?.email, ...user };
                    }

                    // Return null if user data could not be retrieved
                    return null;
                } catch (error) {
                    console.error('Error authorizing user:', error);
                    return null;
                }

            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            console.log("JWT callback")
            console.log({ token, user, account, profile })
            if (account && account.provider === 'google' && profile) {
                token.id = (user?.id || profile?.sub) as string;
                token.firstName = profile?.given_name as string;
                token.lastName = profile?.family_name as string;
                token.picture = profile?.picture as string;
            } else if (user) {
                token.id = user.id as string;
                token.accessToken = user.token as string;
            }
            return token;
        },
        async session({ session, token }) {
            console.log("session callback")
            console.log({ session, token })
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
