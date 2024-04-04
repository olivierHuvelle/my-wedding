import {NextRequest} from "next/server";
import {SessionService} from "@/back/services/SessionService";

export async function middleware(request: NextRequest){
    const sessionService = new SessionService()
    return await sessionService.updateSessionExpirationFromRequest(request)
}