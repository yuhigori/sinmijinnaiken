export function Footer() {
    return (
        <footer className="w-full border-t border-dark-500/10 bg-warm-50 py-6 md:py-8">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-dark-500">
                    © {new Date().getFullYear()} 無人内見予約システム. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
