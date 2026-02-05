import { AuthView } from '@daveyplate/better-auth-ui'
import { authViewPaths } from '@daveyplate/better-auth-ui/server'
import { GalleryVerticalEnd } from 'lucide-react'
import Image from 'next/image'

export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }))
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a className="flex items-center gap-2 font-medium" href="/">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <AuthView path={path} />
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          alt="Org Logo"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          src="/placeholder.svg"
        />
      </div>
    </div>
  )
}
