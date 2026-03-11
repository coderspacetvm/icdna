import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true, // Required for production deployment
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // This runs after successful Google OAuth
            if (account?.provider === "google") {
                // Store Google ID in the user object for later use
                user.googleId = account.providerAccountId
                return true
            }
            return false
        },
        async jwt({ token, user, account }) {
            // Persist Google ID in JWT token
            if (account?.provider === "google") {
                token.googleId = account.providerAccountId
                token.email = user.email
                token.name = user.name
                token.picture = user.image
            }
            return token
        },
        async session({ session, token }) {
            // Make Google ID available in session
            session.user.googleId = token.googleId as string
            return session
        }
    },
    pages: {
        signIn: '/sign-in', // Custom sign-in page
    },
    session: {
        strategy: "jwt"
    }
})
