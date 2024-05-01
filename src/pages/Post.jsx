import { Link, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Post() {


    return (
        <>
            <main id="post-page-holder">
                <section id="post-full">
                    <h1>Post Title</h1>
                    <p>Post Date</p>
                    <p>Post Content</p>
                </section>
                <section id="post-author-info">
                    <h2>Post Author</h2>
                    <p>About Author</p>
                </section>
            </main>
        </>
    )
}