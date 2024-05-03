import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import DOMPurify from "dompurify";
import { supabase } from '../../App';

export function Profile() {

    const { username } = useParams();
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: userData, error: userError } = await supabase
                    .from('Users')
                    .select('*')
                    .eq('id', userId)
                    .single();
                if (userError) {
                    throw userError;
                }
                setUser(userData);

                console.log("User fetched successfully")
            } catch (error) {
                console.log(user);
                console.log(username);
                console.error("Error fetching user:", error.message);
            }  
        };

        const fetchUserPosts = async () => {
            try {
                const { data: userPosts, error: userPostsError } = await supabase
                    .from('Posts')
                    .select('*')
                    .eq('user_id', userId);

                if (userPostsError) {
                    throw userPostsError;
                }
                setPosts(userPosts);

                console.log("User posts fetched successfully");
            } catch (error) {
                console.error("Error fetching user posts:", error.message);
            }
        };

        fetchUser();
        fetchUserPosts();
    }, [supabase, username]);

    useEffect(() => {
        document.title = `${user.username}`;

        return () => {
            document.title = 'CATCH-UP!';
        };
    }, [user.username]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric',  });
    };

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const sanitizedTitle = user?.username?.replace(/[^\w\s]/gi, '');
    const sanitizedReadMe = DOMPurify.sanitize(user.about_me, { USE_PROFILES: { html: true } });

    return (
        <>
            <main id="profile-page-holder">
                <section id="user-profile">
                    <h1>{user.username}</h1>
                    <h3>{user.first_name} {user.last_name}</h3>
                    <p>{user.user_title}</p>
                    <h3>About Me:</h3>
                    <div className="sanitizedText">{parse(sanitizedReadMe)}</div>
                    <div className="user-stats">
                        <p>Member Since: {formatDate(user.created_at)}</p>
                        <p>Posts: {user.posts_count}</p>
                        <p>Comments: {user.comments_count}</p>
                        <p>Upvotes: {user.upvotes_count}</p>
                    </div>
                    <Link to={`/profile/${user.username}/edit`}>Edit Profile</Link>
                </section>
                <section id="user-key-works">
                    
                </section>
                <section id="user-complete-works">
                    <div id="blog-card-holder">
                        <div className="blog-card">
                            {posts.map(post => (
                                <div key={post._id} className="post">
                                    <h2>{post.title}</h2>
                                    <p>{parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).length > 400 ? `${parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).slice(0,400)}...` : parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, ''))}</p>
                                    <Link to={`/post/${post.id}`}>Read More</Link>
                                    <Link to={`/post/${post.id}/edit`}>Edit Post</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}