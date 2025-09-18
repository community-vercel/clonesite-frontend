'use client'
import { Header } from '@/components/Header'
import { SellerHeader } from '@/components/sellerHeader'

export default function ClientLayout({ user, children }) {
  return (
    <>
      {user?.userType === 'service_provider' ? <SellerHeader /> : <Header />}
      <main className="min-h-screen">{children}</main>
    </>
  )
}