import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	try {
		const ip = req.headers.get('x-forwarded-for') || 'unknown'
		return NextResponse.json(ip)
	} catch (error) {
		return NextResponse.json({ message: 'Server error' }, { status: 500 })
	}
}
