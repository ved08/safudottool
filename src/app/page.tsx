import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "SAFU - Secure Asset Recovery",
  description: "Recover your assets from compromised Solana wallets",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-4 sm:p-8 h-[calc(100vh-64px)]">
        <h1 className="mb-8 text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Welcome to SAFU
        </h1>
        <p className="mb-8 text-xl text-center text-gray-300 max-w-2xl">
          Secure Asset Recovery for Compromised Solana Wallets
        </p>
        <Link href="/asset-recovery">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-6 px-8">
            Start Asset Recovery
          </Button>
        </Link>
      </main>
    </div>
  )
}

