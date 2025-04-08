import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

export async function POST(req: Request) {
	try {
		const { credentials } = await req.json()
		if (!credentials) {
			return NextResponse.json(
				{ message: 'Google token is required' },
				{ status: 400 }
			)
		}

		const ticket = await client.verifyIdToken({
			idToken: credentials,
			audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
		})
		const payload = ticket.getPayload()
		if (!payload || !payload.email) {
			return NextResponse.json(
				{ message: 'Invalid Google Token' },
				{ status: 401 }
			)
		}

		const email = payload.email
		let user = await prisma.user.findUnique({ where: { email } })
		if (!user) {
			const hashedPassword = await bcrypt.hash(uuidv4(), 10)
			user = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
				},
			})
		}

		const accessToken = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_ACCESS_SECRET!,
			{ expiresIn: '15m' }
		)
		const refreshToken = uuidv4()
		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)

		await prisma.refreshToken.create({
			data: {
				token: hashedRefreshToken,
				userId: user.id,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			},
		})

		return NextResponse.json({
			access_token: accessToken,
			refresh_token: refreshToken,
			userDetails: { email: user.email },
		})
	} catch (error) {
		return NextResponse.json({ message: 'Server error' }, { status: 500 })
	}
}
