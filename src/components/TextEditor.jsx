import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

export function TextEditor({ value, onChange }) {
    const [editorContent, setEditorContent] = useState(value);

    const handleEditorChange = (newContent) => {
        setEditorContent(newContent);
        onChange(newContent);
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': 1 }, { 'header': 2 }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
        
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link'],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
        
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
        
                ['clean']
            ],
        },
    };
    
    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'link', 'bullet', 'script', 'indent', 'direction', 'size', 'color', 'background',
        'font', 'align', 'clean'
    ];

    return (
        <ReactQuill 
            value={editorContent} 
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
        />
    );
};
