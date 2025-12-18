import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

export const dynamic = "force-dynamic";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "POS01 | Frontend",
	description: "POS01 cashier dashboard built with Next.js",
	keywords: ["pos", "cashier", "dashboard", "nextjs", "react"],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									const theme = localStorage.getItem('theme') || 'dark';
									const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
									if (isDark) {
										document.documentElement.classList.add('dark');
										document.documentElement.style.colorScheme = 'dark';
									} else {
										document.documentElement.classList.remove('dark');
										document.documentElement.style.colorScheme = 'light';
									}
								} catch (e) {}
							})();
						`,
					}}
				/>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
