import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		console.log('Received request:', body)
		const { email, password } = body || {}
		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Email and password are required' },
				{ status: 400 }
			)
		}

		console.log('Checking existing user:', email)
		const existingUser = await prisma.user.findUnique({ where: { email } })
		if (existingUser) {
			return NextResponse.json(
				{ message: 'User already exists' },
				{ status: 409 }
			)
		}

		console.log('Hashing password...')
		const hashedPassword = await bcrypt.hash(password, 10)
		console.log('Creating user...')
		await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		})

		return NextResponse.json(
			{ message: 'Registration successfully' },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Registration error:', error)
		return NextResponse.json(
			{ message: 'Server error', error: String(error) },
			{ status: 500 }
		)
	}
}
