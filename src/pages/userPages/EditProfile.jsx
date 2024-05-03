import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { supabase } from '../../App';
import bcrypt from 'bcryptjs';
import { MiniTextEditor } from '../../components/MiniTextEditor';

export function EditProfile() {

    const { id } = useParams();
    const user_id = localStorage.getItem('userId');
    const [profile, setProfile] = useState([]);
    const [editedUsername, setEditedUsername] = useState('');
    const [editedFirst_name, setEditedFirstName] = useState('');
    const [editedLast_name, setEditedLastName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedAbout_me, setEditedAboutMe] = useState('');
    const [editedUserTitle, setEditedUserTitle] = useState('');
    const [editedPassword, setEditedPassword] = useState('');

    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const { data: userData, error: userError } = await supabase
                .from('Users')
                .select('*')
                .eq('id', user_id)
                .single();
            if (userError) {
                throw userError;
            }
            setProfile(userData);
            console.log(profile.username);

            if (!editedUsername) setEditedUsername(userData?.username || '');
            if (!editedFirst_name) setEditedFirstName(userData?.first_name || '');
            if (!editedLast_name) setEditedLastName(userData?.last_name || '');
            if (!editedEmail) setEditedEmail(userData?.email || '');
            if (!editedAbout_me) setEditedAboutMe(userData?.about_me || '');
            if (!editedUserTitle) setEditedUserTitle(userData?.user_title || '');
            if (!editedPassword) setEditedPassword(userData?.password || '');
        } catch (error) {
            console.error("Error fetching profile:", error.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const hashedPassword = await bcrypt.hash(editedPassword, 10);
            const { data, error } = await supabase.from('Users').update({ 
                username: editedUsername, 
                first_name: editedFirst_name, 
                last_name: editedLast_name, 
                email: editedEmail, 
                about_me: editedAbout_me,
                user_title: editedUserTitle,
                password: hashedPassword
            }).eq('id', user_id);

            if (error) {
                throw error;
            }
            setEditedUsername('');
            setEditedFirstName('');
            setEditedLastName('');
            setEditedEmail('');
            setEditedAboutMe('');
            setEditedUserTitle('');
            setEditedPassword('');

            navigate(`/profile/${profile.username}`);

            console.log("User updated successfully");
        } catch (error) {
            console.error("Error updating user:", error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const { error: deleteError } = await supabase.from('Users').delete().eq('id', user_id);
            if (deleteError) {
                throw deleteError;
            }
            localStorage.removeItem('userId');
            console.log('User logged out');
            navigate('/');
        } catch (error) {
            console.error("Error deleting post:", error.message);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [localStorage.getItem('userId')]);

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
            <main id="profile-page-holder">
                <section id="user-profile">
                    <h1>{profile.username}</h1>
                    <h3>{profile.first_name} {profile.last_name}</h3>
                    <p>{profile.user_title}</p>
                    <h3>About Me:</h3>
                    <p dangerouslySetInnerHTML={{ __html: profile.about_me }} />
                </section>
                <form className="edit-profile-form" onSubmit={handleUpdate}>
                    <div className="form-input-holder">
                        <label htmlFor="form-username">New Username?: </label>
                        <input className="form-input-field" type="text" id="form-username" minLength="8" onChange={(e) => setEditedUsername(e.target.value)} placeholder="Username" />                    
                        <div className="form-input-additional">
                            <p>Username must be at least 8 character long and unique.</p>
                        </div>
                    </div>

                    <div className="form-input-holder">
                        <label htmlFor="form-fname">First Name: </label>
                        <input className="form-input-field" type="text" id="form-fname" onChange={(e) => setEditedFirstName(e.target.value)} placeholder="John" />                    
                    </div>

                    <div className="form-input-holder">
                        <label htmlFor="form-lname">Last Name: </label>
                        <input className="form-input-field" type="text" id="form-lname" onChange={(e) => setEditedLastName(e.target.value)} placeholder="Doe" />                    
                    </div>

                    <div className="form-input-holder">
                        <label htmlFor="form-user-title">Title: </label>
                        <input className="form-input-field" type="text" id="form-user-title" onChange={(e) => setEditedUserTitle(e.target.value)} placeholder="Web Developer" />                    
                    </div>

                    <div className="form-input-holder">
                        <label htmlFor="form-about">About Me: </label>
                        <MiniTextEditor value={editedAbout_me} onChange={(newAboutMe) => setEditedAboutMe(newAboutMe)} />
                    </div>

                    <div className="form-input-holder">
                        <label htmlFor="form-email">New Email?: </label>
                        <input className="form-input-field" type="email" id="form-email" onChange={(e) => setEditedEmail(e.target.value)} placeholder="jdoe@email.com" />                    
                    </div>

                    <div className="form-input-holder">
                        <label htmlFor="form-password">New Password?: </label>
                        <input className="form-input-field" type="password" id="form-password" minLength="8" onChange={(e) => setEditedPassword(e.target.value)} placeholder="aBcd@123" />
                        <div className="form-input-additional">
                            <p>Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.</p>
                        </div>
                    </div>

                    <div className="edit-profile-btn-holder">
                        <button type="button" onClick={handleDelete}>Delete Profile</button>
                        <button type="submit" id="edit-profile-btn">Update Profile</button>
                    </div>
                </form>
            </main>
        </>
    )
}