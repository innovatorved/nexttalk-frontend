import { User } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }
  interface User {
    id: string;
    username: string;
  }
}
