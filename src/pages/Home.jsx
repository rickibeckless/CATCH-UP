import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import DOMPurify from "dompurify";

export function Home() {

    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState([]);
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

                setPosts(sortedData);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };

        fetchPosts();
    }, [supabase, id]);

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
                                <h2>{post.title}</h2>
                                <Link to={`/user/${post.user_username}`}>{post.user_username}</Link>
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
                                            <Link to={`/post/${post.id}`}>read more.</Link>
                                        </span>
                                    </>
                                    : parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')
                                )}
                            </p>
                            
                        </div>
                    ))}
                </div>
                <h4 id="blog-preview-stats">blah</h4>
            </main>
        </>
    )
}