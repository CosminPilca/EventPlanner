import { Suspense } from 'react'
import UnauthorizedClient from '@/components/UI/UnauthorizedClient'

export const dynamic = 'force-dynamic'

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnauthorizedClient />
    </Suspense>
  )
}
