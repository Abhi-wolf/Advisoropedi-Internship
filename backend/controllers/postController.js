const Post = require("../model/postModel");

const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ ...req.query })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Post.countDocuments();

    return res.status(200).json({
      posts,
      totalPage: Math.ceil(count / limit),
      currentPage: page * 1,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getPosts };
