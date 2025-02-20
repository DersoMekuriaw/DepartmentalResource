"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources, reviewResource } from "../store/resourceSlice";
import { RootState, AppDispatch } from "../store/store";
import { Table, Button } from "antd";

export default function ReviewPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { resources } = useSelector((state: RootState) => state.resources);

  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);

  const handleReview = (resourceId: number, status: "approved" | "rejected") => {
    dispatch(reviewResource({ resourceId, status }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl">Review Pending Resources</h1>
      <Table dataSource={resources.filter((r) => r.status === "pending")} rowKey="id">
        <Table.Column title="Title" dataIndex="title" key="title" />
        <Table.Column title="Course" dataIndex="course" key="course" />
        <Table.Column title="Instructor ID" dataIndex="instructorId" key="instructorId" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(resource) => (
            <div className="flex gap-2">
              <Button type="primary" onClick={() => handleReview(resource.id, "approved")}>✅ Approve</Button>
              <Button danger onClick={() => handleReview(resource.id, "rejected")}>❌ Reject</Button>
            </div>
          )}
        />
      </Table>
    </div>
  );
}
