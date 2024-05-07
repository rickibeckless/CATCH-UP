import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../App';
import { useState, useEffect, useMemo } from 'react';
import parse from 'html-react-parser';
import DOMPurify from "dompurify";

export function Gallery() {

    const location = useLocation();
    const navigate = useNavigate();

    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const queryParams = new URLSearchParams(location.search);
    let sortBy = queryParams.get('sortBy') || "sort_date";

    useEffect(() => {
        let validSortBy = ['sort-date', 'sort-votes', 'sort-comments', 'sort-taz', 'sort-uaz'];
        if (!queryParams.has('sortBy') || !validSortBy.includes(queryParams.get('sortBy'))) {
            const sortByParam = queryParams.get('sortBy');
            const correctedSortBy = sortByParam ? sortByParam.split('/')[0] : 'sort-date';
            queryParams.set('sortBy', correctedSortBy);
            navigate(`/post/all?${queryParams.toString()}`);
        }
    }, [location.search, navigate]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data: postData, error: postError } = await supabase
                    .from('Posts')
                    .select('*');
                if (postError) {
                    throw postError;
                };

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
                };

                setPosts(postData);
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }  
        };

        fetchPosts();
    }, [supabase, id, sortBy]);

    const dateSortedPosts = useMemo(() => {
        const groupedByYear = posts.reduce((acc, post) => {
            const year = post.created_at.slice(0, 4);
            if (!acc[year]) {
                acc[year] = {};
            }
    
            const month = post.created_at.slice(5, 7);
            if (!acc[year][month]) {
                acc[year][month] = [];
            }
    
            acc[year][month].push(post);
            return acc;
        }, {});
    
        return groupedByYear;
    }, [posts]);

    const alphabetTitleSortedPosts = useMemo(() => {
        const sortedByTitle = posts.reduce((acc, post) => {
            const firstCharTitle = post.title[0].toUpperCase();
            if (!acc[firstCharTitle]) {
                acc[firstCharTitle] = [];
            }
            acc[firstCharTitle].push(post);
            return acc;
        }, {});
    
        return sortedByTitle;
    }, [posts]);

    const alphabetUserSortedPosts = useMemo(() => {
        const sortedByUser = posts.reduce((acc, post) => {
            const firstCharUser = post.user_username[0].toUpperCase();
            if (!acc[firstCharUser]) {
                acc[firstCharUser] = [];
            }
            acc[firstCharUser].push(post);
            return acc;
        }, {});
    
        return sortedByUser;
    }, [posts]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    const handleSortChange = (e) => {
        navigate(`?sortBy=${e.target.value}`);
    };

    const alphabetLoop = () => {
        const characters = [];
        for (let i = 65; i <= 90; i++) {
            characters.push(String.fromCharCode(i));
        }

        return characters;
    };

    console.log("a-z: ", alphabetLoop());

    return (
        <>
            <section>
                <label htmlFor="sort-list">Sort by: </label>
                <select id="sort-list" value={sortBy} onChange={handleSortChange}>
                    <option value="sort-date">post date</option>
                    <option value="sort-votes">vote count</option>
                    <option value="sort-comments">comment count</option>
                    <option value="sort-taz">title A-Z</option>
                    <option value="sort-uaz">user A-Z</option>
                </select>
            </section>
            <main id="blog-gallery">
                <h1>blah</h1>
                <p>blah</p>
                <div id="blog-card-holder">
                    {posts.length === 0 && <p>No posts found.</p>}

                    {sortBy === 'sort-date' ? (
                        <>
                            <h4>You're sorting by date</h4>

                            <div>

                                {Object.entries(dateSortedPosts).map(([year, months]) => (
                                    <div key={year}>
                                        <h2>{year}</h2>
                                        {Object.entries(months).map(([month, monthPosts]) => (
                                            <div key={month}>
                                                <h3>{new Date(year, month - 1).toLocaleString('default', { month: 'long' })}</h3>
                                                <div className="date-cards blog-cards gallery-styles">    
                                                    {monthPosts.map(post => (
                                                        <div key={post._id} className="date-post home-preview-post gallery-styles">
                                                            <h4>{post.title}</h4>
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
                                        ))}
                                    </div>
                                ))}

                            </div>
                        </>
                    ) : sortBy === 'sort-votes' ? (
                        <>
                            <h4>You're sorting by votes</h4>

                            <div className="vote-cards blog-cards gallery-styles">
                                {posts.map(post => (
                                    <div key={post._id} className="vote-post home-preview-post gallery-styles">
                                        <h2>{post.title}</h2>
                                        <Link to={`/user/${post.user_username}`}>{post.user_username}</Link>
                                        <div className="preview-post-stats">
                                            <p>Upvotes: {post.upvotes}</p>
                                        </div>
                                        <p>
                                            {parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).length > 200 ? 
                                            `${parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).slice(0,200)}...` : 
                                            parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, ''))}
                                        </p>
                                        <Link to={`/post/${post.id}`}>Read More</Link>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : sortBy === 'sort-comments' ? (
                        <>
                            <h4>You're sorting by comments</h4>

                            <div className="comments-cards blog-cards gallery-styles">
                                {posts.map(post => (
                                    <div key={post._id} className="comment-post home-preview-post gallery-styles">
                                        <h2>{post.title}</h2>
                                        <Link to={`/user/${post.user_username}`}>{post.user_username}</Link>
                                        <div className="preview-post-stats">
                                            <p>Comments: {post.comments}</p>
                                        </div>
                                        <p>
                                            {parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).length > 400 ? 
                                            `${parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, '')).slice(0,400)}...` : 
                                            parse(DOMPurify.sanitize(post.content).replace(/<[^>]+>/g, ''))}
                                        </p>
                                        <Link to={`/post/${post.id}`}>Read More</Link>
                                    </div>
                                ))}
                            </div>

                        </>
                    ) : sortBy === 'sort-taz' ? (
                        <>
                            <h4>You're sorting by title A-Z</h4>

                            <div className="alphabet-list">
                                {alphabetLoop().map(letter => (
                                    <a className="alphabet-list-letter" key={letter} href={`/post/all?sortBy=sort-taz#${letter}`}>{letter}</a>
                                ))}
                            </div>

                            {Object.entries(alphabetTitleSortedPosts).map(([firstCharTitle, posts]) => (
                                <div key={firstCharTitle}>
                                    <h3 id={firstCharTitle}>{firstCharTitle}</h3>
                                    <div className="date-cards blog-cards gallery-styles">    
                                        {posts.map(post => (
                                            <div key={post._id} className="date-post home-preview-post gallery-styles">
                                                <h4>{post.title}</h4>
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
                            ))}

                        </>
                    ) : sortBy === 'sort-uaz' && (
                        <>
                            <h4>You're sorting by user A-Z</h4>

                            <div className="alphabet-list">
                                {alphabetLoop().map(letter => (
                                    <a className="alphabet-list-letter" key={letter} href={`/post/all?sortBy=sort-uaz#${letter}`}>{letter}</a>
                                ))}
                            </div>

                            {Object.entries(alphabetUserSortedPosts).map(([firstCharUser, posts]) => (
                                <div key={firstCharUser}>
                                    <h3 id={firstCharUser}>{firstCharUser}</h3>
                                    <div className="date-cards blog-cards gallery-styles">    
                                        {posts.map(post => (
                                            <div key={post._id} className="date-post home-preview-post gallery-styles">
                                                <h4>{post.title}</h4>
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
                            ))}
                        </>
                    )}
                </div>
            </main>
        </>
    )
}