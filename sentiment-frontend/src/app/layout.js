import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export const metadata = {
    title: "Sentiment Analysis - AI Powered",
    description: "Analyze text sentiment with AI using advanced natural language processing.",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        title: "Sentiment Analysis - AI Powered",
        description: "Analyze text sentiment with AI using advanced natural language processing.",
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
