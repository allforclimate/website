module.exports = {
  env: {
    OC_GRAPHQL_API: "https://api.opencollective.com/graphql/v1/",
    OC_GRAPHQL_API_V2: "https://api.opencollective.com/graphql/v2/",
  },
  images: {
    domains: [
      "lh1.googleusercontent.com",
      "lh2.googleusercontent.com",
      "lh3.googleusercontent.com",
      "lh4.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh6.googleusercontent.com",
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "collectives.allforclimate.earth",
            },
          ],
          destination: "/collectives/:path*",
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "drive.allforclimate.earth",
          },
        ],
        permanent: false,
        destination:
          "https://drive.google.com/drive/u/0/folders/1g14Qyf_DmvGuevk4Ks5NgfkWPN5V6H6O",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "zoom.allforclimate.earth",
          },
        ],
        permanent: false,
        destination: "https://us02web.zoom.us/j/6025635806",
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "discord.allforclimate.earth",
          },
        ],
        permanent: false,
        destination: "https://discord.gg/mepZUa5VSW",
      },
    ];
  },
};
