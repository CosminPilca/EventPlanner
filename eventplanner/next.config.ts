import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // ignore lint
    },
    typescript: {
        ignoreBuildErrors: true, // ignore TS errors
    },
    webpack(config) {
        config.module.rules.forEach((rule: any) => {
            if (rule.oneOf) {
                rule.oneOf.forEach((oneOfRule: any) => {
                    if (oneOfRule.use && Array.isArray(oneOfRule.use)) {
                        const hasPostcssLoader = oneOfRule.use.find((u: any) =>
                            u && u.loader && typeof u.loader === 'string' && u.loader.includes('postcss-loader')
                        );

                        if (hasPostcssLoader) {
                            oneOfRule.use = oneOfRule.use.map((u: any) => {
                                if (u && u.loader && typeof u.loader === 'string' && u.loader.includes('postcss-loader')) {
                                    return {
                                        ...u,
                                        options: {
                                            ...u.options,
                                            postcssOptions: {
                                                plugins: [
                                                    require('postcss-import'),
                                                    require('@tailwindcss/postcss'), // Changed this line
                                                    require('autoprefixer'),
                                                ],
                                            },
                                        },
                                    };
                                }
                                return u;
                            });
                        }
                    }
                });
            }
        });
        return config;
    },
}

export default nextConfig