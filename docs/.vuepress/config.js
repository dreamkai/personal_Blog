module.exports = {
    title: '王凯的博客',
    description: '我的个人网站',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
      ['link', { rel: 'icon', href: './public/images/photo.jpg' }],
      ['link', { rel: 'manifest', href: './public/images/photo.jpg' }],
      ['link', { rel: 'apple-touch-icon', href: './public/images/photo.jpg' }],
      ['meta', { 'http-quiv': 'pragma', cotent: 'no-cache'}],
      ['meta', { 'http-quiv': 'pragma', cotent: 'no-cache,must-revalidate'}],
      ['meta', { 'http-quiv': 'expires', cotent: '0'}]
    ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
      lineNumbers: false // 代码块显示行号
    },
    themeConfig: {
      nav:[ // 导航栏配置
      {text: '前端基础', link: '/accumulate/' },
      {text: '组件库', link: '/algorithm/'},
      {text: 'github', link: 'https://github.com/dreamkai/personal_Blog'}      
      ],
      sidebar: {
        '/accumulate/': [
          '',     
          'guide', 
        ],
        '/': [
          '',        /* / */
        ]
      },
      sidebarDepth: 2, // 侧边栏显示2级
    }
  };