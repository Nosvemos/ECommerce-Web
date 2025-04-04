import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
import { authConfig } from '@/auth.config';
import { cookies } from 'next/headers'

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          }
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password);

          // If password is correct, return user
          if(isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          }
        }
        // If user does not exist or password does not match
        return null;
      }
    })
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token } : any) {
      // Set the user ID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the users name
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger } : any ) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role

        // If user has no name then use the email
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0].toUpperCase();

          // Update database to reflect the token name
          await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              name: token.name
            }
          });
        }

        // If user signs in or signs up
        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          // If user already has session cart id
          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId }
            });
            // If session cart is existing
            if (sessionCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: {
                  userId: user.id,
                }
              });

              // Assign new cart
              await prisma.cart.update({
                where: {
                  id: sessionCart.id
                },
                data: {
                  userId: user.id,
                }
              });
            }
          }
        }
      }
      return token;
    },
    ...authConfig.callbacks,
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);