import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            roleCategory: string;
        } & DefaultSession;
    }

    interface User extends DefaultUser {
        roleCategory: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string;
            email: string;
            roleCategory: string;
        }
    }
}
