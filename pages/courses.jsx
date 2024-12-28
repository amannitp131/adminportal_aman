import Layout from '../components/layout';
import styled from 'styled-components';
import DataDisplay from '../components/display-files';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Loading from '../components/loading';
import Sign from '../components/signin';
import Unauthorise from '../components/unauthorise';

const Wrap = styled.div`
    width: 90%;
    margin: auto;
    margin-top: 60px;
`;

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    useEffect(() => {
        if (session?.user?.email) {
            setIsLoading(true);
            fetch(`/api/course/all?type=byEmail&email=${encodeURIComponent(session.user.email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Error: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => setCourses(data))
                .catch((err) => console.error('Error fetching courses:', err))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [session]);

    if (loading || isLoading) {
        return <Loading />;
    }

    if (session && [1, 2, 3].includes(session.user?.role)) {
        return (
            <Layout>
                <Wrap>
                    <DataDisplay entries={courses} />
                </Wrap>
            </Layout>
        );
    }

    if (session) {
        return <Unauthorise />;
    }

    return <Sign />;
}
