const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

let envKeys = {};
try {
    const dotenv = require('dotenv').config().parsed || {};
    envKeys = Object.keys(dotenv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(dotenv[next]);
        return prev;
    }, {});
} catch (error) {
    console.warn('No se encontró dotenv o falló la carga del archivo .env.');
}

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    
    return {
        entry: './src/index.tsx',
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'js/[name].[contenthash].js',
            // Ruta absoluta desde raíz - funciona con HashRouter
            publicPath: '/',
            clean: true,
            assetModuleFilename: 'assets/[name].[hash][ext]',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            fallback: {
                process: false,
            },
        },
        
        performance: {
            hints: false,
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    // Webpack 5 Asset Modules - para imágenes
                    test: /\.(png|jpe?g|gif|webp|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[hash][ext]',
                    },
                },
                {
                    // Webpack 5 Asset Modules - para videos
                    test: /\.(mp4|webm|ogg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'videos/[name].[hash][ext]',
                    },
                },
                {
                    // Fuentes
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name].[hash][ext]',
                    },
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin(envKeys),
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new HtmlWebpackPlugin({
                template: './src/public/index.html',
                filename: 'index.html',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'src/public',
                        to: '',
                        globOptions: {
                            ignore: ['**/index.html'],
                        },
                    },
                ],
            }),
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, 'public'),
            },
            compress: true,
            historyApiFallback: true,
            port: 8080,
            proxy: [
                {
                    context: ['/api'],
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                    pathRewrite: { '^/api': '/api' },
                },
            ],
        },
    };
};
