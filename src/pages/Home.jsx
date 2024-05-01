import { Link, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PostCard } from '../components/PostCard';

export function Home() {


    return (
        <>
            <main id="blog-preview">
                <h1>blah</h1>
                <PostCard />
            </main>
        </>
    )
}