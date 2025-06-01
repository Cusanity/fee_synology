const {defineConfig} = require('@vue/cli-service')
const fs = require('fs-extra')
const path = require('path')

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',
    outputDir: 'docs',
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
    },
    devServer: {
        port: 8010,
    },
    // 添加构建完成后的钩子
    configureWebpack: {
        plugins: [
            {
                apply: (compiler) => {
                    compiler.hooks.afterEmit.tap('CopyPHPFiles', (compilation) => {
                        const srcDir = path.resolve(__dirname, 'src/php')
                        const destDir = path.resolve(__dirname, 'docs/php')
                        
                        if (fs.existsSync(srcDir)) {
                            console.log('Copying PHP files from src/php to docs/php...')
                            fs.copySync(srcDir, destDir)
                            console.log('PHP files copied successfully!')
                        } else {
                            console.log('src/php directory does not exist, skipping copy.')
                        }
                    })
                }
            }
        ]
    }
})
