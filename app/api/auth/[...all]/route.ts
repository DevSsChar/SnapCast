import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import aj from "@/lib/arcjet";
import { Arcjet, ArcjetDecision, slidingWindow, validateEmail } from "@arcjet/next";
import { NextRequest } from "next/server";
import ip from '@arcjet/ip'
import { use } from "react";

// email validation to prevent dummy,spammy,unverified,temporary emails
const emailValidation=aj.withRule(validateEmail({
    mode: 'LIVE',
    block: ['DISPOSABLE','INVALID','NO_MX_RECORDS']
}))
// rate limiting with sliding window algorithm
const rateLimit=aj.withRule(
    slidingWindow({
        mode: 'LIVE',
        interval: '1m', // 1 minute
        max: 6, // divide window into 6 segments of 10 seconds each
        characteristics: ['fingerprint'],
    })
);

const protectedAuth=async (req: NextRequest): Promise<ArcjetDecision> => {
    //get session details from request
    const session=await auth.api.getSession({
        headers: req.headers
    })

    let userId: string;
    if(session?.user?.id)
    {
        userId=session.user.id;
    }else{
        userId=ip(req) || '127.0.0.1';
    }

    if(req.nextUrl.pathname.startsWith('/api/auth/sign-in'))
    {
        const body=await req.clone().json();

        if(typeof body.email==='string')
        {
            return emailValidation.protect(req,{email: body.email});
        }
    }

    return rateLimit.protect(req,{fingerprint: userId});
}

const authHandlers=toNextJsHandler(auth.handler);

export const {GET}=authHandlers;
export const POST=async(req:NextRequest)=>{
    const decision=await protectedAuth(req);

    if(decision.isDenied())
    {
        if(decision.reason.isEmail())
        {
            throw new Error('Email address is not valid. Please use a different email.');
        }
        if(decision.reason.isRateLimit())
        {
            throw new Error('Too many requests. Please try again later.');
        }
        if(decision.reason.isShield())
        {
            throw new Error('Request blocked due to security reasons.');
        }
    }

    return authHandlers.POST(req);
};
// export the GET and POST methods for next js api route    