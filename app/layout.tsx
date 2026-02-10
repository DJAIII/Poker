import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: '포커 확률 계산기',
    description: '텍사스 홀덤 승률 계산',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-deep-slate text-white antialiased`}>
                {children}
            </body>
        </html>
    )
}
