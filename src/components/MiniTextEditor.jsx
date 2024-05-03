import { Link, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

export function MiniTextEditor({ value, onChange }) {
    const [editorContent, setEditorContent] = useState(value);

    const editorRef = useRef(null);

    useEffect(() => {
        setEditorContent(value);
    }, [value]);

    const handleEditorChange = (newContent) => {
        setEditorContent(newContent);
        onChange(newContent);
    };

    const modules = {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
        
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link'],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                
                [{ 'align': [] }],
        
                ['clean']
            ],
        },
    };
      
    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'script', 'indent', 'direction', 'size', 'color', 'background',
        'link', 'font', 'align', 'clean'
    ];

    return (
        <ReactQuill 
            ref={editorRef}
            value={editorContent} 
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
        />
    );
}