/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/use-toast"
import { Loader2, Check } from 'lucide-react'
import Image from 'next/image'
import { Checkbox } from "@/components/ui/checkbox"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  sendAndConfirmTransaction,
  clusterApiUrl,
  GetProgramAccountsFilter,
  PublicKey,
  ParsedAccountData,
  AccountInfo,
} from '@solana/web3.js';
import base58 from "bs58"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import {
  mplBubblegum,
} from "@metaplex-foundation/mpl-bubblegum";
import { transferV1 } from "@metaplex-foundation/mpl-core"
import {
  keypairIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchAllTokenRecord } from "@metaplex-foundation/mpl-token-metadata";
import axios from "axios"

interface Asset {
  decimals: number,
  mint: string,
  supply: string,
  name: string,
  uri: string,
  tokenStandard: { __option: "Some" | "None", value?: number },
  editionNonce: { __option: "Some" | "None", value?: number }
}

interface Token {
  mint: string
  tokenAmount: { uiAmount: string }
}

interface NFT extends Asset {
  type: "cNFT" | "NFT",
  image: string,
  description: string
}

// const mockTokens: Token[] = [
//   { id: "1", name: "Solana", mint: "So11111111111111111111111111111111111111112", amount: 1.5 },
//   { id: "2", name: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", amount: 100 },
//   { id: "3", name: "Raydium", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", amount: 50 },
// ]

// const mockNFTs: NFT[] = [
//   { id: "4", name: "Cool NFT #1234", type: "NFT", image: "/placeholder.svg?height=200&width=200" },
//   { id: "5", name: "Compressed NFT #5678", type: "cNFT", image: "/placeholder.svg?height=200&width=200" },
//   { id: "6", name: "Awesome NFT #9876", type: "NFT", image: "/placeholder.svg?height=200&width=200" },
// ]

export default function SafuRecoveryTool() {
  const [secretKey, setSecretKey] = useState("")
  const [tokens, setTokens] = useState<Token[]>([])
  const [nfts, setNFTs] = useState<NFT[]>([])
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFetchAssets = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to fetch assets
      const { data } = await axios.post("/api/fetch-nfts", {
        secretKey: secretKey
      })
      if (!data.error) {
        console.log(data)
        const nftDataPromie: NFT[] = data.assets.map(async (asset: Asset) => {
          if (asset.decimals == 0) {
            // image and type
            const { data } = await axios.get(asset.uri)

            const nft = { ...asset, image: data.image, type: "NFT", description: data.description }
            return nft
          }
        })
        const nftDataResolved = (await Promise.all(nftDataPromie)).filter(nft => nft)
        setNFTs(nftDataResolved)
        console.log(nftDataResolved)
      } else { throw Error(data.message) }
      const res = await axios.post("/api/fetch-tokens", {
        secretKey: secretKey
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tokenDataPromise = res.data.assets.map(async (token: { info: any }) => {
        return token.info
      })
      const tokensData = await Promise.all(tokenDataPromise)
      setTokens(tokensData)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e)
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    )
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Simulate transaction submission
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Transaction submitted",
        description: "Your assets are being recovered.",
      })
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to submit transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-6xl bg-gray-800 text-white border-gray-700">
      <CardHeader>
        <CardTitle className="text-3xl">Asset Recovery</CardTitle>
        <CardDescription>Recover your assets from a compromised Solana wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="secretKey">Compromised Wallet Secret Key</Label>
          <Input
            id="secretKey"
            type="password"
            placeholder="Enter secret key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="bg-gray-700 border-gray-600"
          />
        </div>
        <Button
          onClick={handleFetchAssets}
          disabled={isLoading || !secretKey}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Fetch Assets"}
        </Button>
        {(tokens.length > 0 || nfts.length > 0) && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Tokens</h3>
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-600">
                      <th className="p-2 text-left">Select</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token) => {
                      const isSelected = selectedAssets.includes(token.mint);
                      return (
                        <tr
                          key={token.mint}
                          className={`border-t border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors ${isSelected ? 'bg-gray-600' : ''}`}
                          onClick={() => handleAssetToggle(token.mint)}
                        >
                          <td className="p-2">
                            <Checkbox
                              id={token.mint}
                              checked={isSelected}
                              onCheckedChange={() => { }}
                            />
                          </td>
                          <td className="p-2">{token.mint}</td>
                          <td className="p-2">{token.tokenAmount.uiAmount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">NFTs</h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {nfts.map((nft) => {
                  const isSelected = selectedAssets.includes(nft.mint)
                  return (
                    <div
                      key={nft.mint}
                      className={`relative cursor-pointer transition-all duration-200 ease-in-out ${isSelected ? 'ring-2 ring-purple-500' : 'hover:ring-2 hover:ring-purple-400'}`}
                      onClick={() => handleAssetToggle(nft.mint)}
                    >
                      <Card className="bg-gray-700 border-gray-600 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="relative">
                            <Image
                              src={nft.image || "https://www.arweave.net/VGzPRU6kJzkwh82r8tBDimUkF0uzTPPV9s3hObtcK78?ext=png"}
                              alt={nft.name}
                              width={200}
                              height={200}
                              className="w-full h-auto"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-purple-500 bg-opacity-50 flex items-center justify-center">
                                <Check className="w-10 h-10 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="p-4 text-center">
                            <h4 className="font-semibold text-white">{nft.name}</h4>
                            <p className="text-sm text-gray-400">{nft.type}</p>
                          </div>
                        </CardContent>
                      </Card>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => { }}
                        aria-label={`Select ${nft.name} for recovery`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || selectedAssets.length === 0}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Recover Selected Assets"}
        </Button>
      </CardFooter>
    </Card>
  )
}

