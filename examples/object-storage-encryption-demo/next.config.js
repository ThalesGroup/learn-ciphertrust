/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/encrypt-proxy",
        destination: `${process.env.CTM_URL}/api/v1/crypto/encrypt`
      },
      {
        source: "/api/decrypt-proxy",
        destination: `${process.env.CTM_URL}/api/v1/crypto/decrypt`
      }
    ]
  }

}