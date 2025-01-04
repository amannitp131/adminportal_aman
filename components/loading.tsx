import Skeleton from '@material-ui/lab/Skeleton'

export default function LoadAnimation() {
    var rows = []
    for (let i = 0; i < 5; i++) {
        rows.push(
            <>
                <Skeleton
                    style={{ marginTop: `3vh` }}
                    variant="rect"
                    animation="wave"
                    height={80}
                />
                <Skeleton animation="wave" />
            </>
        )
    }
    return <>{rows}</>
}
