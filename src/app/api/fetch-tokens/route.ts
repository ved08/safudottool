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
        // Simulate API call to fetch assets
        // Sample secret key 4GtZQJJcZRfAGSV6K9shTsjv2qUWBtsvyNpdxh9uyo7Pyz9s8Qfghesi8WbrcEEdLEFbhExQ82dJ7gXHfaEpzbtZ
        const { secretKey } = await req.json()
        const keypair = Keypair.fromSecretKey(base58.decode(secretKey))
        const umi = createUmi("https://api.devnet.solana.com").use(dasApi())
        const umiKeypair = umi.eddsa.createKeypairFromSecretKey(keypair.secretKey);
        const ownerPublickey = publicKey(umiKeypair.publicKey)
        const connection = new Connection(clusterApiUrl("devnet"))

        const tokens = await connection.getParsedTokenAccountsByOwner(keypair.publicKey, {
            programId: TOKEN_PROGRAM_ID
        })
        const tokens2022 = await connection.getParsedTokenAccountsByOwner(keypair.publicKey, {
            programId: TOKEN_2022_PROGRAM_ID
        })
        const fungibleTokens = tokens.value.filter(
            (accountInfo) => {
                const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
                return amount > 1;
            }
        );

        // Extract and return the mint addresses of the fungible tokens
        const tokenMints = fungibleTokens.map(
            (accountInfo) => ({ info: accountInfo.account.data.parsed.info })
        );
        const fungibleTokens2022 = tokens2022.value.filter(
            (accountInfo) => {
                const amount = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
                return amount > 1;
            }
        );
        // Extract and return the mint addresses of the fungible tokens
        const tokenMints2022 = fungibleTokens2022.map(
            (accountInfo) => ({ info: accountInfo.account.data.parsed.info, type: "Token" })
        );

        const allTokens = []
        allTokens.push(...tokenMints)
        allTokens.push(...tokenMints2022)

        console.log("Token: ", tokenMints)
        console.log("Token2022: ", tokenMints2022)
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
            assets: allTokens,
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