// 模拟用户认证模块
// 在实际生产环境中，应该使用 NextAuth.js 或其他认证方案

// 模拟用户 ID（用于开发测试）
const DEMO_USER_ID = 'demo-user-001'

/**
 * 获取当前用户 ID
 * 在实际应用中，这应该从 session 或 token 中获取
 */
export function getCurrentUserId(): string {
  // 在开发环境中返回模拟用户 ID
  return DEMO_USER_ID
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(): boolean {
  // 在开发环境中始终返回 true
  return true
}

/**
 * 用户权限检查
 */
export function hasPermission(_userId: string, _permission: string): boolean {
  // 在开发环境中始终返回 true
  return true
}
