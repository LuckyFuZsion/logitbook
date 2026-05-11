import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-session'
import AdminLoginForm from '@/components/admin-login-form'

export default async function AdminLoginPage() {
  const session = await getAdminSession()
  if (session) redirect('/admin')
  return <AdminLoginForm />
}
