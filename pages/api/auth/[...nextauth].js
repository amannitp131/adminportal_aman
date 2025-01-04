import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { db } from '../../../lib/db'
import { administrationList } from '@/lib/const'

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
  ],
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        //console.log('User Object:', user)
        //console.log('Account Object:', account)
        //console.log('Profile Object:', profile)

        const email = user?.email
        if (!email) {
          console.log('Email not found during sign-in.')
          return false
        }

        const queryResult = await db.query(`SELECT * FROM users WHERE email="${email}";`)
        const userData = JSON.parse(JSON.stringify(queryResult))[0]

        if (!userData) {
          console.log('User not found in database.')
          return false
        }

        // Apply additional logic for roles/administration
        if (userData.administration && (userData.role !== 1 && userData.role !== 2)) {
          if (administrationList.has(userData.administration)) {
            userData.role = 4
          }
        }

        // Attach custom user properties directly to the user object
        user.role = userData.role
        user.department = userData.department
        user.administration = userData.administration

        return true
      } catch (error) {
        console.error('Error during sign-in callback:', error)
        return false
      }
    },

    async session({ session, token }) {
      //console.log('Session before modification:', session)
      //console.log('JWT token during session callback:', token)

      // Attach custom properties from JWT token to the session
      session.user.role = token.role || null
      session.user.department = token.department || null
      session.user.administration = token.administration || null

      //console.log('Session after modification:', session)
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        // Attach user data to token during sign-in
        token.role = user.role || null
        token.department = user.department || null
        token.administration = user.administration || null
      } else if (token.email) {
        try {
          const queryResult = await db.query(`SELECT * FROM users WHERE email="${token.email}";`)
          const userData = JSON.parse(JSON.stringify(queryResult))[0]
          if (userData) {
            token.role = userData.role || null
            token.department = userData.department || null
            token.administration = userData.administration || null
          }
        } catch (error) {
          console.error('Error during JWT callback:', error)
          // Set default values for token properties in case of error
          token.role = null
          token.department = null
          token.administration = null
        }
      }

      //console.log('JWT token:', token)
      return token
    },
  },

  debug: true,
}

export default (req, res) => NextAuth(req, res, options)
