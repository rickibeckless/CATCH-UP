import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../App';

export function PostCard() {

    

    return (
        <>
            <div id="blog-card-holder">
                <div className="blog-card">
                    <h2>blah</h2>
                    <p>blah</p>

                    {post.map(post => (
                        <div key={post._id} className="post">
                            <h2>{post.title}</h2>
                            <p>{post.body}</p>
                            {!isProfilePage && <Link to={`/post/${post._id}`}>Read More</Link>}
                        </div>
                    ))}
                </div>
            </div>


            {/* <div id="posts">

            </div> */}
        </>
    )
}