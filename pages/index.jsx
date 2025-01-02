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
    console.log("session in index",session)

    useEffect(() => {
        setLoading(status === 'loading');
    }, [status]);

    if (loading) {
        return <Loading />;
    }

    if (!session) {
        return <Sign />;
    }

    if (!result || !result.profile) {
        return <div>Error: Unable to load faculty data</div>;
    }

    return (
        <Layout session={session} >
            <Profilepage details={{ result, session }} />
        </Layout>
    );
}

export async function getServerSideProps(context) {
    try {
        const session = await getSession(context);

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