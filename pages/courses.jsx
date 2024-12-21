import Layout from '../components/layout';
import styled from 'styled-components';
import DataDisplay from '../components/display-files'; // Ensure this component is created for displaying courses
import { useSession } from 'next-auth/client';
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
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [session, loading] = useSession();

    useEffect(() => {
        if (session) {
            fetch(`/api/course/all?type=byEmail&email=${encodeURIComponent(session.user.email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setCourses(data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false); // Ensure loading state is updated even on error
                });
        } else {
            setIsLoading(false); // If no session, stop loading
        }
    }, [session]);

    if (typeof window !== 'undefined' && loading) return <Loading />;

    if (session && (session.user.role === 1 || session.user.role === 2 ||session.user.role === 3)) {
        return (
            <Layout>
                <Wrap>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <DataDisplay entries={courses} />
                    )}
                </Wrap>
            </Layout>
        );
    }
    
    if (session) {
        return <Unauthorise />;
    }
    
    return <Sign />;
}
