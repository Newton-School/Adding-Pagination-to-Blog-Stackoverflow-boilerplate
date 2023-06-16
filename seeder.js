const fs = require("fs");
const Blog = require('./models/blog.js');
const User = require('./models/user.js');
const Comment = require('./models/comment.js');
const blog_list = JSON.parse(fs.readFileSync(`${__dirname}/./data/blogs.json`));

async function seedWithDummyData() {
    try {
        // CLEAR Dawait Subject.deleteMany({});
        await Blog.deleteMany({});
        await User.deleteMany({});
        await Comment.deleteMany({});
        const createdblog = await Blog.insertMany(blog_list);

        console.log(`${createdblog.length} blog created.`);
    } catch (error) {
        console.error(`Error seeding data: ${error}`);
        process.exit(1);
    }
}

module.exports = seedWithDummyData