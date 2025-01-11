import { Metadata } from "next"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Shield, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: "SAFU - Secure Asset Recovery",
  description: "Recover your assets from compromised Solana wallets",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <main className="flex-grow container mx-auto px-4 py-12 space-y-16">
        <section className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome to SAFU
          </h1>
          <p className="mb-8 text-xl text-gray-300 max-w-2xl mx-auto">
            Your trusted solution for secure asset recovery from compromised Solana wallets
          </p>
          <Link href="/recover">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-6 px-8">
              Start Asset Recovery
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Shield className="mr-2 h-6 w-6" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <ol className="list-decimal list-inside space-y-2">
                <li>Input the secret key of your compromised wallet.</li>
                <li>Connect a secure alternative wallet to store recovered assets.</li>
                <li>Select the specific assets you wish to recover.</li>
                <li>Initiate the recovery process and authorize the transaction.</li>
              </ol>
              <p className="text-gray-400 italic">
                SAFU ensures a seamless and secure transfer of your selected assets.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-pink-800">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Zap className="mr-2 h-6 w-6" />
                Behind the Scenes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <ul className="space-y-2">
                <li>SAFU constructs a transaction to transfer your assets.</li>
                <li>The transaction is signed by both wallets.</li>
                <li>Your connected safe wallet acts as the fee payer, ensuring transaction execution.</li>
              </ul>
              <p className="text-gray-400 italic">
                This process facilitates the efficient recovery of your assets.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="bg-gray-800 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Created by{" "}
            <a
              href="https://twitter.com/ved0811"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              @ved0811
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}