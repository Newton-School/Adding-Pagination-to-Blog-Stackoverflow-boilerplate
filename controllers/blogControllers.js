const Blog   = require("../models/blog.js");
const Comment= require("../models/comment.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'NEWTONSCHOOL';


/*

modify getAllBlog

query will be of type name,tags,limit,offset.
all ready name and tags filter are added.

First Filter is done on the basis of name and tags and later on Pagination is added to the filter output.

add limit and offset filter to pipeline.
default limit if 3 and offset is 0.

/api/v1/blog/?limit=5
will return first 5 blog

/api/v1/blog/?offset=2
will return first from blog 7 to 9. (Will skip first 6 blog)

/api/v1/blog/?limit=5&offset=2
will return first from blog 11 to 15. (Will skip first 10 blog)

*/


const getAllBlog =async (req, res) => {

    const name = req.query.name;
    const tags = req.query.tags;

    //Modify the code and pipeline
    
    let pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "creator_id",
          foreignField: "_id",
          as: "creator"
        }
      }
    ];
    
    if (name) {
      pipeline.push({
        $match: {
          "creator.name": { $regex: name, $options: "i" }
        }
      });
    }
    
    if (tags) {
      pipeline.push({
        $match: {
          tags: { $regex: tags, $options: "i" }
        }
      });
    }

    pipeline.push(
        { $skip: offset*limit }, // as we need to skip first offset pages and each pages contain limit number of blogs.
        { $limit: limit } // Limit the number of documents to the specified limit
      )
    
    const allBlog = await Blog.aggregate(pipeline);

    res.status(200).json({
        status: "success",
        data: allBlog
    })
   
}

const createBlog = async (req, res) => {

    const {heading, body, tags, token } = req.body;
    try{
        if(!token){
            res.status(401).json({
                status: 'fail',
                message: 'Missing token'
            });
        }
        let decodedToken;
        try{
            decodedToken = jwt.verify(token, JWT_SECRET);
        }catch(err){
            res.status(401).json({
                status: 'fail',
                message: 'Invalid token'
            });
        }
        const newBlog = {
            heading,
            body,
            tags,
            creator_id : decodedToken.userId
        };
        const blog = await Blog.create(newBlog);
        res.status(200).json({
            message: 'Blog added successfully',
            blog_id: blog._id,
            status: 'success'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

/*

Modify deleteBlog Controller


1. delete the blog with given id in req.params.
2. Also delete all the comment that belong to given blog.
3. To delete comment understand the comment model and how it is link to blog by looking the project.

Response --> 

1. Success

200 Status code
json = {
  status: 'success',
  message: 'Blog deleted successfully'
}

2. Blog Doesnot exist

404 Status Code
json = {
    status: 'fail',
    message: 'Given Blog doesn't exist'
}

3. Something went wrong

500 Status Code
json = {
    status: 'fail',
    message: error message
}

*/


const deleteBlog = async (req, res) => {

    const id = req.params.id;

    const blog = await Blog.findById(id);
    if(!blog)
    {
        res.status(404).json({
            status: 'fail',
            message: "Given Blog doesn't exist"
        })
    }

    try{
        await Blog.findByIdAndDelete(id);
        const comments = await Comment.find({blogId : id});
        for(let i=0;i<comments.length;i++){
            await Comment.findByIdAndDelete(comments[i]._id);
        }
        res.status(200).json({
            status: 'success',
            message: 'Blog deleted successfully'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

const updateBlog = async (req, res) => {

    const id = req.params.id;

    const blog = await Blog.findById(id);
    if(!blog)
    {
        res.status(404).json({
            status: 'fail',
            message: "Given Blog doesn't exist"
        })
    }

    try{
        await Blog.findByIdAndUpdate(id, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Blog updated successfully'
        })
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    };

}

/*

getBlog Controller

Get the blog with given id in req.params.
The blog should contain an Array of comments object for that blog.
The comment object should contain _id, content, authorId, and blogId for every comment for that Blog.
Response --> 

1. Success

200 Status code
json = {
  status: 'success',
  data: {
    heading,
    body,
    creator_id,
    tags,
    comments:[
        {
            _id,
            content,
            authorId,
            blogId
        }
    ]
  }
}

2. Blog Doesnot exist

404 Status Code
json = {
    status: 'fail',
    message: "Given Blog doesn't exist"
}

3. Something went wrong

500 Status Code
json = {
    status: 'fail',
    message: 'Something went Wrong'
}

*/

const getBlog = async (req, res) => {

    const id = req.params.id;

    try{
        var blog = await Blog.findById(id);
        if(!blog)
        {
            res.status(404).json({
                status: 'fail',
                message: "Given Blog doesn't exist"
            })
        }
        const comments = await Comment.find({blogId : id});
        blog = blog.toObject();
        blog['comments'] = comments;
        res.status(200).json({
            status: 'success',
            data: blog
        })
    }catch(err){
        res.status(200).json({
            status: 'fail',
            message: "Something went Wrong"
        })
    }

}

module.exports = { getAllBlog, getBlog, createBlog, deleteBlog, updateBlog };
