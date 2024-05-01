import { Link, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function PostCard() {
    /*const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { id } = useParams(); */

    /*useEffect(() => {
        fetch("http://localhost:8080/api/posts")
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    } */

    const [isProfilePage, setIsProfilePage] = useState(location.pathname.startsWith('/profile/'));

    useEffect(() => {
        setIsProfilePage(location.pathname.startsWith('/profile/'));
    }, [location.pathname]);

    return (
        <>
            <div id="blog-card-holder">
                <div className="blog-card">
                    <h2>blah</h2>
                    <p>blah</p>
                    {!isProfilePage && <Link to={`/post/`}>Read More</Link>}
                </div>
            </div>


            {/* <div id="posts">
                {posts.map(post => (
                    <div key={post._id} className="post">
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>
                        <Link to={`/post/${post._id}`}>Read More</Link>
                    </div>
                ))}
            </div> */}
        </>
    )
}