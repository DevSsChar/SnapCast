import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const {GET,POST}=toNextJsHandler(auth.handler)
// export the GET and POST methods for next js api route