'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl text-destructive">Application Error</CardTitle>
          <CardDescription>
            Something went wrong. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
             <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                <p><strong>Error Details:</strong> {error.message}</p>
             </div>
          )}
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
