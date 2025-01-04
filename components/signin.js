import styled from 'styled-components';
import Image from 'next/image';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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
`;

const Sign = () => {
    const { data: session, status } = useSession(); // Use `useSession` for client-side session handling
    const router = useRouter();
    console.log("session in signin",session)

    useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    if (status === 'loading') {
        return (
            <Home>
                <CircularProgress />
            </Home>
        );
    }

    return (
        <Home>
            <Image
                className="image"
                src="/nitp.png"
                alt="Background Image"
                layout="fill"
                objectFit="cover"
                quality={100}
            />
            <Card className="card">
                <CardContent>
                    <Image
                        src="/logo512.png"
                        alt="Logo"
                        width={100}
                        height={100}
                    />
                    <Typography className="title" color="textPrimary">
                        Welcome to Admin Portal
                    </Typography>

                    <CardActions className="card">
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                           
                        >
                            Login with Google
                        </Button>
                    </CardActions>
                </CardContent>
            </Card>
        </Home>
    );
};

export default Sign;
