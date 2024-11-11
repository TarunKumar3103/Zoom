/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import jwt from 'jsonwebtoken';


const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY

const apiSecret = process.env.STREAM_SECRET_KEY

const secret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async() => {
    const user = await currentUser();
    if(!user) throw new Error("User is not authenticated or logged in")
    if(!apiKey) throw new Error("No API Key")
    if(!apiSecret) throw new Error("No API Secret")

    const client = new StreamClient(apiKey, apiSecret);
    const exp = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour expiration
    const issued = Math.floor(Date.now() / 1000); // Current timestamp

    const payload = {
        user_id: user.id,
        exp: exp,
        iat: issued
    };

    const token = jwt.sign(payload, secret!); // Sign the token with your secret

    return token;
}