import { signIn, signout, useSession } from 'next-auth/client'
import Link from 'next/link'
import styles from './header.module.css'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { Button } from '@material-ui/core'
import clsx from 'clsx'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import CallToActionIcon from '@material-ui/icons/CallToAction'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        fontSize: '17px',
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
}))

export default function ButtonAppBar() {
    const classes = useStyles()
    const [session, loading] = useSession()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const handleChange = (event) => {
        setAuth(event.target.checked)
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    })

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }

        setState({ ...state, [anchor]: open })
    }

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {session && (
                    <ListItem button key={session.user.name}>
                        <ListItemIcon>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemText primary={session.user.name} />
                    </ListItem>
                )}
            </List>
            <Divider />
            <List>
                {session && (session.user.role === 0 ? signout() : null)}

                {session && (
                    <ListItem button key={'Profile'}>
                        <ListItemIcon></ListItemIcon>
                        <Link href={`/`}>
                            <ListItemText primary={'Profile'} />
                            
                        </Link>
                    </ListItem>
                )}
                {session && (
                    <ListItem button key={'Profile'}>
                        <ListItemIcon></ListItemIcon>
                        <Link href={`/courses`}>
                            <ListItemText primary={'Course Data'} />
                            
                        </Link>
                    </ListItem>
                )}
                {session &&
                    (session.user.role === 1
                        ? ['Events', 'Notice', 'News', 'Innovation'].map(
                              (text, index) => (
                                  <ListItem button key={text}>
                                      <ListItemIcon></ListItemIcon>
                                      <Link href={`/${text.toLowerCase()}`}>
                                          <ListItemText primary={text} />
                                      </Link>
                                  </ListItem>
                              )
                          )
                        : null)}
                
                {session &&
                    (session.user.role === 2 || session.user.role === 4) && (
                        <ListItem button key="Notice">
                            <ListItemIcon></ListItemIcon>
                            <Link href={`/notice`}>
                                <ListItemText primary="Notice" />
                            </Link>
                        </ListItem>
                    )}

                {session &&
                    (session.user.role === 1 ? (
                        <ListItem button key="Faculty-Management">
                            <ListItemIcon></ListItemIcon>
                            <Link href="faculty-management">
                                <ListItemText primary="Faculty Management" />
                            </Link>
                        </ListItem>
                    ) : null)}
                <ListItem>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <Button
                        onClick={(e) => {
                            e.preventDefault()
                            signout()
                        }}
                    >
                        Sign Out
                    </Button>
                </ListItem>
            </List>
        </div>
    )

    return (
        <div className={classes.root}>
            <AppBar color="default" position="static">
                <SwipeableDrawer
                    anchor={'left'}
                    open={state['left']}
                    onClose={toggleDrawer('left', false)}
                    onOpen={toggleDrawer('left', true)}
                >
                    {list('left')}
                </SwipeableDrawer>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer('left', true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        National Institute of Technology Patna
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}
