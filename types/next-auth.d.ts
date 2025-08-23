import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id: string
    role: "student" | "teacher" | "university_admin"
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: "student" | "teacher" | "university_admin"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    role?: "student" | "teacher" | "university_admin"
  }
}

export {}


