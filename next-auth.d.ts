import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            identifier: string;
            roleCategory: string;
        } & DefaultSession;
    }

    interface User extends DefaultUser {
        identifier: string;
        roleCategory: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string;
            identifier: string;
            roleCategory: string;
        }
    }
}
