// import NextAuth from "next-auth";

// import SpotifyProvider from "next-auth/providers/spotify";
// import { refreshAccessToken } from "spotify-web-api-node/src/server-methods";
// import spotifyApi, {LOGIN_URL} from "../../../lib/spotify";


// async function refreshAccessToken(token) {

//     try{

//         spotifyApi.setAccessToken(token.accessToken); 
//         spotifyApi.setAccessToken(token.refreshToken);

//         const { body: refreshedToken } = await spotifyApi.refreshAccessToken(); 

//         console.log("REFRESHED TOKEN IS", refreshedToken);

//         return{

//             ...token, 
//             accessToken: refreshedToken.access_token,
//             accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, //=1 hour as 3600 returns, from spotify API

//             refreshToken: refreshedToken.refresh_token ?? token.refreshToken,

            
//         };

//     } catch (error) {
//         console.error(error);

//         return {

//             ...token, 
//             error: 'refreshAccessTokenError'
//         }

//     }
// }

// export default NextAuth({
//   // Configure one or more authentication providers
//   providers: [
//     SpotifyProvider({
//       clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
//       authorization: LOGIN_URL,
      
//     }),
//     // ...add more providers here
//   ],

//   secret: process.env.JWT_SECRET,
//   pages: {
//       signIn: "/login",
//   }, 
//   callbacks: {

//     async jwt({ token, account, user }) {

//         //initial sign in

//         if (account && user) {
//             return {
//                 ...token, 
//                 accessToken: account.access_token, 
//                 refreshToken: account.refresh_token,
//                 username: account.providerAccountId,
//                 accessTokenExpires: account.expires_at * 1000, // handling expiry times in milliseconds
//             }
//         }

//         //return previous token if access token has not expired yet
//         if (Date.now() < token.accessTokenExpires) {
//             console.log("EXISTING ACCESS TOKEN IS VALID");
//             return token;
//         }

//         //access token expired, we need to refresh
//         console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
//         return await refreshAccessToken(token);
//     },

//     async session ({ session, token }) {
//         session.user.accessToken = token.accessToken;
//         session.user.refreshToken = token.refreshToken;
//         session.user.username = token.username;

//         return session;


//     }
//   }
// });

import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import SpotifyAPI, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    SpotifyAPI.setAccessToken(token.accessToken);
    SpotifyAPI.setAccessToken(token.refreshToken);

    const { body: refreshedToken } = await SpotifyAPI.refreshAccessToken();

    console.log("Refreshed token is", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Initil Sign In
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        };
      }

      // Return previous token if the access token hasn't expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("Token is valid ...");
        return token;
      }

      // Access Token expired, so refresh it...token
      console.log("Token expired, refreshing...");
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});