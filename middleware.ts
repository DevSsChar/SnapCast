import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
// dont import next from next and use runtime as nodejs
export const runtime = 'nodejs';

export async function middleware(request: NextRequest, response: NextResponse) {
  const session=await auth.api.getSession({
    headers: await headers()
  })

  if(!session)
  {
    // passing the request url to know we are coming to signin from which location
    return NextResponse.redirect(new URL('/sign-in',request.url))
  }
  // if session exists let the request continue
  return NextResponse.next();
}
// to apply the middleware to given routes
export const config={
    // to all routes except these
    matcher:["/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)"]
}