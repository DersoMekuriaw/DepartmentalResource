"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchResources, likeResource, dislikeResource, addComment } from "../store/resourceSlice";
import { Card, Button, Input } from "antd";

export default function ResourceRepository() {

  const dispatch = useDispatch<AppDispatch>();
  const { resources } = useSelector((state: RootState) => state.resources);
  const [commentText, setCommentText] = useState("");
  const approvedResources = resources.filter((r) => r.status === "approved");

  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);

  return (
    <Card title='Departmental Resources' className="shadow-md m-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {approvedResources.map((resource) => (
          <div  key={resource.id} >
            <Card title={resource.resourceTitle} className="shadow-md">
              <p>{resource.description}</p>
              <p className="text-sm text-gray-500">Status: {resource.status}</p>
              <div className="mt-2">
                <Button onClick={() => dispatch(likeResource(resource.id))}>👍 {resource.likes}</Button>
                <Button onClick={() => dispatch(dislikeResource(resource.id))} className="ml-2">
                  👎 {resource.dislikes}
                </Button>
              </div>
              <div className="mt-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  className="mt-2"
                  onClick={() => {
                    dispatch(addComment({ id: resource.id, comment: { id: '', text: commentText, authorId: "Student",  timestamp: new Date().getTime().toLocaleString() } }));
                    setCommentText("");
                  }}
                >
                  Comment
                </Button>
              </div>
              <div className="mt-2">
                {(resource.comments || []).map((comment, index) => (
                  <p key={index} className="text-sm italic">💬 {comment.authorId}: {comment.text}</p>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </Card>
  );
}
