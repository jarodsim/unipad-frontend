'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ReactGA from 'react-ga4'

const TRACKING_ID = 'G-Z33D84EBN9'

export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID)
  }, [])

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: pathname,
      title: document.title,
    })
  }, [pathname])

  return null
}
