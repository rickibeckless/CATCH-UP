import { useState, useEffect } from 'react';
import { supabase } from '../../App';
import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';

export function EditPost() {

    /**
     * I need to fetch the post and then update it. view project a for referencing
    */
    
    const { id } = useParams();
    const user_id = localStorage.getItem('userId');
    const [post, setPost] = useState([]);
    const [user_username, setUserUsername] = useState('');
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedMedia, setEditedMedia] = useState('');
    const [editedFile, setEditedFile] = useState(null);
    const [editedUrl, setEditedUrl] = useState('');
    const [editedImageUrl, setEditedImageUrl] = useState('');
    const [edit_date, setEditDate] = useState('');

    const navigate = useNavigate();

    const fetchUsername = async () => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .select('username')
                .eq('id', user_id)
                .single();

            if (error) {
                throw error;
            }
            setUserUsername(data.username);
        } catch (error) {
            console.error("Error fetching username:", error.message);
        }
    };

    const fetchPost = async () => {
        try {
            const { data: postData, error: postError } = await supabase
                .from('Posts')
                .select('*')
                .eq('user_id', user_id)
                .single();
            if (postError) {
                throw postError;
            }
            setPost(postData);

            if (!editedTitle) setEditedTitle(postData?.title || '');
            if (!editedContent) setEditedContent(postData?.content || '');
            if (!editedMedia) setEditedMedia(postData?.media || '');
            if (!editedFile) setEditedFile(postData?.file || null);
            if (!editedUrl) setEditedUrl(postData?.url || '');
            if (!edit_date) setEditDate(postData?.updated_at || '');
        } catch (error) {
            console.error("Error fetching posts:", error.message);
        }
    };

    useEffect(() => {
        fetchUsername();
        fetchPost();
    }, [localStorage.getItem('userId')]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data: updateData, error: updateError } = await supabase.from('Posts').update({
                title: editedTitle,
                content: editedContent,
                media: editedMedia,
                file: editedFile,
                url: editedUrl,
                updated_at: new Date()
            }).eq('id', id);

            if (updateError) {
                throw updateError;
            }

            await fetchPost();
            console.log("Post updated successfully");
            navigate(`/post/${id}`);
        } catch (error) {
            console.log("Error updating post:", error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const { error: deleteError } = await supabase.from('Posts').delete().eq('user_id', user_id);
            if (deleteError) {
                throw deleteError;
            }
            navigate('/');
        } catch (error) {
            console.error("Error deleting post:", error.message);
        }
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric',  });
    };

    const formatTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    /*const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };    

    const handleMediaChange = (e) => {
        if (media != "null") {
            removeImage();
        }
        setMedia(e.target.value);
    };

    const removeImage = () => {
        setFile(null);
        setUrl('');
        setImageUrl('');
        setMedia('');
    }; */

    return (
        <main className="edit-post-form-holder">
            <h1 className="page-title">Edit {post.title}</h1>

            <div className="posts-holder">
                <p>Posted by {post.user_username} on {formatDate(post.created_at)} at {formatTime(post.created_at)}</p>
                
                <h3>{post.title}</h3>

                <p>{post.content}</p>
            </div>

            <form className="edit-post-form">
                <div className="form-input-holder">
                    <label htmlFor="post-title">Post Title</label>
                    <input className="form-input-field" type="text" id="post-title" onChange={(e) => setEditedTitle(e.target.value)} placeholder="Post Title" required />                    
                </div>

                <div className="form-input-holder">
                    <label htmlFor="post-content">Post Content</label>
                    <textarea className="form-input-field" id="post-content" onChange={(e) => setEditedContent(e.target.value)} placeholder="Post Content" required></textarea>                    
                </div>

                {/* {!media && (
                    <div className="form-input-holder">
                        <select id="media-type" value={media} onChange={handleMediaChange}>
                            <option value="" disabled selected>Select Media Type</option>
                            <option value="file">File</option>
                            <option value="url">URL</option>
                        </select>
                    </div>                    
                )}

                {media === 'file' && (
                    <div className="form-input-holder">
                        <label htmlFor="post-media-image">Select Image File</label>
                        <input type="file" accept="image/*" id="post-media-image" className="form-input-field create-post-media-img" onChange={(e) => {
                            setFile(e.target.files[0]);
                            const reader = new FileReader();
                            reader.onload = () => {
                                setImageUrl(reader.result);
                            };
                            reader.readAsDataURL(e.target.files[0]);
                        }} />
                    </div>
                )}
                {media === 'url' && (
                    <div className="form-input-holder">
                        <label htmlFor="post-media-url">Enter Image URL</label>
                        <input type="url" id="post-media-url" className="form-input-field create-post-media-img" value={url} onChange={(e) => {
                            setUrl(e.target.value);
                            setImageUrl(e.target.value);
                        }} placeholder="Image URL" />
                    </div>
                )}

                {imageUrl && (
                    <div className="form-img-holder">
                        <img id="create-post-img" src={imageUrl} alt="Post Image" />
                    </div>
                )}

                {media && (
                    <div className="form-input-holder">
                        <button type="button" onClick={removeImage}>Remove Image</button>
                    </div>
                )} */}

                <div className="create-post-btn-holder">
                    <button type="button" id="delete-post-button" onClick={handleDelete}>Delete Post</button>
                    <button type="submit" id="update-post-btn" onClick={handleUpdate}>Update Post</button>
                </div>
            </form>
        </main>
    );
};
