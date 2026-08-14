import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <p className="text-6xl font-extrabold text-primary mb-4">404</p>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or may have been moved. Visit the homepage to
          explore the research, books, and articles of Shariful Haque.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/research">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Research & Publications
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
