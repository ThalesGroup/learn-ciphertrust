/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/create-key-proxy",
        destination: `${process.env.CTM_URL}/api/v1/vault/keys2`
      },
      {
        source: "/api/export-key-proxy/:keyId",
        destination: `${process.env.CTM_URL}/api/v1/vault/keys2/:keyId/export`
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/demo',
        permanent: false,
      },
    ]
  }
}

module.exports = nextConfig
