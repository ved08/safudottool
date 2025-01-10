"use client"

import Link from 'next/link'
// import { Button } from "@/components/ui/button"
// import { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Navbar() {
  // const [isConnected, setIsConnected] = useState(false)

  // const handleConnect = () => {
  //   // Implement wallet connection logic here
  //   setIsConnected(true)
  // }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-purple-400 transition-colors">
            Home
          </Link>
          <Link href="/asset-recovery" className="text-white hover:text-purple-400 transition-colors">
            Asset Recovery
          </Link>
        </div>
        {/* <Button
          onClick={handleConnect}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isConnected ? 'Connected' : 'Connect Wallet'}
        </Button> */}
        <WalletMultiButton />
      </div>
    </nav>
  )
}

