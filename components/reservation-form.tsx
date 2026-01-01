"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Loader2 } from "lucide-react";

const reservationSchema = z.object({
    slotId: z.number(),
    name: z.string().min(1, "名前を入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    phone: z.string().min(10, "有効な電話番号を入力してください"),
    staffReq: z.boolean(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface TimeSlot {
    id: number;
    startTime: string;
    endTime: string;
    capacity: number;
    reservedCount: number;
    _count: {
        reservations: number;
    };
}

export function ReservationForm({ propertyId }: { propertyId: number }) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState("");
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            staffReq: false,
        },
    });

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Fetch time slots when date is selected
    useEffect(() => {
        if (!selectedDate) {
            setTimeSlots([]);
            return;
        }

        setLoadingSlots(true);
        fetch(`/api/properties/${propertyId}/slots?date=${selectedDate}`)
            .then((res) => res.json())
            .then((data) => {
                setTimeSlots(data);
                setLoadingSlots(false);
            })
            .catch((err) => {
                console.error("Error fetching slots:", err);
                setError("時間スロットの取得に失敗しました");
                setLoadingSlots(false);
            });
    }, [selectedDate, propertyId]);

    const onSubmit = async (data: ReservationFormData) => {
        if (!selectedSlot) {
            setError("時間スロットを選択してください");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    slotId: selectedSlot,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "予約に失敗しました");
            }

            // Redirect to confirmation page with token
            router.push(`/reservations/${result.token}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "予約に失敗しました");
            setLoading(false);
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isSlotAvailable = (slot: TimeSlot) => {
        return slot.reservedCount < slot.capacity;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    内見予約
                </CardTitle>
                <CardDescription>
                    ご希望の日時を選択して、予約フォームに必要事項を入力してください
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Date Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="date">日付を選択</Label>
                        <Input
                            id="date"
                            type="date"
                            min={today}
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedSlot(null);
                            }}
                            className="w-full"
                        />
                    </div>

                    {/* Time Slot Selection */}
                    {selectedDate && (
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                時間を選択
                            </Label>
                            {loadingSlots ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-terracotta-500" />
                                </div>
                            ) : (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {timeSlots.map((slot) => {
                                        const available = isSlotAvailable(slot);
                                        return (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => {
                                                    if (available) {
                                                        setSelectedSlot(slot.id);
                                                        setValue("slotId", slot.id);
                                                    }
                                                }}
                                                disabled={!available}
                                                className={`rounded-lg border p-3 text-left transition-colors ${selectedSlot === slot.id
                                                        ? "border-terracotta-500 bg-terracotta-50"
                                                        : available
                                                            ? "border-warm-200 hover:border-terracotta-300"
                                                            : "cursor-not-allowed border-warm-200 bg-warm-50 opacity-50"
                                                    }`}
                                            >
                                                <div className="font-medium">
                                                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                </div>
                                                <div className="text-sm text-dark-500">
                                                    {available ? "予約可能" : "満席"}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* User Information */}
                    {selectedSlot && (
                        <div className="space-y-4 border-t pt-6">
                            <h3 className="font-semibold text-dark-600">お客様情報</h3>

                            <div className="space-y-2">
                                <Label htmlFor="name">お名前 *</Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="山田 太郎"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="example@email.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">電話番号 *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    {...register("phone")}
                                    placeholder="090-1234-5678"
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="staffReq"
                                    {...register("staffReq")}
                                    className="h-4 w-4 rounded border-warm-300 text-terracotta-500 focus:ring-terracotta-500"
                                />
                                <Label htmlFor="staffReq" className="cursor-pointer font-normal">
                                    スタッフの立会いを希望する
                                </Label>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    {selectedSlot && (
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    予約中...
                                </>
                            ) : (
                                "予約する"
                            )}
                        </Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
