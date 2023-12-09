'use client';

export default function Container({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="sm:ml-60 min-h-screen" >
            {children}
        </main>
    )
};