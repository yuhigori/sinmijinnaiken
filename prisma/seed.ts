import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.reservation.deleteMany();
    await prisma.viewingSlot.deleteMany();
    await prisma.property.deleteMany();

    console.log('Cleared existing data');

    // Create sample properties
    const properties = await Promise.all([
        prisma.property.create({
            data: {
                name: 'サンライズマンション 301号室',
                address: '東京都渋谷区神宮前1-2-3',
                description: '駅徒歩5分、南向きで日当たり良好。リノベーション済みの綺麗なお部屋です。',
                imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                rent: 120000,
                layout: '1LDK',
                size: 45.5,
            },
        }),
        prisma.property.create({
            data: {
                name: 'グリーンハイツ 205号室',
                address: '東京都世田谷区三宿2-10-5',
                description: '閑静な住宅街、緑豊かな環境。ファミリー向けの広々とした間取りです。',
                imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
                rent: 180000,
                layout: '2LDK',
                size: 65.0,
            },
        }),
        prisma.property.create({
            data: {
                name: 'オーシャンビュー 1202号室',
                address: '神奈川県横浜市中区海岸通り4-5-6',
                description: '海が見える高層マンション。眺望抜群、充実した共用施設。',
                imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                rent: 250000,
                layout: '3LDK',
                size: 85.0,
            },
        }),
    ]);

    console.log(`Created ${properties.length} properties`);

    // Create viewing slots for the first property (for demonstration)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slots = [];
    for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + day);

        for (let hour = 10; hour < 18; hour++) {
            const startTime = new Date(date);
            startTime.setHours(hour, 0, 0, 0);

            const endTime = new Date(date);
            endTime.setHours(hour + 1, 0, 0, 0);

            slots.push({
                propertyId: properties[0].id,
                startTime,
                endTime,
                capacity: 1,
                reservedCount: 0,
            });
        }
    }

    await prisma.viewingSlot.createMany({
        data: slots,
    });

    console.log(`Created ${slots.length} viewing slots for the first property`);

    console.log('Seed completed successfully');
}

main()
    .catch((e) => {
        console.error('Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
