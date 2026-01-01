import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const reservationSchema = z.object({
    slotId: z.number(),
    name: z.string().min(1, '名前は必須です'),
    email: z.string().email('有効なメールアドレスを入力してください'),
    phone: z.string().min(10, '電話番号は必須です'),
    staffReq: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = reservationSchema.parse(body);

        // Use transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Check slot availability
            const slot = await tx.viewingSlot.findUnique({
                where: { id: validatedData.slotId },
            });

            if (!slot) {
                throw new Error('スロットが見つかりません');
            }

            if (slot.reservedCount >= slot.capacity) {
                throw new Error('このスロットは満席です');
            }

            // Create reservation
            const reservation = await tx.reservation.create({
                data: {
                    slotId: validatedData.slotId,
                    name: validatedData.name,
                    email: validatedData.email,
                    phone: validatedData.phone,
                    staffReq: validatedData.staffReq,
                },
                include: {
                    slot: {
                        include: {
                            property: true,
                        },
                    },
                },
            });

            // Increment reserved count
            await tx.viewingSlot.update({
                where: { id: validatedData.slotId },
                data: {
                    reservedCount: {
                        increment: 1,
                    },
                },
            });

            return reservation;
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: '入力データが無効です', details: error.issues },
                { status: 400 }
            );
        }

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.error('Error creating reservation:', error);
        return NextResponse.json(
            { error: '予約の作成に失敗しました' },
            { status: 500 }
        );
    }
}
