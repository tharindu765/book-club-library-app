import { createContext } from "react"
import type { User } from "../types/User"

export interface AuthContextType {
  isLoggedIn: boolean
  login: (accessToken: string, user: User) => void
  logout: () => void
  isAuthenticating: boolean
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)