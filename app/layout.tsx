import "./globals.css";
import { Epilogue } from "next/font/google";
import Providers from "./lib/providers";
import GifterHeader from '@/components/layout/header-gifter';
import { getCompanyAPIKey, getCurrentUser, getSession } from "./lib/actions";
import { ReactNode } from "react";
import { User } from "../types";

const epilogue = Epilogue({
    subsets: ["latin"],
    display: "fallback",
});

export const metadata = {
    title: "GFT",
    description: "Unwrap Happiness",
};

interface RootLayoutProps {
    children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    const currUser: User | undefined = await getCurrentUser();
    const session = await getSession();
    console.log({ session })
    return (
        <html lang="en">
            <body className={epilogue.className}>
                <Providers>
                    {currUser && <GifterHeader currUser={currUser} />}
                    <main className="">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
