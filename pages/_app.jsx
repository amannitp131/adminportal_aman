import { SessionProvider } from 'next-auth/react';
import './styles.css';

export default function App({ Component, pageProps }) {
    return (
        <SessionProvider>
            <Component {...pageProps} />
        </SessionProvider>
    );
}
