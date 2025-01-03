import Header from './header'
import Footer from './footer'

export default function Layout({ children ,session}) {
    return (
        <>
            <Header session={session} />
            <main>{children}</main>
            <Footer />
        </>
    )
}
