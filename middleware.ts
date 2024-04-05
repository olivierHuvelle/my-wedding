import {chain} from "@/middlewares/chain";
import {withUpdateSession} from "@/middlewares/update-session";

export default chain([withUpdateSession])

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}