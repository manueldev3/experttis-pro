'use client';
import Routes from '@/models/routes';
import { usePathname } from 'next/navigation';

/* Components */
import Header from '@/components/Header';
import Footer from "@/components/Footer";
import FloatChat from '@/components/chat/float/FloatChat';
import useAuth from '@/hook/auth_hook';

export default function DefaultContainer({
    children,
}: {
    children: React.ReactNode
}) {
    const { currentUser } = useAuth();
    const pathname = usePathname();
    const routeValidation = pathname != Routes.consultants.dashboard &&
        pathname != Routes.consultants.profile &&
        pathname != Routes.consultants.schedule &&
        pathname != Routes.consultants.chat &&
        pathname != Routes.clients.dashboard &&
        pathname != Routes.clients.myQuestions &&
        pathname != Routes.clients.profile &&
        pathname != Routes.clients.chat &&
        pathname != Routes.clients.consultancies &&
        !pathname.startsWith("/browse-experts")

    return (
        <>
            {
                routeValidation &&
                <Header />
            }
            <main
                className={`${pathname != Routes.consultants.dashboard ? 'max-w-[1440px]' : 'w-100'} min-h-screen m-auto`}
            >
                {children}
                {
                    currentUser &&
                    <FloatChat />
                }
            </main >
            {
                routeValidation &&
                <Footer />
            }
        </>
    )
};