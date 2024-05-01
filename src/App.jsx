import { useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './App.css'
import { Home } from './pages/Home';
import LandingPage from './components/home/LandingPage';
import { NotFound } from './pages/NotFound';
import { CreatePost } from './pages/CreatePost';
import { Post } from './pages/Post';
import { Gallery } from './pages/Gallery';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

function App() {

    const location = useLocation();
    const [isHomePage, setIsHomePage] = useState(location.pathname === '/');

    useEffect(() => {
        setIsHomePage(location.pathname === '/');
    }, [location.pathname]);

    return (
        <>
            {isHomePage ? <LandingPage /> : null}

            <nav id="main-navbar">
                <Link to="/" className="navbar-links" id="main-home-link">Project B</Link>
                <Link to="/post/all" className="navbar-links" id="gallery-link">Gallery</Link>
                <Link to="/new-post" className="navbar-links" id="new-post-link">New Post</Link>
            </nav>

            <div id="main-body">
                <Routes>
                    <Route path="/" element={<Home /> } />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/new-post" element={<CreatePost />} />
                    <Route path="/post/:id" element={<Post />} />
                    <Route path="/post/all" element={<Gallery />} />
                </Routes>
            </div>

            <footer id="main-footer"></footer>
        </>
    )
}

export default App
