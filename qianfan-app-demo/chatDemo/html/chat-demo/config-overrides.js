const HtmlWebpackPlugin = require('html-webpack-plugin') //html编译插件，根据变量替换部分内容
const isEnvProduction = process.env.NODE_ENV === 'production';
const { override, addWebpackPlugin, overrideDevServer, addLessLoader, adjustStyleLoaders } = require('customize-cra');

/**
 * 服务配置
 */
const devServerConfig = () => (config) => {
  return {
    ...config,
    proxy: {
      '/v1': {
        target: 'http://127.0.0.1:8086',
        ws: true,
        changeOrigin: true
      },
    },
    compress: false
  };
};

module.exports = {
  webpack: override(
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: { "@primary-color": "red" },
      },
    }),
    adjustStyleLoaders(({ use: [, , postcss] }) => {
      const postcssOptions = postcss.options;
      postcss.options = { postcssOptions };
    }),
    isEnvProduction &&
    addWebpackPlugin(new HtmlWebpackPlugin({
      filename: 'entry1.html',
      template: `${__dirname}/public/index.html`
    })),
  ),
  devServer: overrideDevServer(devServerConfig()),
};
