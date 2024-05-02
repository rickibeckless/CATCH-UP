import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../App';

export function Post() {

    const { id } = useParams();
    const user_id = localStorage.getItem('userId');
    const [post, setPost] = useState([]);
    const [user, setUser] = useState({});

    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const { data: userData, error: userError } = await supabase
                .from('Users')
                .select('*')
                .eq('username', user)
                .single();
            if (userError) {
                throw userError;
            }
            setUser(post.user_username);

            console.log("User fetched successfully")
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

    useEffect(() => {
        fetchUser();
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

            console.log(postData);
            console.log(postData.user_id);
            console.log(user_id);

            if (postData.user_id === user_id) {
                console.log("You cannot upvote your own post");
            } else if (postData?.upvotes_users?.includes(user_id)) {
                console.log("You have already upvoted this post");
            } else {
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

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric',  });
    };

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

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
                    <p>{post.content}</p>
                    <p>Upvotes: {post.upvotes}</p>
                    <button className="upvote-btn" onClick={() => handleUpvote(post.id)}>Upvote</button>
                </section>
                <section id="post-author-info">
                    <h2>{post.user_username}</h2>
                    <p>{user.about_me}</p>
                </section>
            </main>
        </>
    )
}