import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../App';
import { PostCard } from '../../components/PostCard';

export function Profile() {

    const { username } = useParams();
    const [user, setUser] = useState({});
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

        fetchUser();
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

    return (
        <>
            <main id="profile-page-holder">
                <section id="user-profile">
                    <h1>User: {user.username}</h1>
                    <h3>FirstName LastName</h3>
                    <p>User Title</p>
                    <p>About User</p>
                </section>
                <section id="user-key-works">
                    <PostCard />
                </section>
            </main>
        </>
    )
}