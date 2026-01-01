"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function ReservationCheckPage() {
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [reservation, setReservation] = useState<any>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`/api/reservations/${token}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "予約が見つかりませんでした");
                setReservation(null);
            } else {
                setReservation(data);
            }
        } catch (err) {
            setError("エラーが発生しました");
            setReservation(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-dark-600">予約確認</h1>
                    <p className="mt-2 text-lg text-dark-500">
                        予約時に発行されたトークンを入力してください
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>トークン入力</CardTitle>
                        <CardDescription>
                            予約完了メールに記載されているトークンを入力してください
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="token">トークン</Label>
                                <Input
                                    id="token"
                                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="rounded-md bg-terracotta-500/10 p-3 text-sm text-terracotta-600">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" disabled={loading} className="w-full">
                                <Search className="mr-2 h-4 w-4" />
                                {loading ? "検索中..." : "予約を確認"}
                            </Button>
                        </form>

                        {reservation && (
                            <div className="mt-6 space-y-4 border-t border-dark-500/10 pt-6">
                                <h3 className="text-lg font-semibold text-dark-600">予約詳細</h3>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="font-medium">物件名:</span>{" "}
                                        {reservation.slot.property.name}
                                    </p>
                                    <p>
                                        <span className="font-medium">住所:</span>{" "}
                                        {reservation.slot.property.address}
                                    </p>
                                    <p>
                                        <span className="font-medium">予約日時:</span>{" "}
                                        {new Date(reservation.slot.startTime).toLocaleString("ja-JP")}
                                    </p>
                                    <p>
                                        <span className="font-medium">お名前:</span>{" "}
                                        {reservation.name}
                                    </p>
                                    <p>
                                        <span className="font-medium">メール:</span>{" "}
                                        {reservation.email}
                                    </p>
                                    <p>
                                        <span className="font-medium">電話番号:</span>{" "}
                                        {reservation.phone}
                                    </p>
                                    <p>
                                        <span className="font-medium">スタッフ同行:</span>{" "}
                                        {reservation.staffReq ? "希望する" : "希望しない"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
