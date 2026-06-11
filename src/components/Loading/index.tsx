import { Spinner } from '@heroui/react'

export default function Loading() {
  return (
    <div className="w-full h-screen mx-auto text-white bg-[radial-gradient(circle_972.6px_at_10%_20%,rgba(243,0,75,1)_0%,rgba(255,93,75,1)_90%)] flex flex-col items-center justify-center absolute z-[100000]">
      <Spinner color="current" />
      <h1 className="mt-4 text-xl font-semibold">Carregando pad...</h1>
    </div>
  )
}
