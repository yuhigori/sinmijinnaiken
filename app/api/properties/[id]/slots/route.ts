import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const propertyId = parseInt(id);
        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get('date');

        if (!dateParam) {
            return NextResponse.json(
                { error: '日付パラメータが必要です' },
                { status: 400 }
            );
        }

        const targetDate = new Date(dateParam);
        targetDate.setHours(0, 0, 0, 0);

        // Check if slots exist for this date
        const existingSlots = await prisma.viewingSlot.findMany({
            where: {
                propertyId,
                startTime: {
                    gte: targetDate,
                    lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
                },
            },
            include: {
                _count: {
                    select: { reservations: true },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        // If slots don't exist, generate them
        if (existingSlots.length === 0) {
            const newSlots = [];
            for (let hour = 10; hour < 18; hour++) {
                const startTime = new Date(targetDate);
                startTime.setHours(hour, 0, 0, 0);

                const endTime = new Date(targetDate);
                endTime.setHours(hour + 1, 0, 0, 0);

                newSlots.push({
                    propertyId,
                    startTime,
                    endTime,
                    capacity: 1,
                    reservedCount: 0,
                });
            }

            await prisma.viewingSlot.createMany({
                data: newSlots,
            });

            // Fetch the newly created slots
            const createdSlots = await prisma.viewingSlot.findMany({
                where: {
                    propertyId,
                    startTime: {
                        gte: targetDate,
                        lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
                    },
                },
                include: {
                    _count: {
                        select: { reservations: true },
                    },
                },
                orderBy: {
                    startTime: 'asc',
                },
            });

            return NextResponse.json(createdSlots);
        }

        return NextResponse.json(existingSlots);
    } catch (error) {
        console.error('Error fetching/creating slots:', error);
        return NextResponse.json(
            { error: 'スロットの取得に失敗しました' },
            { status: 500 }
        );
    }
}
