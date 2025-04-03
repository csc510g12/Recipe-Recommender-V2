import React, { useState } from 'react';
import { 
    Text, 
    Box,
    Image,
    IconButton,
    Flex,
    VStack,
    HStack,
    Input
} from '@chakra-ui/react';
import { FaHeart, FaLocationArrow } from 'react-icons/fa';

const Social = () => {
    
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleLike = () => {
        setLikes(prevLikes => prevLikes + 1);
    }

    const handleComment = () => {
        if (!newComment.trim()) return;
        setComments([newComment, ...comments]);
        setNewComment('');
    }

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
                <Image
                    src=""
                    alt="Post Image"
                    objectFit="cover"
                    width="100%"
                    height="auto" 
                />
                <Flex alignItems="center" p={4}>
                    <IconButton
                        icon={<FaHeart />}
                        onClick={handleLike}
                        variant="ghost"
                        aria-label="Like"
                        mr={2} 
                    />
                    <Text>{likes} Likes</Text>
                </Flex>
                <Box px={4} pb={4}>
                    <VStack align="stretch" space={2}>
                        {comments.map((comment, index) => (
                            <Box key={index} bg="gray.100" p={2} borderRadius="md">
                                <Text>{comment}</Text>
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
