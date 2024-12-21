import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { db } from '../../../lib/db'
import { administrationList } from '@/lib/const'

const options = {
    providers: [
        Providers.Google({
            clientId: process.env.NEXT_GOOGLE_ID,
            clientSecret: process.env.NEXT_GOOGLE_SECRET,
        }),
    ],
    session: {
        jwt: true,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        async signIn(user, account, profile) {
            try {
                const queryResult = await db.query(`SELECT * FROM users WHERE email="${profile.email}";`);
                const userData = JSON.parse(JSON.stringify(queryResult))[0];
                
                if (!userData) {
                    console.log("User not found in database.");
                    return false;
                }
                
                if (userData.administration && (userData.role !== 1 && userData.role !== 2)) {
                    if (administrationList.has(userData.administration)) {
                        userData.role = 4;
                    }
                }
                
                user.role = userData.role;
                user.department = userData.department;
                user.administration = userData.administration;
                return true;
            } catch (error) {
                console.error("Error during sign-in callback:", error);
                return false;
            }
        },
        async session(session, user) {
            session.user.role = user.role;
            session.user.department = user.department;
            session.user.administration = user.administration;
            return session;
        },
        async jwt(token, user) {
            if (user) {
                token.role = user.role;
                token.department = user.department;
                token.administration = user.administration;
            } else {
                try {
                    const queryResult = await db.query(`SELECT * FROM users WHERE email="${token.email}";`);
                    const userData = JSON.parse(JSON.stringify(queryResult))[0];
                    
                    if (userData) {
                        token.role = userData.role;
                        token.department = userData.department;
                        token.administration = userData.administration;
                    }
                } catch (error) {
                    console.error("Error during JWT callback:", error);
                }
            }
            return token;
        },
    },
    debug: false,
}

export default (req, res) => NextAuth(req, res, options);
