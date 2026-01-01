import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Clock, MapPin, Home, User, Mail, Phone, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

async function getReservation(token: string) {
    try {
        const res = await fetch(`http://localhost:3000/api/reservations/${token}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Error fetching reservation:', error);
        return null;
    }
}

export default async function ReservationConfirmationPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const reservation = await getReservation(token);

    if (!reservation) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-2xl">
                {/* Success Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-dark-600">予約が完了しました</h1>
                    <p className="mt-2 text-dark-500">
                        予約確認メールを送信しました。当日お待ちしております。
                    </p>
                </div>

                {/* Reservation Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>予約詳細</CardTitle>
                        <CardDescription>予約番号: {reservation.token}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Property Information */}
                        <div className="space-y-3 border-b pb-6">
                            <h3 className="font-semibold text-dark-600">物件情報</h3>
                            <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <Home className="mt-0.5 h-5 w-5 text-terracotta-500" />
                                    <div>
                                        <div className="font-medium">{reservation.slot.property.name}</div>
                                        <div className="flex items-center gap-2 text-sm text-dark-500">
                                            <MapPin className="h-4 w-4" />
                                            {reservation.slot.property.address}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pl-8 text-sm">
                                    <span className="text-dark-500">
                                        {reservation.slot.property.layout} / {reservation.slot.property.size}㎡
                                    </span>
                                    <span className="font-semibold text-terracotta-500">
                                        {formatCurrency(reservation.slot.property.rent)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div className="space-y-3 border-b pb-6">
                            <h3 className="font-semibold text-dark-600">内見日時</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-terracotta-500" />
                                    <span>{formatDate(reservation.slot.startTime)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-terracotta-500" />
                                    <span>
                                        {formatTime(reservation.slot.startTime)} - {formatTime(reservation.slot.endTime)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-dark-600">お客様情報</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-terracotta-500" />
                                    <span>{reservation.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-terracotta-500" />
                                    <span>{reservation.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-terracotta-500" />
                                    <span>{reservation.phone}</span>
                                </div>
                                {reservation.staffReq && (
                                    <div className="flex items-center gap-3 rounded-lg bg-warm-50 p-3">
                                        <Users className="h-5 w-5 text-terracotta-500" />
                                        <span className="text-sm">スタッフ立会いあり</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="flex-1" variant="outline">
                        <Link href="/properties">他の物件を見る</Link>
                    </Button>
                    <Button asChild className="flex-1">
                        <Link href="/">トップページへ</Link>
                    </Button>
                </div>

                {/* Important Notice */}
                <Card className="mt-6 border-warm-300 bg-warm-50">
                    <CardContent className="pt-6">
                        <h3 className="mb-2 font-semibold text-dark-600">ご注意事項</h3>
                        <ul className="space-y-1 text-sm text-dark-500">
                            <li>• 予約時間の10分前にお越しください</li>
                            <li>• 本人確認書類をご持参ください</li>
                            <li>• キャンセルの場合は前日までにご連絡ください</li>
                            <li>• 予約番号は大切に保管してください</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
