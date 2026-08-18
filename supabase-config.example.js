/**
 * BookPill Supabase 配置示例
 * 复制此文件为 supabase-config.js 并填入你的 Supabase 项目信息
 * anon key 是公开安全的，真实权限由 RLS 策略控制
 * 
 * 获取方式：Supabase Dashboard → Project Settings → API → Project URL 和 anon public key
 */
window.BP_SUPABASE = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-public-key',
  table: 'bookpill_books'
};
