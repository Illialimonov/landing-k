import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
	try {
		const { token } = await req.json()
		if (!token) {
			return NextResponse.json(
				{ message: 'Token is required' },
				{ status: 400 }
			)
		}

		const refreshToken = await prisma.refreshToken.findFirst({
			where: { expiresAt: { gt: new Date() } },
			include: { user: true },
		})

		if (!refreshToken || !(await bcrypt.compare(token, refreshToken.token))) {
			return NextResponse.json(
				{ message: 'Invalid or expired token' },
				{ status: 401 }
			)
		}

		const accessToken = jwt.sign(
			{ userId: refreshToken.user.id, email: refreshToken.user.email },
			process.env.JWT_ACCESS_SECRET!,
			{ expiresIn: '15m' }
		)
		const newRefreshToken = uuidv4()
		const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10)

		await prisma.refreshToken.update({
			where: { id: refreshToken.id },
			data: {
				token: hashedNewRefreshToken,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			},
		})

		return NextResponse.json({
			access_token: accessToken,
			refresh_token: newRefreshToken,
			userDetails: { email: refreshToken.user.email },
		})
	} catch (error) {
		return NextResponse.json({ message: 'Server error' }, { status: 500 })
	}
}
