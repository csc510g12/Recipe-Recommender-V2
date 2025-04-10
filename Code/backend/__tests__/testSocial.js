// testSocial.js
const request = require("supertest")("http://localhost:3003/api/v1/social");
const expect = require("chai").expect;

describe("Social Endpoints Test", function () {
  let createdPostId;

  // Test retrieving all posts (the feed).
  describe("GET / (apiGetAllPosts)", function () {
    it("should get the feed of posts and return 200", async function () {
      const res = await request.get("/");
      expect(res.status).to.eql(200);
    });

    it("should return an array or empty array if no posts are found", async function () {
      const res = await request.get("/");
      expect(res.status).to.eql(200);
      expect(res.body).to.be.an("array");
    });

    it("should respond quickly (under 2 seconds)", async function () {
      const start = Date.now();
      const res = await request.get("/");
      const duration = Date.now() - start;
      expect(res.status).to.eql(200);
      expect(duration).to.be.lessThan(2000);
    });
  });

  // Test creating a new post.
  describe("POST /post (apiCreatePost)", function () {
    it("should create a new post and return 200", async function () {
      const newPost = {
        userName: "testUser",
        image: "http://fakeimage.com/test.png",
        description: "This is a test post",
      };
      const res = await request.post("/post").send(newPost);
      expect(res.status).to.eql(200);
      expect(res.body).to.have.property("acknowledged").that.is.true;
      createdPostId = res.body.insertedId; 
    });
  });

  // Test adding a comment to a post.
  describe("POST /post/addComment (apiAddComments)", function () {
    it("should add a comment to the post and return 200", async function () {
      if (!createdPostId) this.skip();

      const res = await request.post("/post/addComment").send({
        postId: createdPostId,
        userName: "testCommenter",
        commentText: "Nice post!",
      });
      expect(res.status).to.eql(200);
    });
  });

  // Test incrementing likes.
  describe("POST /post/addLike (apiAddLike)", function () {
    it("should add a like to the post and return 200", async function () {
      if (!createdPostId) this.skip();

      const res = await request.post("/post/addLike").send({ postId: createdPostId });
      expect(res.status).to.eql(200);
    });
  });

  describe("POST /uploadImage", function() {
    it("should upload an image file and return the image URL", async function () {
        const path = require("path");
        const testImagePath = path.join(__dirname, "testImages", "test.png");

        const res = await request
            .post("/uploadImage")
            .attach("image", testImagePath);

        expect(res.status).to.eql(200);
        expect(res.body).to.have.property("imageUrl");
    });
  });
});
