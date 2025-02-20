"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources, assignReviewer } from "../store/resourceSlice";
import { RootState, AppDispatch } from "../store/store";
import { Table, Button, Select, Card } from "antd";

export default function AssignReviewer() {
  const dispatch = useDispatch<AppDispatch>();
  const { resources } = useSelector((state: RootState) => state.resources);
  const [reviewers, setReviewers] = useState([{ id: 2, name: "Reviewer 2" }]); // Fake reviewers

  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);

  const handleAssign = (resourceId: number, reviewerId: number) => {
    dispatch(assignReviewer({ resourceId, reviewerId }));
  };

  return (
      <Card title='Assign Resource Reviewers' className="shadow-md m-2">
        <Table dataSource={resources.filter(r => r.status === "pending")} rowKey="id">
          <Table.Column title="Title" dataIndex="title" key="title" />
          <Table.Column title="Course" dataIndex="course" key="course" />
          <Table.Column
            title="Assign Reviewer"
            key="assign"
            render={(resource) => (
              <Select
                placeholder="Select Reviewer"
                onChange={(value) => handleAssign(resource.id, value)}
              >
                {reviewers.map((reviewer) => (
                  <Select.Option key={reviewer.id} value={reviewer.id}>
                    {reviewer.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Table>
      </Card>
  );
}
