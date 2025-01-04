import Link from 'next/link'
import styles from './footer.module.css'
import { dependencies } from '../package.json'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            &copy; National Institute of Technology Patna{' '}
            {new Date().getFullYear()}
        </footer>
    )
}
