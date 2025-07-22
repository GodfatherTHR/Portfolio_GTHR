'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { markMessageAsRead } from '@/app/admin/actions'
import { useToast } from '@/hooks/use-toast'

export default function MarkAsReadButton({ messageId }: { messageId: number }) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleClick = () => {
    startTransition(async () => {
      const result = await markMessageAsRead(messageId)
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error._server?.[0],
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Message marked as read.',
        })
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? 'Marking...' : 'Mark as Read'}
    </Button>
  )
}
