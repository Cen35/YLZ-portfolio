# Supabase 启用步骤

网站已经包含 Supabase 数据库与图片存储适配器。在填写连接信息前，网站继续使用源码中自带的项目数据，不影响本地预览。

1. 在 Supabase 新建项目。
2. 打开 SQL Editor，将 `supabase-setup.sql` 的全部内容粘贴并运行。
3. 在 Authentication > Users 中创建一个只供你使用的管理员邮箱和密码。
4. 在 Authentication 设置中关闭公开注册，避免其他人注册后修改作品。
5. 在项目的 Connect 面板复制 Project URL 和 Publishable key（旧项目可能显示为 anon key）。
6. 打开 `supabase-config.js`，填写：

```js
window.YLZ_SUPABASE_CONFIG = {
  enabled: true,
  url: '你的 Project URL',
  publishableKey: '你的 Publishable key 或 anon key',
  table: 'ylz_portfolio_projects',
  bucket: 'project-images'
};
```

7. 刷新网站并进入“管理作品”，第一次会要求输入第 3 步创建的管理员邮箱和密码。
8. 如果云端数据库还是空的，网站会自动把源码中的现有作品同步到 Supabase。以后新增、修改和删除作品，以及新上传的图片，都会同步到 Supabase。

不要把 Supabase secret key 或 service_role key 写进任何前端文件。浏览器中只能使用 Publishable key/anon key，并依靠 `supabase-setup.sql` 创建的 RLS 权限保护写操作。

Supabase 保存的是网站运行数据，GitHub 保存的是网站代码。后台新增项目后，所有连接同一 Supabase 项目的电脑和部署地址都会看到数据；GitHub 仓库不会自动产生数据库内容的代码提交。
