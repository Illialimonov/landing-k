'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import $api from '@/lib/http'
import { useToast } from '@/hooks/use-toast'

type ContactFormData = {
	senderEmail: string
	message: string
}

export default function ContactUsPage() {
	const { toast } = useToast()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ContactFormData>({
		defaultValues: {
			senderEmail: '',
			message: '',
		},
	})

	const onSubmit: SubmitHandler<ContactFormData> = async data => {
		try {
			await $api.post('/user/contact-us', {
				senderEmail: data.senderEmail,
				message: data.message,
			})
			toast({
				title: 'Success',
				description: 'Your message has been sent successfully!',
			})
			reset()
		} catch (err: any) {
			console.error(
				'Contact request failed:',
				err.response?.data || err.message
			)
			toast({
				variant: 'destructive',
				title: 'Error',
				description: err.response?.data?.message || 'Failed to send message',
			})
		}
	}

	return (
		<section className='min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12'>
			<div className='absolute inset-0 w-full h-full'>
				<div className='absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl' />
				<div className='absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-3xl' />
			</div>

			<div className='container mx-auto px-4 relative z-10'>
				<h1 className='text-4xl md:text-5xl font-bold text-center gradient-text mb-4'>
					Contact Us
				</h1>
				<p className='text-center text-muted-foreground mb-12 max-w-2xl mx-auto'>
					Have a question or need help? Reach out to us, and we’ll get back to
					you as soon as possible.
				</p>

				<div className='max-w-md mx-auto bg-secondary/50 rounded-xl p-8 backdrop-blur-sm border border-muted-foreground/20'>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
						<div>
							<label
								className='block text-muted-foreground mb-2'
								htmlFor='senderEmail'
							>
								Your Email
							</label>
							<input
								id='senderEmail'
								type='email'
								{...register('senderEmail', {
									required: 'Email is required',
									pattern: {
										value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
										message: 'Invalid email address',
									},
								})}
								className={`w-full p-3 rounded-lg bg-background border border-muted-foreground/20 text-white focus:outline-none focus:ring-2 focus:ring-primary ${
									errors.senderEmail ? 'border-red-500' : ''
								}`}
								placeholder='example@email.com'
							/>
							{errors.senderEmail && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.senderEmail.message}
								</p>
							)}
						</div>

						<div>
							<label
								className='block text-muted-foreground mb-2'
								htmlFor='message'
							>
								Your Message
							</label>
							<textarea
								id='message'
								{...register('message', {
									required: 'Message is required',
									minLength: {
										value: 5,
										message: 'Message must be at least 10 characters long',
									},
								})}
								className={`w-full p-3 rounded-lg bg-background border border-muted-foreground/20 text-white focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[150px] ${
									errors.message ? 'border-red-500' : ''
								}`}
								placeholder='Describe your issue or question...'
							/>
							{errors.message && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.message.message}
								</p>
							)}
						</div>

						<button
							type='submit'
							disabled={isSubmitting}
							className='w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50'
						>
							{isSubmitting ? 'Sending...' : 'Send'}
						</button>
					</form>
				</div>
			</div>
		</section>
	)
}
