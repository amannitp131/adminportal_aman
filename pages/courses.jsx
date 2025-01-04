import Layout from '../components/layout';
import styled from 'styled-components';
import DataDisplay from '../components/display-files';
import { useSession } from 'next-auth/react';  // Correct import for useSession
import { useEffect, useState } from 'react';
import Loading from '../components/loading';
import Sign from '../components/signin';
import Unauthorise from '../components/unauthorise';

const Wrap = styled.div`
    width: 90%;
    margin: auto;
    margin-top: 60px;
`;

const CoursesDataDisplay = () => {
    // Correct usage of useSession
    const { data: session, status } = useSession();
    
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.email) {
            const emailParam = encodeURIComponent(session.user.email);
            const timestamp = new Date().getTime(); // Get current timestamp
            const apiUrl = `/api/course/byEmail?type=byEmail&email=${encodeURIComponent(session.user.email)}&timestamp=${timestamp}`;

            // Log the API URL for debugging purposes
            console.log("Requesting API URL:", apiUrl);

            setIsLoading(true);
            fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache', 
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        console.error("Error details:", res.status, res.statusText);  // Log error details
                        return res.text().then((text) => {
                            throw new Error(`Error: ${res.status}, ${text}`);
                        });
                    }
                    return res.json();
                })
                .then((data) => setCourses(data))
                .catch((err) => console.error('Error fetching courses:', err))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [session]);  // Dependency array ensures effect is re-run when session changes

    // Conditional rendering for loading state
    if (status === 'loading' || isLoading) {
        return <Loading />;
    }

    // Conditional rendering for unauthorised users or missing session
    if (!session) {
        return <Sign />;
    }

    // Ensure the user has the correct role
    if (![1, 2, 3].includes(session.user?.role)) {
        return <Unauthorise />;
    }

    // Once data is loaded, display it
    return (
        <Layout>
            <Wrap>
                <DataDisplay entries={courses} />  {/* Pass fetched courses to your data display component */}
            </Wrap>
        </Layout>
    );
};

export default CoursesDataDisplay;
