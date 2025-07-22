'use client'

import { useRef, useTransition } from 'react'
import { useToast } from '@/hooks/use-toast'
import { saveMessage } from '@/app/admin/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Send } from 'lucide-react'

export default function ContactForm() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await saveMessage(formData)
      if (result.error) {
        toast({
          title: 'Error',
          description: "There was a problem sending your message.",
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Message Sent!',
          description: "Thanks for reaching out. I'll get back to you soon.",
        })
        formRef.current?.reset()
      }
    })
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Send a Message</CardTitle>
        <CardDescription>Your message will be sent directly to my inbox.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="name" placeholder="Your Name" required />
            <Input name="email" type="email" placeholder="Your Email" required />
          </div>
          <Textarea name="message" placeholder="Your Message" rows={5} required />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Sending...' : 'Send Message'} <Send className="ml-2 w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
