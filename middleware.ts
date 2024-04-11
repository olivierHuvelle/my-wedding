import {chain} from "@/middlewares/chain";
import withAuthMiddleware from '@/middlewares/with-auth'
import withRoleMiddleware from '@/middlewares/with-role'


export default chain([withAuthMiddleware, withRoleMiddleware])

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}