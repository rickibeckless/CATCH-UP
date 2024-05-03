import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import DOMPurify from "dompurify";

export function Home() {

    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState([]);

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
                <h1>blah</h1>
                <p>blah</p>
                <div id="blog-card-holder">
                    <div className="blog-card">
                        {posts.map(post => (
                            <div key={post._id} className="post">
                                <h2>{post.title}</h2>
                                <Link to={`/user/${post.user_username}`}>{post.user_username}</Link>
                                <p>{parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).length > 400 ? `${parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).slice(0,400)}...` : parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, ''))}</p>
                                <Link to={`/post/${post.id}`}>Read More</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}