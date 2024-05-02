import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import { useState, useEffect } from 'react';

export function Gallery() {

    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState([]);
    const [sortBy, setSortBy] = useState('sort_date');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data: postData, error: postError } = await supabase
                    .from('Posts')
                    .select('*');
                if (postError) {
                    throw postError;
                }

                if (sortBy === 'sort_date') { // sort by creation date
                    postData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                } else if (sortBy === 'sort_votes') { // sort by upvote count
                    postData.sort((a, b) => b.upvotes - a.upvotes);
                } else if (sortBy === 'sort_taz') { // sort by title A-Z
                    postData.sort((a, b) => a.title.toUpperCase().localeCompare(b.title));
                } else if (sortBy === 'sort_tza') { // sort by title Z-A
                    postData.sort((a, b) => b.title.toUpperCase().localeCompare(a.title));
                } else if (sortBy === 'sort_uaz') { // sort by user A-Z
                    postData.sort((a, b) => a.user_username.toUpperCase().localeCompare(b.user_username));
                } else if (sortBy === 'sort_uza') { // sort by user Z-A
                    postData.sort((a, b) => b.user_username.toUpperCase().localeCompare(a.user_username));
                }

                setPosts(postData);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };

        fetchPosts();
    }, [supabase, id, sortBy]);

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

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <>
            <section>
                <label htmlFor="sort-list">Sort by: </label>
                <select id="sort-list" value={sortBy} onChange={handleSortChange}>
                    <option value="sort_date">post date</option>
                    <option value="sort_votes">vote count</option>
                    <option value="sort_taz">title A-Z</option>
                    <option value="sort_tza">title Z-A</option>
                    <option value="sort_uaz">user A-Z</option>
                    <option value="sort_uza">user Z-A</option>
                </select>
            </section>
            <main id="blog-gallery">
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