import React, { useState, useEffect } from "react";
import {
    Center,
    IconButton,
} from "@chakra-ui/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Social from "./Social.js";
import recpieDB from "../apis/recipeDB.js";

const SocialFeed = () => {

    const [posts, setPosts] = useState([]);

    const fetchPost = async () => {
        try {
            const response = await recpieDB.get("/social");
            setPosts(response.data);
        } catch (e) {
            console.error("Failed to fetch posts.", e);
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    const createPost = async () => {

    }

    return (
        <div>
            <Center>
                <IconButton
                    icon={<IoMdAddCircleOutline />}
                />
            </Center>
            {posts.map((post) => (
                <Social 
                    key={post._id}
                    post={post}
                    onCommentSuccess={fetchPost}
                />
            ))}
        </div>
    )
}

export default SocialFeed;