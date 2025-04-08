import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json()
		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Email and password are required' },
				{ status: 400 }
			)
		}

		const user = await prisma.user.findUnique({ where: { email } })
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return NextResponse.json(
				{ message: 'Incorrect credentials' },
				{ status: 401 }
			)
		}

		const accessToken = jwt.sign(
			{
				userId: user.id,
				email: user.email,
			},
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
