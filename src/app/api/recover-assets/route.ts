/* eslint-disable @typescript-eslint/no-unused-vars */
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    Connection,
    Keypair,
    Transaction,
    SystemProgram,
    TransactionInstruction,
    sendAndConfirmTransaction,
    clusterApiUrl,
    GetProgramAccountsFilter,
    AccountInfo,
    ParsedAccountData,
    PublicKey,
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
    tokenAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchAllDigitalAssetByOwner, fetchAllEdition, fetchAllMetadataByOwner } from "@metaplex-foundation/mpl-token-metadata";

export const POST = async (req: Request) => {
    try {
        const { secretKey, tokens, nfts } = await req.json()
        const compromisedKeypair = Keypair.fromSecretKey(base58.decode(secretKey))
        const instructions = [
            // SystemProgram.transfer({
            //     fromPubkey:
            // })
        ]
        return Response.json({
            assets: "allTokens",
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
    return Response.json({ message: "Yoo" });
};