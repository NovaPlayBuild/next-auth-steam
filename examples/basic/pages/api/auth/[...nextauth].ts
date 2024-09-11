import SteamProvider, {
  onUserInfoRequestContext
} from '@novaplay/next-auth-steam'
import NextAuth from 'next-auth/next'

import type { NextApiRequest, NextApiResponse } from 'next'

const MY_API_KEY = ''

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return NextAuth(req, res, {
    providers: [
      SteamProvider(
        {
          nextAuthUrl: `${process.env.NEXTAUTH_URL!}/api/auth/callback`,
          onUserInfoRequest: async (ctx: onUserInfoRequestContext) => {
            // execute something on token request
            // some profile data which will be returned back to you on the client
            // example get the player data and merge it with the user info, therefore you wont need to pass any secret to us
            const response = await fetch(
              `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${MY_API_KEY}&steamids=${ctx.tokens.steamId}`
            )
            const data = await response.json()
            return data.response.players[0]
          }
        },
        req
      )
    ]
  })
}
