import './globals.css';
import { Epilogue } from "next/font/google";
import SessionProviderComponent from './providers/session-provider';
import { Toaster } from 'react-hot-toast';

const epilogue = Epilogue({
    subsets: ['latin'],
    display: 'fallback',
});

export const metadata = {
    title: 'GFT',
    description: 'Unwrap Happiness',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={epilogue.className}>
                <SessionProviderComponent>
                    {children}
                    <Toaster />
                </SessionProviderComponent>
            </body>
        </html>
    );
}