import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './header.module.css';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Button } from '@material-ui/core';
import clsx from 'clsx';

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
}));

export default function ButtonAppBar({ session }) {
  const classes = useStyles();
  const [state, setState] = React.useState({ left: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

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
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary={session.user.name} />
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        {session && (
          <ListItem button key={'Profile'}>
            <ListItemIcon></ListItemIcon>
            <Link href={`/`} className={styles.link}>
              <ListItemText primary={'Profile'} />
            </Link>
          </ListItem>
        )}
        {session && (
          <ListItem button key={'Courses'}>
            <ListItemIcon></ListItemIcon>
            <Link href={`/courses`} className={styles.link}>
              <ListItemText primary={'Course Data'} />
            </Link>
          </ListItem>
        )}
        {session &&
          (session.user.role === 1
            ? ['Events', 'Notice', 'News', 'Innovation'].map((text) => (
                <ListItem button key={text}>
                  <ListItemIcon></ListItemIcon>
                  <Link href={`/${text.toLowerCase()}`} className={styles.link}>
                    <ListItemText primary={text} />
                  </Link>
                </ListItem>
              ))
            : null)}
        {session &&
          (session.user.role === 2 || session.user.role === 4) && (
            <ListItem button key="Notice">
              <ListItemIcon></ListItemIcon>
              <Link href={`/notice`} className={styles.link}>
                <ListItemText primary="Notice" />
              </Link>
            </ListItem>
          )}
        {session &&
          (session.user.role === 1 ? (
            <ListItem button key="Faculty-Management">
              <ListItemIcon></ListItemIcon>
              <Link
                href="/faculty-management"
                className={styles.link}
              >
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
              e.preventDefault();
              signOut();
            }}
          >
            Sign Out
          </Button>
        </ListItem>
      </List>
    </div>
  );

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
  );
}
