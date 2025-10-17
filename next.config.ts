import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.hbs$/,
      loader: 'handlebars-loader',
    });

    // Fallback para packages que usam require.extensions (genkit, dotprompt)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // O `handlebars` completo não é necessário no lado do cliente
        handlebars: false, 
      };
    }

    return config;
  },
};

export default nextConfig;
