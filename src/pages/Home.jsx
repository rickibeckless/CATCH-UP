import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import DOMPurify from "dompurify";

export function Home() {

    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [upvotes, setUpvotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [wordCount, setWordCount] = useState([]);
    const [previewAtTop, setPreviewAtTop] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data: postData, error: postError } = await supabase
                    .from('Posts')
                    .select('*');
                if (postError) {
                    throw postError;
                }

                const slicedData = postData.slice(0, 5);
                const sortedData = slicedData.sort((a, b) => b.upvotes - a.upvotes);

                const totalComments = postData.reduce((acc, post) => acc + post.comments, 0);
                setComments(totalComments);

                const totalUpvotes = postData.reduce((acc, post) => acc + post.upvotes, 0);
                setUpvotes(totalUpvotes);

                const totalWords = postData.reduce((acc, post) => acc + post.content.split(' ').length, 0);
                setWordCount(totalWords);

                setPosts(sortedData);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };

        const fetchUsers = async () => {
            try {
                const { data: userData, error: userError } = await supabase
                    .from('Users')
                    .select('*');
                if (userError) {
                    throw userError;
                }

                setUsers(userData);
            } catch (error) {
                console.error("Error fetching users:", error.message);
            }
        };

        fetchPosts();
        fetchUsers();
    }, [supabase, id]);

    const setSortBy = (e) => {
        const value = e.target.value;
        localStorage.setItem('sort-by', value);
        setSortBy(value);
    };

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setPreviewAtTop(window.scrollY >= 50);
        });
    }), [window.scrollY];

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric',  });
    };

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const sanitizedTitle = posts?.title?.replace(/[^\w\s]/gi, '');
    const sanitizedPost = DOMPurify.sanitize(posts.content, { USE_PROFILES: { html: true } });

    return (
        <>
            <main id="blog-preview">
                <h3 id="blog-preview-header" className={previewAtTop ? " preview-header-top" : ""}>Top Posts From Our Users:</h3>
                <div className="blog-cards">
                    {posts?.map(post => (
                        <div key={post._id} className="home-preview-post">
                            <div className="preview-post-heading">
                                <Link className="home-preview-post-title" to={`/post/${post.id}`}>{post.title}</Link>
                                <Link className="home-preview-post-links" to={`/user/${post.user_username}`}>{post.user_username}</Link>
                            </div>
                            <div className="preview-post-stats">
                                <p>Upvotes: {post.upvotes}</p>
                                <p>Comments: {post.comments}</p>
                            </div>
                            <p className="preview-post-content">
                                {parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).length > 400 ? 
                                    <>
                                        {`${parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).slice(0,400)}...`} 
                                        <span className="preview-post-read-more">
                                            <Link className="home-preview-post-links" to={`/post/${post.id}`}>read more</Link>
                                        </span>
                                    </>
                                    : parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')
                                )}
                            </p>
                        </div>
                    ))}
                </div>
                <div id="blog-preview-stats-holder">
                    <h3 id="blog-preview-stats-header">Total Number of: </h3>
                    <div id="blog-preview-stats">
                        <Link to={`/post/all?sortBy=sort-uaz`}>
                            <div className="blog-preview-stats-totals">
                                <p>Users: </p>
                                <h4>{users.length}</h4>
                            </div>
                        </Link>

                        <Link to={`/post/all`}>
                            <div className="blog-preview-stats-totals">
                                <p>Posts: </p>
                                <h4>{posts.length}</h4>
                            </div>
                        </Link>

                        <Link to={`/post/all?sortBy=sort-votes`}>
                            <div className="blog-preview-stats-totals">
                                <p>Upvotes: </p>
                                <h4>{upvotes}</h4>
                            </div>
                        </Link> 

                        <Link to={`/post/all?sortBy=sort-comments`}>
                            <div className="blog-preview-stats-totals">
                                <p>Comments: </p>
                                <h4>{comments}</h4>
                            </div>
                        </Link>
                    </div>
                    <h4 id="blog-preview-stats-words">
                        And 
                        <span id="blog-preview-stats-word-count"> {wordCount} </span>
                        words total!
                    </h4>
                </div>
            </main>
        </>
    );
};