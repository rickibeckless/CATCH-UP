import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import DOMPurify from "dompurify";

export function Gallery() {

    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let sortBy = queryParams.get('sortBy') || "sort_date";

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data: postData, error: postError } = await supabase
                    .from('Posts')
                    .select('*');
                if (postError) {
                    throw postError;
                }

                if (sortBy === 'sort-date') { // sort by creation date
                    postData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                } else if (sortBy === 'sort-votes') { // sort by upvote count
                    postData.sort((a, b) => b.upvotes - a.upvotes);

                } else if (sortBy === 'sort-comments') { // sort by comment count
                    postData.sort((a, b) => b.comments - a.comments);

                } else if (sortBy === 'sort-taz') { // sort by title A-Z
                    postData.sort((a, b) => a.title.toUpperCase().localeCompare(b.title));

                } else if (sortBy === 'sort-tza') { // sort by title Z-A
                    postData.sort((a, b) => b.title.toUpperCase().localeCompare(a.title));

                } else if (sortBy === 'sort-uaz') { // sort by user A-Z
                    postData.sort((a, b) => a.user_username.toUpperCase().localeCompare(b.user_username));

                } else if (sortBy === 'sort-uza') { // sort by user Z-A
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
        navigate(`?sortBy=${e.target.value}`)
    };

    return (
        <>
            <section>
                <label htmlFor="sort-list">Sort by: </label>
                <select id="sort-list" value={sortBy} onChange={handleSortChange}>
                    <option value="sort-date">post date</option>
                    <option value="sort-votes">vote count</option>
                    <option value="sort-comments">comment count</option>
                    <option value="sort-taz">title A-Z</option>
                    <option value="sort-tza">title Z-A</option>
                    <option value="sort-uaz">user A-Z</option>
                    <option value="sort-uza">user Z-A</option>
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
                                <p>
                                    {parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).length > 400 ? 
                                    `${parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).slice(0,400)}...` : 
                                    parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, ''))}
                                </p>
                                <Link to={`/post/${post.id}`}>Read More</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}