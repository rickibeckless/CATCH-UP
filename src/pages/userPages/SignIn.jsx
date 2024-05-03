import { useState } from 'react';
import { supabase } from '../../App';
import bcrypt from 'bcryptjs';
import { Link, useNavigate, useParams } from "react-router-dom";

export function SignIn() {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: users, error } = await supabase
                .from('Users')
                .select('*')
                .eq('username', username);
            if (error) {
                throw error;
            }

            if (users.length === 1) {
                const user = users[0];
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    localStorage.setItem('userId', user.id);
                    console.log("User logged in successfully");
                    navigate('/');
                } else {
                    console.error('Incorrect password');
                }
            } else {
                console.error('User not found');
            }

        } catch (error) {
            console.error("Error logging in user:", error.message);
        }
    };

    return (
        <main className="signin-form-holder">
            <form className="signin-form" onSubmit={handleSubmit}>
                <div className="form-input-holder">
                    <label htmlFor="form-username">Username: </label>
                    <input className="form-input-field" type="text" id="form-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                </div>

                <div className="form-input-holder">
                    <label htmlFor="form-password">Password: </label>
                    <input className="form-input-field" type="password" id="form-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="aBcd@123" required />
                </div>

                <div className="signin-btn-holder">
                    <button type="submit" id="signin-btn">Sign-In</button>
                    <div>
                        <p>Don't have an account?</p>
                        <button type="button" id="signup-btn">
                            <Link to="/signup">Sign-Up</Link>
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
};
