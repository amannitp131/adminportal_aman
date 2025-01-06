"use client";
import Layout from '@/components/layout'
import styled from 'styled-components'
import { FacultyTable } from '@/components/faculty-table'
import { useEntries } from '@/lib/swr-hook'
import LoadAnimation from '@/components/loading'
import { useSession} from 'next-auth/react'
import { useRouter } from 'next/router'
import Loading from '../components/loading'
import Sign from '../components/signin'
import Unauthorise from '../components/unauthorise'
import { useState } from 'react'

const Wrap = styled.div`
    width: 90%;
    margin: auto;
    margin-top: 60px;
`

export default function Page() {
    const { entries, isLoading } = useEntries('/api/faculty/all')
    const { data: session} = useSession()
    console.log("session in faculty-management",session)
    const[loading, setLoading] = useState(true)
    const router = useRouter()
    if (typeof window !== 'undefined' && loading) return <Loading />

    if (session) {
        return (
            <>
                {session.user.role === 1 ? (
                    <Layout>
                        <Wrap>
                            {isLoading ? (
                                <LoadAnimation />
                            ) : (
                                <FacultyTable rows={entries} />
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
