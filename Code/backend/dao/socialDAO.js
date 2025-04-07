import mongodb from "mongodb";

let social;

export default class SocialDAO {
    static async injectDB(conn) {
        if (social) {
            return;
        } try {
            social = await conn
                .db(process.env.RECIPES_NS)
                .collection("social");
        } catch (e) {
            console.error(`Unable to establish a collection handle in socialDAO: ${e}`);
        }
    }

    static async getFeed() {
        try {
            const cursor = await social.find().sort({ createdAt: - 1 });
            return await cursor.toArray();
        } catch (e) {
            console.error("Error getting feed.");
            return [];
        }
    }

    static async getPostId(id) {
        try {
            const objectId = new mongodb.ObjectId(id);
            return await social.findOne({ _id: objectId });
        } catch(e) {
            console.error("Error getting post id.");
            return { error: e };
        }
    }

    static async createPost({ userName, image, description }) {
        try {
            const postDoc = {
                userName: userName,
                image: image,
                description: description,
                comments: [],
                createdAt: new Date(),
            };
            return await social.insertOne(postDoc);
        } catch (e) {
            console.error("Error creating post.");
            return { error: e};
        }
    }

    static async addComment(postId, { userName, commentText }) {
        try {
            const objectId = new mongodb.ObjectId(postId);
            const newComment = {
                _id: new mongodb.ObjectId(),
                userName: userName,
                text: commentText,
                createdAt: new Date(),
            };

            const updateResponse = await social.updateOne(
                { _id: objectId },
                { $push: { comments: newComment } } 
            );
            return updateResponse;
        } catch (e) {
            console.error("Error posting comment.");
            return { error: e };
        }
    }
}