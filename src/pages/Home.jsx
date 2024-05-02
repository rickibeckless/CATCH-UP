import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';

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

                setPosts(postData);
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

    const handleUpvote = async (id) => {
        try {
            const { data: postData, error: postError } = await supabase
                .from('Posts')
                .select('upvotes')
                .eq('id', id)
                .single();
            if (postError) {
                throw postError;
            }

            const updatedUpvotes = postData.upvotes + 1;

            const { data, error } = await supabase
                .from('Posts')
                .update({ upvotes: updatedUpvotes })
                .eq('id', id);
            if (error) {
                throw error;
            }

            setPosts(prevState => ({ ...prevState, upvotes: updatedUpvotes }));
        } catch (error) {
            console.error("Error upvoting post:", error.message);
        }
    };

    const sanitizedTitle = posts?.title?.replace(/[^\w\s]/gi, '');

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
                                <p>{post.content.length > 400 ? `${post.content.slice(0, 400)}...` : post.content}</p> {/* <p>{post.content}</p> */}
                                <Link to={`/post/${post.id}`}>Read More</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}