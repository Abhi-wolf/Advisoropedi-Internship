import axios from "axios";
import { useEffect, useState } from "react";
import { REACT_APP_BASE_URL } from "../../constants";

function Posts() {
  const [posts, setPosts] = useState({});

  useEffect(function () {
    async function getPosts() {
      const response = await axios.get(`${REACT_APP_BASE_URL}/posts/allPosts`);
      console.log(response.data.posts);
      setPosts(response.data.posts);
    }

    getPosts();
  }, []);

  return (
    <div className=" w-[90%] md:w-[80%] my-4 flex flex-col justify-center items-center overflow-hidden">
      <div className="py-3">
        <h1 className="text-2xl font-semibold underline underline-offset-4 text-gray-600">
          POSTS
        </h1>
      </div>
      <div className="py-2">
        {posts.length === 0 && (
          <p className="text-red-400 italic">No posts present</p>
        )}
      </div>
    </div>
  );
}

export default Posts;
