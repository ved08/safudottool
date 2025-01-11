"use client"

import Link from 'next/link'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ToggleSwitch } from './ui/toggle-switch';

export function Navbar() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState(0)
  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then(val => {
        setBalance(val)
      })
    }
  }, [connected, publicKey, connection])


  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-purple-400 transition-colors">
            Home
          </Link>
          <Link href="/recover" className="text-white hover:text-purple-400 transition-colors">
            Recover Now
          </Link>
        </div>
        <div className='flex items-center space-x-4'>
          {connected && <p className='text-white h-fit mr-2'>{(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL</p>}
          <WalletMultiButton />
          <ToggleSwitch />
        </div>
      </div>
    </nav>
  )
}

