import React, { useEffect, useState } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';
import firebase from 'firebase';

function Post({ postId, user, username, caption, imageUrl, alt }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();

    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  };

  const removePost = (e) => {
    e.preventDefault();

    db.collection('posts').doc(postId).delete();
  };

  const deleteComments = (e) => {
    e.preventDefault();
  };

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          alt={alt}
          src='/static/images/avatar/1.jpg'
        />

        <h3>{username}</h3>
      </div>

      <img className='post__image' src={imageUrl} alt='abc' />

      <h4 className='post__text'>
        <strong>{username}</strong> {caption}
      </h4>

      <div className='post__comments'>
        {comments.map((comment, index) => (
          <p key={index}>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className='post__comments-box'>
          <input
            className='post__input'
            type='text'
            placeholder='Add a comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className='post__button'
            disabled={!comment}
            type='submit'
            onClick={postComment}
          >
            Post
          </button>
          <button onClick={removePost}>remove</button>
          <button onClick={deleteComments}>delete</button>
        </form>
      )}
    </div>
  );
}

export default Post;
