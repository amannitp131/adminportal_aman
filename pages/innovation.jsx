import Layout from '@/components/layout'
import styled from 'styled-components'
import DataDisplay from '@/components/display-innovation'
import { useEntries } from '@/lib/swr-hook'
import LoadAnimation from '@/components/loading'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Loading from '../components/loading'
import Sign from '../components/signin'
import Unauthorise from '../components/unauthorise'
import { useEffect, useState } from 'react'

const Wrap = styled.div`
    width: 90%;
    margin: auto;
    margin-top: 60px;
`

export default function Page() {
    // const { entries, isLoading } = useEntries('/api/innovation/all');
    const [isLoading, setIsLoading] = useState(true)
    const [entries, setEntries] = useState({})
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const router = useRouter()
    useEffect(() => {
        fetch('/api/innovation/between', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                session: session,
                from: 0,
                to: 15,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setEntries(data)
                setIsLoading(false)
            })
            .catch((err) => console.log(err))
    }, [])
    

    if (typeof window !== 'undefined' && loading) return <Loading />

    if (session) {
        
        return (
            <>
                {session.user.role == 1 ? (
                    <Layout>
                        <Wrap>
                            {isLoading ? (
                                <LoadAnimation />
                            ) : (
                                <DataDisplay data={entries} />
                            )}
                        </Wrap>
                    </Layout>
                ) : (
                    <Unauthorise />
                )}
            </>
        )
    }

    return <Sign />
}
