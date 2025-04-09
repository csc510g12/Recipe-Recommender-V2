import React, { useState } from "react";
import {
    Input,
    Box,
    VStack,
    Text,
    Button,
    Center
} from "@chakra-ui/react";
import recipeDB from "../apis/recipeDB.js";
import { useAuth0 } from "@auth0/auth0-react";
import { IoMdAddCircleOutline } from "react-icons/io";
import "./css/imagebox.css";

const PostInput = () => {

    const { user } = useAuth0();

    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreview, setPreview] = useState();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length) {
            setSelectedFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleUploadImage = async () => {
        try {
            if (!selectedFile) return;

            const formData = new FormData();
            formData.append("image", selectedFile);

            const { data } = await recipeDB.post("/social/uploadImage", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setImageUrl(data.imageUrl);
        } catch (e) {
            console.error("Failed to upload image.", e);
        }
    };

    const handleCreatePost = async () => {
        if (!description.trim()) {
            alert("Description cannot be empty!");
            return;
        }
        if (!imageUrl) {
            alert("Please upload an image!");
            return;
        }

        try {
            await recipeDB.post("social/post", {
                userName: user.nickname,
                description: description,
                image: imageUrl,
            });

            alert("Posted!")
        } catch (e) {
            console.error("Failed to upload image.", e);
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
                <VStack spacing={4}>
                    <Text fontSize="x1" fontWeight="bold">
                        Create a new Post
                    </Text>
                </VStack>
                <div>
                    <div>
                        <img src={imagePreview} width="100%" />
                    </div>
                    <input 
                        type="file"
                        onChange={handleFileChange}
                    />
                    <Button onClick={handleUploadImage}>
                        Upload
                    </Button>
                </div>
                <form onSubmit={handleCreatePost}>
                    <Input 
                        placeholder="Post Description" 
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                    <Center>
                        <Button colorScheme="green" type="submit">
                            Post
                        </Button>
                    </Center>
                </form>
            </Box>
        </div>
    )
}

export default PostInput;