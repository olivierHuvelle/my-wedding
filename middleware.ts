import {chain} from "@/middlewares/chain";
import withRate from "@/middlewares/with-rate";
import withAuthMiddleware from '@/middlewares/with-auth'
import withRoleMiddleware from '@/middlewares/with-role'


export default chain([withRate, withAuthMiddleware, withRoleMiddleware])

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}