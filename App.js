import React, { useEffect, useState } from 'react';
import Post from './components/Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...

        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    });

    return () => {
      // do the cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setModalOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className='app'>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className={classes.paper} style={modalStyle}>
          <form className='app__signup'>
            <center>
              <img
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png'
                alt=''
              />
            </center>
            <Input
              className='app__input'
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div className={classes.paper} style={modalStyle}>
          <form className='app__signup'>
            <center>
              <img
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png'
                alt=''
              />
            </center>

            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <div className='app__header'>
        <img
          className='app__header-image'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png'
          alt='logo'
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className='app__login-container'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setModalOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className='app__posts'>
        {posts.map(({ id, post }) => {
          return (
            <Post
              post={post}
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          );
        })}
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
