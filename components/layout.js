import { SessionProvider } from 'next-auth/react';
import Header from './header';
import Footer from './footer';

export default function Layout({ children, session }) {
    return (
        <SessionProvider session={session}>
            <Header session={session}/>
            <main>{children}</main>
            <Footer />
        </SessionProvider>
    );
}
