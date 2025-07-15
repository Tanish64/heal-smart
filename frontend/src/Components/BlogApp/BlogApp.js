import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../config/api';


function BlogApp() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({}); // per-blog comment input

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error.message);
    }
  };

  const createBlog = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/blogs', { title, content });
      setBlogs([res.data, ...blogs]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Failed to create blog:', error.message);
    }
  };

  const likeBlog = async (id) => {
    try {
      const res = await api.put(`/blogs/like/${id}`);
      setBlogs((prev) => prev.map((b) => (b._id === id ? res.data : b)));
    } catch (error) {
      console.error('Failed to like blog:', error.message);
    }
  };

  const addComment = async (id) => {
    const comment = commentInputs[id];
    if (!comment || !comment.trim()) return;
    try {
      const res = await api.post(`/blogs/comment/${id}`, { text: comment });
      setBlogs((prev) => prev.map((b) => (b._id === id ? res.data : b)));
      setCommentInputs((prev) => ({ ...prev, [id]: '' }));
    } catch (error) {
      console.error('Failed to comment:', error.message);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error('Failed to delete blog:', error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Container>
      <Heading>Create Blog</Heading>
      <Form onSubmit={createBlog}>
        
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit">Post</Button>
      </Form>

      <Heading>All Blogs</Heading>
      <BlogListWrapper>
      {blogs.map((blog) => (
        <BlogCard key={blog._id}>
          <BlogTitle>{blog.title}</BlogTitle>
          <BlogContent>{blog.content}</BlogContent>
          <BlogAuthor>Author: {blog.author?.name || 'Unknown'}</BlogAuthor>

          <BlogActions>
            <LikeButton onClick={() => likeBlog(blog._id)}>
              ❤️ {blog.likes?.length || 0}
            </LikeButton>
            <DeleteButton onClick={() => deleteBlog(blog._id)}>🗑️ Delete</DeleteButton>
          </BlogActions>

          <CommentSection>
            <CommentInput
              type="text"
              placeholder="Write a comment"
              value={commentInputs[blog._id] || ''}
              onChange={(e) =>
                setCommentInputs((prev) => ({ ...prev, [blog._id]: e.target.value }))
              }
            />
            <CommentButton onClick={() => addComment(blog._id)}>➕ Comment</CommentButton>
          </CommentSection>

          <CommentsList>
            {blog.comments?.length > 0 ? (
              blog.comments.map((c, i) => (
                <CommentItem key={i}>• {c.text}</CommentItem>
              ))
            ) : (
              <NoComments>No comments yet</NoComments>
            )}
          </CommentsList>
        </BlogCard>
      ))}
      </BlogListWrapper>
    </Container>
  );
}

// Styled Components
const BlogListWrapper = styled.div`
  max-height: 50vh; /* Adjust this value if needed */
  overflow-y: auto;
  padding-right: 0.5rem;
//   border-top: 2px solid #ddd6fe;
  margin-top: 1rem;

  /* Optional: smooth scrolling experience */
  scroll-behavior: smooth;

  /* Optional: styled scrollbar for modern browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    // background-color: #a78bfa;
    border-radius: 10px;
  }
`;

const Container = styled.div`
  padding: 1.5rem;
  max-width: 64rem;
  margin: 0 auto;
`;

const Heading = styled.h2`
  font-weight: 800;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #553C9A;
`;

const Form = styled.form`
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Input = styled.input`
  border: 1px solid #7c3aed;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.2s ease;

  &:focus {
    // box-shadow: 0 0 0 2px #8b5cf6;
    // border-color: #8b5cf6;
  }
`;

const Textarea = styled.textarea`
  border: 1px solid #7c3aed;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: box-shadow 0.2s ease;

  &:focus {
    // box-shadow: 0 0 0 2px #8b5cf6;
    border-color: #8b5cf6;
  }
`;

const Button = styled.button`
  background-color: #553C9A;
  color: white;
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
  border: none;
  max-width: fit-content;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #6d28d9;
  }
`;

const BlogCard = styled.div`
  border: 1px solid #c4b5fd;
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 6px rgb(0 0 0 / 0.15);
  }
`;

const BlogTitle = styled.h3`
  font-weight: 600;
  font-size: 1.5rem;
  color: #5b21b6;
  margin-bottom: 0.5rem;
`;

const BlogContent = styled.p`
  color: #27272a;
  white-space: pre-wrap;
  margin-bottom: 0.5rem;
`;

const BlogAuthor = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const BlogActions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const LikeButton = styled.button`
  color: #7c3aed;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border: none;
  background: none;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #4c1d95;
  }
`;

const DeleteButton = styled.button`
  color: #dc2626;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #991b1b;
  }
`;

const CommentSection = styled.div`
  margin-top: 1.25rem;
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #a78bfa;
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.2s ease;

  &:focus {
    box-shadow: 0 0 0 2px #8b5cf6;
    border-color: #8b5cf6;
  }
`;

const CommentButton = styled.button`
  margin-top: 0.5rem;
  color: #16a34a;
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #166534;
  }
`;

const CommentsList = styled.div`
  margin-top: 1rem;
  max-height: 8rem;
  overflow-y: auto;
  border-top: 1px solid #ddd6fe;
  padding-top: 0.75rem;
  color: #374151;
  font-size: 0.875rem;
`;

const CommentItem = styled.p`
  margin-bottom: 0.25rem;
`;

const NoComments = styled.p`
  color: #a1a1aa;
  font-style: italic;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  user-select: none;
`;

export default BlogApp;
