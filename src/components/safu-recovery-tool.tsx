"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/use-toast"
import { Loader2, Check } from 'lucide-react'
import Image from 'next/image'
import { Checkbox } from "@/components/ui/checkbox"
import { createAssociatedTokenAccountInstruction, createTransferCheckedInstruction, getAssociatedTokenAddressSync, getMint, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import base58 from "bs58"
import axios from "axios"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
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
  type: "Token"
  mint: string
  tokenEdition: 0 | 1
  tokenAmount: { uiAmount: string }
}

interface NFT extends Asset {
  type: "cNFT" | "NFT",
  image: string,
  description: string
}

export default function SafuRecoveryTool() {
  const [secretKey, setSecretKey] = useState("")
  const [tokens, setTokens] = useState<Token[]>([])
  const [nfts, setNFTs] = useState<NFT[]>([])
  const [txfee, setTxfee] = useState(0)
  const [selectedToken, setSelectedToken] = useState<Token[]>([])
  const [selectedNFT, setSelectedNFT] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { connection } = useConnection()
  const { sendTransaction, publicKey } = useWallet()

  useEffect(() => {
    const len = selectedToken.length + selectedNFT.length
    setTxfee(2_040_000 * len)
  }, [selectedToken, selectedNFT])

  const handleFetchAssets = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.post("/api/fetch-nfts", {
        secretKey: secretKey
      })
      if (!data.error) {
        const nftDataPromie: NFT[] = data.assets.map(async (asset: Asset) => {
          if (asset.decimals == 0) {
            const { data } = await axios.get(asset.uri)
            const nft = { ...asset, image: data.image, type: "NFT", description: data.description }
            return nft
          }
        })
        const nftDataResolved = (await Promise.all(nftDataPromie)).filter(nft => nft)
        setNFTs(nftDataResolved)
      } else { throw Error(data.message) }
      const res = await axios.post("/api/fetch-tokens", {
        secretKey: secretKey
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tokenDataPromise = res.data.assets.map(async (token: { info: any }) => {
        return { ...token.info, type: "Token" }
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

  const handleAssetToggle = async (assetId: string, asset: NFT | Token) => {
    if (asset.type == "Token") {
      setSelectedToken(prev => prev.filter(a => a.mint == asset.mint).length > 0 ? prev.filter(a => a.mint !== asset.mint) : [...prev, asset])

    } else {
      setSelectedNFT(prev => prev.filter(a => a.mint == asset.mint).length > 0 ? prev.filter(a => a.mint !== asset.mint) : [...prev, asset])

    }
  }

  const handleSubmit = async () => {

    if (!publicKey) { console.log("Not connected"); return; };
    setIsLoading(true)
    try {

      const instructions: TransactionInstruction[] = []
      const keypair = Keypair.fromSecretKey(base58.decode(secretKey))

      for (let i = 0; i < selectedToken.length; i++) {
        const mint = new PublicKey(selectedToken[i].mint)
        const programId = selectedToken[i].tokenEdition === 0 ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
        const mintDetails = await getMint(connection, mint)
        const ata = getAssociatedTokenAddressSync(mint, keypair.publicKey, false, programId)
        const senderAtaBalance = (await connection.getTokenAccountBalance(ata)).value.amount
        const recieverAta = getAssociatedTokenAddressSync(mint, publicKey, false, programId)
        const recieverAtaExists = await connection.getAccountInfo(recieverAta)
        if (!recieverAtaExists) {
          const createAtaIx = createAssociatedTokenAccountInstruction(publicKey, recieverAta, publicKey, mint, programId)
          instructions.push(createAtaIx)
        }
        const ix = createTransferCheckedInstruction(ata, mint, recieverAta, keypair.publicKey, BigInt(senderAtaBalance), mintDetails.decimals)
        instructions.push(ix)
      }
      for (let i = 0; i < selectedNFT.length; i++) {
        const mint = new PublicKey(selectedNFT[i].mint)
        const ata = getAssociatedTokenAddressSync(mint, keypair.publicKey, false)
        const recieverAta = getAssociatedTokenAddressSync(mint, publicKey, false)
        const recieverAtaExists = await connection.getAccountInfo(recieverAta)
        if (!recieverAtaExists) {
          const createAtaIx = createAssociatedTokenAccountInstruction(publicKey, recieverAta, publicKey, mint)
          instructions.push(createAtaIx)
        }
        const ix = createTransferCheckedInstruction(ata, mint, recieverAta, keypair.publicKey, 1, 0)
        instructions.push(ix)


      }

      const blockhash = (await connection.getLatestBlockhash()).blockhash
      const messagev0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: instructions
      }).compileToV0Message()
      const transaction = new VersionedTransaction(messagev0)
      transaction.sign([keypair])
      toast({
        title: "Transaction Executing",
        description: "Please sign the transaction",
      })

      try {
        const txhash = await sendTransaction(transaction, connection)
        console.log(txhash)
        toast({
          title: "Transaction Executed",
          description: "Tx hash: " + txhash,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        toast({
          title: "Error",
          description: "User rejected the request",
          variant: "destructive"
        })
      }

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
                      const isSelected = selectedToken.filter(a => a.mint == token.mint).length > 0;
                      return (
                        <tr
                          key={token.mint}
                          className={`border-t border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors ${isSelected ? 'bg-gray-600' : ''}`}
                          onClick={() => handleAssetToggle(token.mint, token)}
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
                  const isSelected = selectedNFT.filter(a => a.mint == nft.mint).length > 0
                  return (
                    <div
                      key={nft.mint}
                      className={`relative cursor-pointer transition-all duration-200 ease-in-out ${isSelected ? 'ring-2 ring-purple-500' : 'hover:ring-2 hover:ring-purple-400'}`}
                      onClick={() => handleAssetToggle(nft.mint, nft)}
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
      <div className="mb-2">
        <p className="text-center">Minimum required SOL: {(txfee / LAMPORTS_PER_SOL).toFixed(6)}</p>
      </div>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || (selectedNFT.length === 0 && selectedToken.length === 0)}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Recover Selected Assets"}
        </Button>
      </CardFooter>
    </Card>
  )
}

