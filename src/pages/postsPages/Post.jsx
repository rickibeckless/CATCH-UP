import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import DOMPurify from "dompurify";
import { supabase } from '../../App';
import { TextEditor } from '../../components/TextEditor';
import { MiniTextEditor } from '../../components/MiniTextEditor';

export function Post() {

    const { id } = useParams();
    const user_id = localStorage.getItem('userId');
    const [currentUser, setCurrentUser] = useState({});
    const [post, setPost] = useState([]);
    const [user, setUser] = useState({});
    const [post_comments, setPostComments] = useState([]);
    const [comment_content, setCommentContent] = useState('');
    const [voteOnOwn, setVoteOnOwn] = useState(false);
    const [allReadyVoted, setAlreadyVoted] = useState(false);

    const navigate = useNavigate();

    const fetchCurrentUser = async () => {
        try {
            const { data: currentUserData, error: currentUserError } = await supabase
                .from('Users')
                .select('*')
                .eq('id', user_id)
                .single();
            if (currentUserError) {
                throw currentUserError;
            }
            setCurrentUser(currentUserData.username);
        } catch (error) {
            console.error("Error fetching current user:", error.message);
        }
    }

    const fetchUser = async () => {
        try {
            const { data: userData, error: userError } = await supabase
                .from('Users')
                .select('*')
                .eq('id', post.user_id)
                .single();
            if (userError) {
                throw userError;
            }
            setUser(userData);
        } catch (error) {
            console.error("Error fetching user:", error.message);
        }  
    };

    const fetchPost = async () => {
        try {
            const { data: postData, error: postError } = await supabase
                .from('Posts')
                .select('*')
                .eq('id', id)
                .single();
            if (postError) {
                throw postError;
            }
            setPost(postData);
        } catch (error) {
            console.error("Error fetching posts:", error.message);
        }
    };

    const fetchPostComments = async () => {
        try {
            const { data: postCommentData, error: postCommentError } = await supabase
                .from('Comments')
                .select('*')
                .eq('posts_id', id);
            if (postCommentError) {
                throw postCommentError;
            }
            setPostComments(postCommentData);
        } catch (error) {
            console.error("Error fetching comments:", error.message);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [post.user_id]);

    fetchPostComments();

    useEffect(() => {
        fetchCurrentUser();
        fetchPost();
    }, [localStorage.getItem('userId')]);

    const handleUpvote = async (id) => {
        try {
            const { data: postData, error: postError } = await supabase
                .from('Posts')
                .select('*')
                .eq('id', id)
                .single();
            if (postError) {
                throw postError;
            }

            if (postData.user_id === user_id) {
                setVoteOnOwn(true);
            } else if (postData?.upvotes_users?.includes(user_id)) {
                setAlreadyVoted(true);
            } else {
                const updatedUserUpvotes = (user.upvotes_count || 0) + 1;

                const { data: updateUserData, error: updateUserError } = await supabase
                    .from('Users')
                    .update({ upvotes_count: updatedUserUpvotes})
                    .eq('username', post.user_username);
                if (updateUserError) {
                    throw updateUserError;
                }

                const updatedUpvotes = postData.upvotes + 1;

                const { data: updateData, error: updateError } = await supabase
                    .from('Posts')
                    .update({ upvotes: updatedUpvotes, upvotes_users: [...[user_id]]})
                    .eq('id', id);
                if (updateError) {
                    throw updateError;
                }

                setPost(prevState => ({ ...prevState, upvotes: updatedUpvotes }));
            }
        } catch (error) {
            console.error("Error upvoting post:", error.message);
        }
    };

    useEffect(() => {
        if (allReadyVoted || voteOnOwn) {
            const timer = setTimeout(() => {
                if (allReadyVoted) setAlreadyVoted(false);
                if (voteOnOwn) setVoteOnOwn(false);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [allReadyVoted, voteOnOwn]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const { data: postData, error: postError } = await supabase
                .from('Posts')
                .select('*')
                .eq('id', id)
                .single();
            if (postError) {
                throw postError;
            }

            const updatedComments = postData.comments + 1;

            const { data: commentCountData, error: commentCountError } = await supabase
                .from('Posts')
                .update({ comments: updatedComments })
                .eq('id', id);
            if (commentCountError) {
                throw commentCountError;
            }

            const updatedUserComments = (user.comments_count || 0) + 1;

            const { data: updateUserData, error: updateUserError } = await supabase
                .from('Users')
                .update({ comments_count: updatedUserComments})
                .eq('username', post.user_username);
            if (updateUserError) {
                throw updateUserError;
            }

            const { data: commentData, error: commentError } = await supabase
                .from('Comments')
                .insert([
                    { 
                        posts_id: id,
                        comment_content,
                        comment_username: currentUser,
                        user_id: user_id
                    }
                ]);
                setCommentContent();
            if (commentError) {
                throw commentError;
            }

            fetchPostComments();
        } catch (error) {
            console.error("Error adding comment:", error.message);
        }
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric',  });
    };

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const sanitizedPost = DOMPurify.sanitize(post.content, { USE_PROFILES: { html: true } });
    const sanitizedAboutMe = DOMPurify.sanitize(user.about_me, { USE_PROFILES: { html: true } });

    return (
        <>
            <main id="post-page-holder">
                <section id="post-full">
                    <h1>{post.title}</h1>
                    <p id="post-page-stats">
                        Posted 
                        on <span>{formatDate(post.created_at)} </span> 
                        at <span>{formatTime(post.created_at)}</span> 
                    </p>
                    <div className="sanitizedText" id="post-text">{parse(sanitizedPost)}</div>
                    <p>Upvotes: {post.upvotes}</p>
                    {user_id ? (
                        <React.Fragment>
                            <button className="upvote-btn" onClick={() => handleUpvote(post.id)}>Upvote</button>
                            
                            {allReadyVoted && (
                                <p>You've Already Upvoted!</p>
                            )}

                            {voteOnOwn && (
                                <p>Can't Upvote Own Post!</p>
                            )}
                        </React.Fragment>
                    ) : (
                        <p><Link to="/signin">Sign in</Link> to upvote</p>
                    )}
                    <p>Comments: {post.comments}</p>
                </section>
                <section id="post-author-info">
                    <h2>{post.user_username}</h2>
                    <div className="sanitizedText" id="post-text">{parse(sanitizedAboutMe)}</div>
                </section>
            </main>
            <article id="post-comments">
                <h2>Have something to say? Add a comment!</h2>
                <section id="user-comments-holder">
                    {post_comments?.map(comment => (
                        <div key={comment.id} className="comment">
                            <h3>{comment.comment_username}</h3>
                            <div>{parse(DOMPurify.sanitize(comment.comment_content)).length > 400 ? `${parse(DOMPurify.sanitize(comment.comment_content)).slice(0,400)}...` : parse(DOMPurify.sanitize(comment.comment_content))}</div>
                            <p>Posted on {formatDate(comment.created_at)} at {formatTime(comment.created_at)}</p>
                        </div>
                    ))}
                </section>
                
                {user_id ? (
                    <section id="add-comment">
                        <form id="add-comment-form">
                            <MiniTextEditor value={comment_content} onChange={(newComment) => setCommentContent(newComment)} />
                            <button id="add-comment-btn" onClick={handleAddComment}>Add Comment</button>
                        </form>
                    </section>
                ) : (
                    <section id="add-comment">
                        <p><Link to="/signin">Sign in</Link> to add a comment</p>
                    </section>
                )}
            </article>
        </>
    )
}