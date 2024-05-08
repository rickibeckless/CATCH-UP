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

    const sanitizedPost = DOMPurify.sanitize(post.content, { 
        USE_PROFILES: { html: true }, 
        ALLOWED_TAGS: ['a', 'img', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong', 'em', 'u', 's', 'del', 'ins', 'mark', 'abbr', 'sub', 'sup', 'span', 'div', 'iframe'],
    });
    const sanitizedAboutMe = DOMPurify.sanitize(user.about_me, { 
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: ['a', 'img', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong', 'em', 'u', 's', 'del', 'ins', 'mark', 'abbr', 'sub', 'sup', 'span', 'div', 'iframe'] 
    });

    //console.log("user first name ", user.first_name);
    //console.log("user last name ", user.last_name);

    const smoothScroll = (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 25,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <nav id="post-page-navbar">
                <Link to="/posts" className="post-navbar-links">Back to Posts</Link>
                <a href="#post-comments" className="post-navbar-links" onClick={smoothScroll}>Go To Comments</a>
            </nav>        
            <main id="post-page-holder">
                <header id="post-page-header">
                    <h1>{post.title}</h1>
                    <div id="post-page-stats">
                        {user.first_name ? (
                            <p><Link className="post-page-links" to={`/user/${post.user_username}`}>{user.first_name} {user.last_name}</Link></p>
                        ) : null }
                        <p>-</p>
                        <p>{formatDate(post.created_at)}</p>
                        {/* <p>
                            Posted 
                            on <span>{formatDate(post.created_at)} </span> 
                            at <span>{formatTime(post.created_at)}</span> 
                        </p> */}
                    </div> 
                </header>
                <section id="post-full">
                    <div className="sanitizedText" id="post-text">{parse(sanitizedPost)}</div>

                    <div className="post-page-upvotes-statement">
                        <h4>Like this CATCH-UP? Upvote it!</h4>
                        <p>Upvotes: {post.upvotes}</p>
                    </div>
                    <div className="post-page-upvote">
                        {user_id ? (
                            <React.Fragment>
                                <button className="upvote-btn" onClick={() => handleUpvote(post.id)}>upvote!</button>
                                
                                {allReadyVoted && (
                                    <p>You Already Upvoted!</p>
                                )}

                                {voteOnOwn && (
                                    <p>You Can't Upvote Your Own Post!</p>
                                )}
                            </React.Fragment>
                        ) : (
                            <p><Link to="/signin">Sign in</Link> to upvote</p>
                        )}                        
                    </div>
                </section>
                <aside id="post-author-info">
                    <div className="sanitizedText" id="author-text">
                        <h2>
                            <Link className="post-page-author-link post-page-links" to={`/user/${post.user_username}`}>{post.user_username}</Link>
                        </h2>
                        <h4>{user.email}</h4>
                        <h3>{user.user_title}</h3>
                        {parse(sanitizedAboutMe)}
                        <div className="post-author-info-stats-holder">
                            <p>Member since: {formatDate(user.created_at)}</p>
                            <h4>{post.user_username} has: </h4>
                            <p className="post-author-info-stats">
                                <span className="post-author-info-stats-nums">{user.posts_count} </span> 
                                total posts
                            </p>
                            <p className="post-author-info-stats">
                                <span className="post-author-info-stats-nums">{user.upvotes_count} </span>
                                total post upvotes
                            </p>
                            <p className="post-author-info-stats">
                                <span className="post-author-info-stats-nums">{user.comments_count} </span> 
                                total post comments
                            </p>
                        </div>
                    </div>
                </aside>
            </main>
            <article id="post-comments">
                <div id="post-comments-header">
                    <h2>Have something to say? Add a comment!</h2>
                    <p>Total: {post.comments}</p>
                </div>
            
                <div id="post-page-comments-holder">
                    <section id="user-comments-holder">
                        {post_comments?.map(comment => (
                            <div key={comment.id} className="comment">
                                <div className="comment-header">
                                    <Link className="comment-username" to={`/user/${comment.comment_username}`}>
                                        <h3>{comment.comment_username}</h3>
                                    </Link>
                                    <p className="comment-posted-stats">
                                        {formatDate(comment.created_at)} 
                                        <span>|</span>
                                        {formatTime(comment.created_at)}
                                    </p>
                                </div>
                                <div className="comment-content">{parse(DOMPurify.sanitize(comment.comment_content)).length > 400 ? `${parse(DOMPurify.sanitize(comment.comment_content)).slice(0,400)}...` : parse(DOMPurify.sanitize(comment.comment_content))}</div>
                            </div>
                        ))}
                    </section>
                    
                    {user_id ? (
                        <section id="add-comment">
                            <form id="add-comment-form">
                                <MiniTextEditor value={comment_content} onChange={(newComment) => setCommentContent(newComment)} />
                                <button id="add-comment-btn" onClick={handleAddComment}>add!</button>
                            </form>
                        </section>
                    ) : (
                        <section id="add-comment">
                            <p><Link to="/signin">Sign in</Link> to add a comment</p>
                        </section>
                    )}                    
                </div>
            </article>
        </>
    )
}