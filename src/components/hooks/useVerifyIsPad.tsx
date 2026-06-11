'use client'

import { usePathname } from 'next/navigation'

const useVerifyIsPad = () => {
  const pathname = usePathname()
  return pathname !== '/'
}

export default useVerifyIsPad
