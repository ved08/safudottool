/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { fetchAllDigitalAssetByOwner, fetchAllEdition, fetchAllMetadataByOwner } from "@metaplex-foundation/mpl-token-metadata";

export const POST = async (req: Request) => {
    try {
        // Simulate API call to fetch assets
        // const secretKey = "UpTcTstVRrUTHQHdxsy84yUTKXp4CCg2dfNP6XVZJ4gUtp4uCCa849rkiWaDHfobtdrxj3KzE8t2zK2tUgrhSdG"
        const { secretKey } = await req.json()
        const keypair = Keypair.fromSecretKey(base58.decode(secretKey))
        const umi = createUmi("https://api.devnet.solana.com")
        const umiKeypair = umi.eddsa.createKeypairFromSecretKey(keypair.secretKey);
        const ownerPublickey = publicKey(umiKeypair.publicKey)
        const assets = await fetchAllDigitalAssetByOwner(umi, ownerPublickey)
        // console.log("Hello World", assets[1])
        const filtered = assets.map(asset => {
            return {
                decimals: asset.mint.decimals,
                mint: asset.mint.publicKey,
                supply: asset.mint.supply.toString(),
                name: asset.metadata.name,
                uri: asset.metadata.uri,
                tokenStandard: asset.metadata.tokenStandard,
                editionNonce: asset.metadata.editionNonce,
            }
        })
        // console.log(filtered)
        // allNFTs.forEach((nft, index) => {
        //   console.log(`\nNFT #${index + 1}:`);
        //   console.log("Mint Address:", nft.publicKey);
        //   console.log("Name:", nft.metadata.name);
        //   console.log("Symbol:", nft.metadata.symbol);
        //   console.log("URI:", nft.metadata.uri);
        // });
        // setTokens(mockTokens)
        // setNFTs(mockNFTs)
        return Response.json({
            assets: filtered,
            error: false
        })
    } catch (e) {
        console.log(e)
        return Response.json({
            error: true,
            message: "Please provide a valid secret key"
        })
    }
}
export const GET = async (req: Request) => {
    return Response.json({ message: "Method not supported" });
};