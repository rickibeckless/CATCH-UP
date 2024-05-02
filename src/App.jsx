import { useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './App.css'
import { Home } from './pages/Home';
import LandingPage from './components/home/LandingPage';
import { NotFound } from './pages/NotFound';
import { CreatePost } from './pages/postsPages/CreatePost';
import { Post } from './pages/postsPages/Post';
import { Gallery } from './pages/Gallery';
import { SignUp } from './pages/userPages/SignUp';
import { Profile } from './pages/userPages/Profile';
import { SignIn } from './pages/userPages/SignIn';
import { User } from './pages/User';
import { EditPost } from './pages/postsPages/EditPost';
import { EditProfile } from './pages/userPages/EditProfile';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

function App() {

    const location = useLocation();
    const userId = localStorage.getItem('userId');
    const [isHomePage, setIsHomePage] = useState(location.pathname === '/');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [user_username, setUserUsername] = useState('');

    useEffect(() => {
        setIsHomePage(location.pathname === '/');
        
        if (userId) {
            setIsLoggedIn(true);
            fetchUsername(userId);
            fetchUserUsername(userId);
        } else {
            setIsLoggedIn(false);
            console.log('User is not logged in');
        }
    }, [location.pathname, userId]);

    const fetchUsername = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .select('username')
                .eq('id', userId)
                .single();

            if (error) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
            }
        } catch (error) {
            console.error('Error fetching username:', error.message);
        }
    };

    const fetchUserUsername = async (user_username) => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .select('username')
                .eq('username', user_username)
                .single();

            if (error) {
                throw error;
            }

            if (data) {
                setUserUsername(data.user_username);
            }
        } catch (error) {
            console.error('Error fetching user_username:', error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        console.log('User logged out');
    };

    return (
        <>
            {isHomePage ? <LandingPage /> : null}

            <nav id="main-navbar">
                <Link to="/" className="navbar-links" id="main-home-link">CATCH-UP!</Link>
                <Link to="/post/all" className="navbar-links" id="gallery-link">Gallery</Link>

                {!isLoggedIn ? <Link to="/signup" className="navbar-links" id="signup-link">Sign Up</Link> : null}

                {!isLoggedIn ? <Link to="/signin" className="navbar-links" id="signin-link">Sign In</Link> : null}

                {isLoggedIn ? <Link to="/new-post" className="navbar-links" id="new-post-link">New Post</Link> : null}

                {isLoggedIn ? <p>Hello, <Link to={`/profile/${username}`} className="navbar-links" id="profile-link">{username}</Link></p> : null}

                {isLoggedIn ? <Link to="/" className="navbar-links" id="logout-link" onClick={handleLogout}>Logout</Link> : null}
            </nav>

            <div id="main-body">
                <Routes>
                    <Route path="/" element={<Home /> } />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/new-post" element={<CreatePost />} />
                    <Route path="/post/:id" element={<Post />} />
                    <Route path="/post/all" element={<Gallery />} />
                    {isLoggedIn ? <Route path={`/post/:id/edit`} element={<EditPost />} /> : null}
                    {isLoggedIn ? <Route path={`/profile/${username}`} element={<Profile />} /> : null}
                    {isLoggedIn ? <Route path={`/profile/${username}/edit`} element={<EditProfile />} /> : null}
                    <Route path="/user/:user_username" element={<User />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>

            <footer id="main-footer"></footer>
        </>
    )
}

export default App;
