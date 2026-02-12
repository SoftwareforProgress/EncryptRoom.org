import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "EncryptRoom Bundle Creator",
    description: "Create and download EncryptRoom chat bundles.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="app-body">{children}</body>
        </html>
    );
}
