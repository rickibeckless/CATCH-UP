import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export function CreatePost() {
    

    return (
        <div className="create-post-form-holder">
            <form className="create-post-form">
                <div className="form-input-holder">
                    <label htmlFor="post-author">Username</label>
                    <input className="form-input-field" type="text" id="post-author" placeholder="Username..." required />                    
                </div>

                <div className="form-input-holder">
                    <label htmlFor="post-title">Post Title</label>
                    <input className="form-input-field" type="text" id="post-title" placeholder="Post Title" required />                    
                </div>

                <div className="form-input-holder">
                    <label htmlFor="post-content">Post Content</label>
                    <textarea className="form-input-field" id="post-content" placeholder="Post Content" required></textarea>                    
                </div>

                <div className="create-post-btn-holder">
                    <button type="submit" id="create-post-btn">Create Post</button>
                </div>
            </form>
        </div>
    );
};
