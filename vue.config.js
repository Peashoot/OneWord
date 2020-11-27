const path = require('path')
const vantTheme = path.resolve(__dirname, "./src/styles/theme.less")

module.exports = {
    devServer: {
        proxy: {
            '/getproxy': {
                // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
                target: 'https://www.kuaidaili.com/',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/getproxy': ''
                }
            }
        }
    },
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    // 可在此编写样式变量
                    // 'blue': 'red',
                    // 也可以引入我们创建好的theme.less文件
                    hack: `true; @import "${vantTheme}";`,
                },
            },
        },
    }

}

function resolve(dir) {
    return path.join(__dirname, dir)
}