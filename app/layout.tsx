import "./globals.css";
import { Epilogue } from "next/font/google";
import Providers from "./lib/providers";

const epilogue = Epilogue({
    subsets: ["latin"],
    display: "fallback",
});

export const metadata = {
    title: "GFT",
    description: "Unwrap Happiness",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={epilogue.className}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
