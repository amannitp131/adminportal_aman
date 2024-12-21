import styled from 'styled-components'
import Image from 'next/image'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { CircularProgress } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import { signIn } from 'next-auth/client'

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

const Sign = () => {
    return (
        <Home>
            <Image
                className="image"
                src="/nitp.png"
                layout="fill"
                objectFit="cover"
                quality={100}
            />
            <Card className="card">
                <CardContent>
                    <Image src="/logo512.png" width="100" height="100" />
                    <Typography className="title" color="textPrimary">
                        Welcome to Admin Portal
                    </Typography>

                    <CardActions className="card">
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={() => signIn('google')}
                        >
                            Login with Google
                        </Button>
                    </CardActions>
                </CardContent>
            </Card>
        </Home>
    )
}

export default Sign
