import React, { useState } from 'react';
import { 
    Text, 
    Box,
    Image,
    IconButton,
    Flex,
    VStack,
    HStack,
    Input,
} from '@chakra-ui/react';
import { FaHeart, FaLocationArrow } from 'react-icons/fa';
import recipeDB from "../apis/recipeDB.js";
import { useAuth0 } from "@auth0/auth0-react";

const Social = ({ post, onCommentSuccess }) => {

    const { user } = useAuth0();
    
    const [localPost, setLocalPost] = useState(post);
    const [newComment, setNewComment] = useState('');

    const handleComment = async () => {
        if (!newComment.trim()) return;
        try {
            await recipeDB.post("/social/post/addComment", {
                postId: localPost._id,
                userName: user.nickname,
                commentText: newComment
            });

            const updatedComments = [
                { userName: user.nickname, text: newComment },
                ...localPost.comments,
            ];

            setLocalPost({...localPost, comments: updatedComments});
            setNewComment("");
        } catch (e) {
            console.error("Failed to post comment", e);
        }
    };

    const handleLike = async () => {
        try {
            await recipeDB.post("/social/post/addLike", { postId: localPost._id });
            setLocalPost({ ...localPost, likes: (localPost.likes ?? 0) + 1 });
        } catch (e) {
            console.error("Failed to add like.");
        }
    };

    return (
        <div>
            <Box
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            maxW="md"
            mx="auto"
            mt={8}
            >
                {localPost.image && (
                    <Image
                        src={localPost.image}
                        alt="Post Image"
                        objectFit="cover"
                        width="100%"
                        height="auto" 
                    />
                )}
                <Box p={4}>
                    <Text fontWeight="bold">{localPost.userName}</Text>
                    <Text>{localPost.description}</Text>
                </Box>
                <Flex alignItems="center" p={4}>
                    <IconButton
                        icon={<FaHeart />}
                        onClick={handleLike}
                        variant="ghost"
                        aria-label="Like"
                        mr={2} 
                    />
                    <Text>{localPost.likes} Likes</Text>
                </Flex>
                <Box px={4} pb={4}>
                    <VStack align="stretch" space={2}>
                        {localPost.comments && localPost.comments.map((comment, index) => (
                            <Box key={index} bg="gray.100" p={2} borderRadius="md">
                                <Text>
                                    <strong>{comment.userName}: </strong>
                                    {comment.text}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>
                <Box px={4} pb={4}>
                    <HStack>
                        <Input
                            placeholder="Comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)} 
                        />
                        <IconButton
                            icon={<FaLocationArrow />}
                            onClick={handleComment} 
                        />
                    </HStack>
                </Box>
            </Box>
        </div>
    );
}

export default Social;
