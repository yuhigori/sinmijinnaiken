import Link from "next/link";
import { Home, Building2, Calendar, Shield } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-dark-500/10 bg-warm-50/95 backdrop-blur supports-[backdrop-filter]:bg-warm-50/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <Building2 className="h-6 w-6 text-terracotta-500" />
                    <span className="text-xl font-bold text-dark-600">無人内見予約</span>
                </Link>

                <nav className="flex items-center space-x-6">
                    <Link
                        href="/"
                        className="flex items-center space-x-1 text-sm font-medium text-dark-600 transition-colors hover:text-terracotta-500"
                    >
                        <Home className="h-4 w-4" />
                        <span className="hidden sm:inline">トップ</span>
                    </Link>
                    <Link
                        href="/properties"
                        className="flex items-center space-x-1 text-sm font-medium text-dark-600 transition-colors hover:text-terracotta-500"
                    >
                        <Building2 className="h-4 w-4" />
                        <span className="hidden sm:inline">物件一覧</span>
                    </Link>
                    <Link
                        href="/reservations/check"
                        className="flex items-center space-x-1 text-sm font-medium text-dark-600 transition-colors hover:text-terracotta-500"
                    >
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">予約確認</span>
                    </Link>
                    <Link
                        href="/admin"
                        className="flex items-center space-x-1 text-sm font-medium text-dark-600 transition-colors hover:text-terracotta-500"
                    >
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">管理</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
