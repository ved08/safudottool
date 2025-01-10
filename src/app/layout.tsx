import "./globals.css"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import AppWalletProvider from "@/components/AppWalletProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SAFU Asset Recovery Tool",
  description: "Recover your assets from a compromised Solana wallet",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWalletProvider>
          {children}
          <Toaster />
        </AppWalletProvider>
      </body>
    </html>
  )
}

