import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shield, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-terracotta-400/20 to-warm-50 py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-dark-600 sm:text-6xl">
              無人内見予約システム
            </h1>
            <p className="mt-6 text-lg leading-8 text-dark-500">
              24時間いつでも、スマートに物件を内見。
              <br />
              オンラインで簡単予約、トークンで安全にアクセス。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/properties">
                <Button size="lg" className="group">
                  物件を見る
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/reservations/check">
                <Button variant="outline" size="lg">
                  予約を確認
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-dark-600 sm:text-4xl">
              3つの特徴
            </h2>
            <p className="mt-4 text-lg text-dark-500">
              無人内見予約システムで、快適な物件探しを
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-lg border border-dark-500/10 bg-warm-50 p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-terracotta-500 text-warm-50">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-dark-600">
                24時間予約可能
              </h3>
              <p className="mt-2 text-sm text-dark-500">
                営業時間を気にせず、いつでもオンラインで予約ができます。
              </p>
            </div>

            <div className="rounded-lg border border-dark-500/10 bg-warm-50 p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-terracotta-500 text-warm-50">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-dark-600">
                安全なアクセス
              </h3>
              <p className="mt-2 text-sm text-dark-500">
                予約時に発行されるトークンで、セキュアに物件へアクセスできます。
              </p>
            </div>

            <div className="rounded-lg border border-dark-500/10 bg-warm-50 p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-terracotta-500 text-warm-50">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-dark-600">
                簡単予約フロー
              </h3>
              <p className="mt-2 text-sm text-dark-500">
                カレンダーから日時を選んで、必要情報を入力するだけで完了。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
