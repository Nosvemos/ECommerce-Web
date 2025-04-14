'use client'

import { useState } from 'react'
import { insertReviewSchema } from '@/lib/validators'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { REVIEW_FORM_DEFAULT_VALUES } from '@/lib/constants'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StarIcon } from 'lucide-react'

const ProductReviewForm = ({ userId, productId, onReviewSubmitted } : {
  userId: string,
  productId: string,
  onReviewSubmitted?: () => void,
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: REVIEW_FORM_DEFAULT_VALUES
  });

  const handleOpenForm = () => {
    setOpen(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm}>Write a Review</Button>
      <DialogContent className='sm:max-w-[425px]'>
        <Form {...form}>
          <form method='POST'>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>Share your thoughts with other customers</DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <FormField control={form.control} name='title' render={({field}) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter title' {...field} />
                  </FormControl>
                </FormItem>
              )}/>
              <FormField control={form.control} name='description' render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className='resize-none' placeholder='Enter description' {...field} />
                  </FormControl>
                </FormItem>
              )}/>
              <FormField control={form.control} name="rating" render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <Select {...field}
                    defaultValue={
                      !field.value ? undefined : field.value.toString()
                    }
                    value={
                      !field.value ? undefined : field.value.toString()
                    }
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <SelectItem
                          key={index}
                          value={(index + 1).toString()}
                        >
                          {index + 1}{' '}
                          <StarIcon className="inline size-4" />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <DialogFooter>
              <Button type='submit' size='lg' className='w-full' disabled={ form.formState.isSubmitting }>
                { form.formState.isSubmitting ? 'Submitting...' : 'Submit' }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductReviewForm