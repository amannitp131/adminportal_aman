import Layout from '@/components/layout';
import Profilepage from '@/components/profile';
import { useSession, getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Loading from '../components/loading';
import Sign from '../components/signin';

const Home = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default function Page({ result, initialSession }) {
    const { data: clientSession, status } = useSession();
    const [loading, setLoading] = useState(true);
    const session = clientSession || initialSession;
    
    //console.log('Initial Session here :', initialSession);
    //console.log('Intial Result here :', result);
    // useEffect(() => {
    //     console.log('Session on client side:', session);
    //     console.log('Status of useSession:', status);
    //     setLoading(status === 'loading');
    // }, [session, status]);

    // if (loading) {
    //     return <Loading />;
    // }

    if (!session) {
        console.log('No session found, redirecting to Sign In.');
        return <Sign />;
    }

    if (!result || !result.profile) {
        console.error('No faculty data found.');
        return <div>Error: Unable to load faculty data</div>;
    }

    //console.log('Faculty Data:', result);

    return (
        <Layout>
        <Profilepage details={{ result, session }} />
    </Layout>
    );
}

export async function getServerSideProps(context) {
    try {
        const session = await getSession(context);
        //console.log('Session in getServerSideProps:', session);

        if (!session) {
            return {
                redirect: {
                    destination: '/signin',
                    permanent: false,
                },
            };
        }

        const apiUrl = process.env.URL || 'http://localhost:81';
        const res = await fetch(`${apiUrl}/api/faculty/${session.user.email}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(`Error fetching faculty data: ${res.status}`);
        }

        return {
            props: { result: data || null, initialSession: session },
        };
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        return {
            props: { result: null, initialSession: null },
        };
    }
}
