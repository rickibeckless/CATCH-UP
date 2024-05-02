import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react';
import bcrypt from 'bcryptjs';
import { supabase } from '../../App';

export function SignUp() {
    
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const { data, error } = await supabase.from('Users').insert([{ 
                username, 
                first_name, 
                last_name, 
                email, 
                password: hashedPassword
            }]);

            if (error) {
                throw error;
            }
            setUsername('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');

            const { data: users, error: usersError } = await supabase
                .from('Users')
                .select('*')
                .eq('username', username);
            const user = users[0];
            localStorage.setItem('userId', user.id);
            navigate(`/profile/${username}`);            

            console.log("User created successfully");
        } catch (error) {
            console.error("Error creating user:", error.message);
        }
    };

    return (
        <main className="signup-form-holder">
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-input-holder">
                    <label htmlFor="form-username">Pick a Username:<span className="form-input-required-asterisk">*</span> </label>
                    <input className="form-input-field" type="text" id="form-username" minLength="8" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />                    
                    <div className="form-input-additional">
                        <p>Username must be at least 8 character long and unique.</p>
                    </div>
                </div>

                <div className="form-input-holder">
                    <label htmlFor="form-fname">First Name: </label>
                    <input className="form-input-field" type="text" id="form-fname" value={first_name} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />                    
                </div>

                <div className="form-input-holder">
                    <label htmlFor="form-lname">Last Name: </label>
                    <input className="form-input-field" type="text" id="form-lname" value={last_name} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />                    
                </div>

                <div className="form-input-holder">
                    <label htmlFor="form-email">Email:<span className="form-input-required-asterisk">*</span> </label>
                    <input className="form-input-field" type="email" id="form-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jdoe@email.com" required />                    
                </div>

                <div className="form-input-holder">
                    <label htmlFor="form-password">Create a Password:<span className="form-input-required-asterisk">*</span> </label>
                    <input className="form-input-field" type="password" id="form-password" minLength="8" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="aBcd@123" required />
                    <div className="form-input-additional">
                        <p>Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.</p>
                    </div>
                </div>

                <div className="signup-btn-holder">
                    <button type="submit" id="signup-btn">Sign-Up</button>
                </div>
            </form>
        </main>
    );
};
