import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"

import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const clientIdStr = process.env.GOOGLE_CLIENT_ID as string;
const clientSecretStr = process.env.GOOGLE_CLIENT_SECRET as string;
const appleClientIdStr = process.env.APPLE_CLIENT_ID as string;
const appleClientSecretStr = process.env.APPLE_CLIENT_SECRET as string;
const secretStr = process.env.NEXTAUTH_SECRET as string;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: clientIdStr,
            clientSecret: clientSecretStr,
        }),
        AppleProvider({
            clientId: appleClientIdStr,
            clientSecret: appleClientSecretStr,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                token: { label: 'Token', type: 'text' },
            },
            async authorize(credentials) {
                try {
                    const url = `${BASE_URL}/auth/token/`;
                    const tokenResponse = await axios.post(url, {
                        email: credentials?.email,
                        token: credentials?.token,
                    });

                    const user = tokenResponse.data;

                    // now to login with credentials endpoint
                    try {
                        const url = `${BASE_URL}/auth/login/credentials/`;
                        const userDataResponse = await axios.post(url, {
                            token: user.token,
                        });
                        const userData = userDataResponse.data
                        if (userData) {
                            const data = {
                                id: userData.user.id,
                                email: userData.user.email,
                                provider: userData.user.provider,
                                first_name: userData.user.email,
                                last_name: userData.user.last_name,
                                username: userData.user.username,
                                mobile: userData.user.mobile,
                                contact_preference: userData.user.contact_preference,
                                image: userData.user.image,
                                role: userData.user.role,
                                token: userData.token,
                                companyAPIKey: userData.companyAPIKey,
                            }
                            return data;
                        }
                    } catch (error) {
                        console.error('Error authorizing user:', error);
                        return null;
                    }
                    // if (user) {
                    //     return { email: credentials?.email, ...user };
                    // }
                    return null;
                } catch (error) {
                    console.error('Error authorizing user:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, session, trigger, profile }) {
            if (trigger === 'update') {
                return { ...token, ...session }
            }

            if (account && profile) {
                // If the user logged in with an OAuth provider
                const url = `${BASE_URL}/auth/login/social/`;
                try {
                    const oauthResponse = await axios.post(url, {
                        provider: account.provider,
                        providerAccountId: profile.sub || "",
                        email: profile.email,
                        first_name: profile.name?.split(' ')[0] || "",
                        last_name: profile.name?.split(' ')[1] || "",
                        image: profile.picture,
                    });

                    const userData = oauthResponse.data;

                    token.id = userData.user.id;
                    token.accessToken = userData.token;
                    token.companyAPIKey = userData?.companyAPIKey || '';
                    token.name = profile.name;
                    token.firstName = userData.user.first_name;
                    token.lastName = userData.user.last_name;
                    token.email = userData.user.email;
                    token.picture = profile?.picture as string;
                    token.role = userData.user.role;

                } catch (error) {
                    return token;
                }
            } else if (user) {
                // If the user logged in with credentials
                token.id = user.id;
                token.accessToken = user.token;
                token.role = user.role;
                token.email = user.email;
                token.companyAPIKey = user.companyAPIKey;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.companyAPIKey = token.companyAPIKey as string;
            session.user.id = token.id as string;
            session.user.name = token.name as string;
            session.user.firstName = token.firstName as string;
            session.user.lastName = token.lastName as string;
            session.user.email = token.email as string;
            session.user.picture = token.picture as string;
            session.user.role = token.role as string;
            return session;
        },
    },
    secret: secretStr,
    // pages: {
    //     signIn: '/login',
    // },
}

export default NextAuth(authOptions)