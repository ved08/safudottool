import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import SafuRecoveryTool from "@/components/safu-recovery-tool"

export const metadata: Metadata = {
  title: "SAFU Asset Recovery",
  description: "Recover your assets from a compromised Solana wallet",
}

export default function AssetRecoveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-4 sm:p-8">
        <h1 className="mb-8 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          SAFU Asset Recovery
        </h1>
        <SafuRecoveryTool />
      </main>
    </div>
  )
}

