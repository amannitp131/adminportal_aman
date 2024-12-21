import Layout from '@/components/layout'
import Profilepage from '@/components/profile'
import { ProcessCredentials } from 'aws-sdk'
import { useSession, getSession } from 'next-auth/client'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Loading from '../components/loading'
import Sign from '../components/signin'

const Home = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    .image {
        z-index: -1;
        position: absolute;
    }
    .card {
        display: flex;
        justify-content: center;
        text-align: center;
    }
    .title {
        font-size: 24px;
    }
`

export default function Page({ result }) {
    const [session, loading] = useSession()

    if (typeof window !== 'undefined' && loading) return <Loading />

    if (!session) {
        return <Sign />
    }
    return (
        <Layout>
            <Profilepage details={result} />
        </Layout>
    )
}

export async function getServerSideProps({ req, res }) {
    const session = await getSession({ req })

    if (session) {
        let result = null
        let res = await fetch(
            `${process.env.URL}/api/faculty/${session.user.email}`,
            {
                method: 'GET',
                Accept: 'application/json',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).catch((e) => {
            console.log(e)
        })
        const data = await res.json()
        result = data
        return {
            props: { result }, // will be passed to the page component as props
        }
    } else {
        return {
            props: {}, // will be passed to the page component as props
        }
    }
}
