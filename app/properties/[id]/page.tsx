import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Home, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ReservationForm } from "@/components/reservation-form";
import { prisma } from "@/lib/prisma";

async function getProperty(id: string) {
    try {
        const property = await prisma.property.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        return property;
    } catch (error) {
        console.error('Error fetching property:', error);
        return null;
    }
}

export default async function PropertyDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const property = await getProperty(id);

    if (!property) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Property Information */}
                <div>
                    <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-warm-100">
                        <Image
                            src={property.imageUrl}
                            alt={property.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-3xl">{property.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-dark-500">
                                <MapPin className="h-5 w-5" />
                                <span>{property.address}</span>
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="flex items-center gap-2 text-dark-500">
                                    <Home className="h-5 w-5" />
                                    <span>{property.layout} / {property.size}㎡</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-terracotta-500" />
                                    <span className="text-2xl font-bold text-terracotta-500">
                                        {formatCurrency(property.rent)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="mb-2 font-semibold text-dark-600">物件の説明</h3>
                                <p className="text-dark-500">{property.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Reservation Form */}
                <div>
                    <ReservationForm propertyId={property.id} />
                </div>
            </div>
        </div>
    );
}
