import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        const reservation = await prisma.reservation.findUnique({
            where: { token },
            include: {
                slot: {
                    include: {
                        property: true,
                    },
                },
            },
        });

        if (!reservation) {
            return NextResponse.json(
                { error: '予約が見つかりませんでした' },
                { status: 404 }
            );
        }

        return NextResponse.json(reservation);
    } catch (error) {
        console.error('Error fetching reservation:', error);
        return NextResponse.json(
            { error: '予約の取得に失敗しました' },
            { status: 500 }
        );
    }
}
