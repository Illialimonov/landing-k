import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2025-03-31.basil',
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
	try {
		const { plan } = await req.json()
		if (!plan) {
			return NextResponse.json({ message: 'Plan is required' }, { status: 400 })
		}

		const priceData = {
			starter: { amount: 0, name: 'Starter Plan' },
			creator: { amount: 1500, name: 'Creator Plan' }, // $15 в центах
			'viral-pro': { amount: 4900, name: 'Viral Pro Plan' }, // $49 в центах
		}

		const selectedPlan = priceData[plan as keyof typeof priceData]
		if (!selectedPlan) {
			return NextResponse.json({ message: 'Invalid plan' }, { status: 400 })
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: selectedPlan.name,
						},
						unit_amount: selectedPlan.amount,
					},
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: `${req.headers.get(
				'origin'
			)}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${req.headers.get('origin')}/pricing`,
		})

		return NextResponse.json({ url: session.url }, { status: 200 })
	} catch (error) {
		console.error('Stripe checkout error:', error)
		return NextResponse.json(
			{ message: 'Server error', error: String(error) },
			{ status: 500 }
		)
	}
}
