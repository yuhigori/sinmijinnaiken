import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

async function getProperties() {
    try {
        const properties = await prisma.property.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return properties;
    } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
    }
}

export default async function PropertiesPage() {
    const properties = await getProperties();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-dark-600">物件一覧</h1>
                <p className="mt-2 text-lg text-dark-500">
                    ご希望の物件を選択して、内見予約を行ってください
                </p>
            </div>

            {properties.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-dark-500">物件が見つかりませんでした</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property: any) => (
                        <Card key={property.id} className="overflow-hidden transition-shadow hover:shadow-md">
                            <div className="relative h-48 w-full bg-warm-100">
                                <Image
                                    src={property.imageUrl}
                                    alt={property.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl">{property.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {property.address}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1 text-dark-500">
                                        <Home className="h-4 w-4" />
                                        {property.layout} / {property.size}㎡
                                    </div>
                                    <div className="text-xl font-bold text-terracotta-500">
                                        {formatCurrency(property.rent)}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/properties/${property.id}`} className="w-full">
                                    <Button className="w-full group">
                                        詳細を見る
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
