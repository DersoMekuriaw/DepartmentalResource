"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { addResource } from "../store/resourceSlice";
import { Input, Button, Select, Form, Card } from "antd";

const resourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  course: z.string().min(1, "Please select a course"),
  batch: z.string().optional(),
});

export default function AddResource() {
  const dispatch = useDispatch<AppDispatch>();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resourceSchema),
  });

  const onSubmit = (data: any) => {
    dispatch(addResource({ 
      ...data, 
      instructorId: 1, 
      status: "pending", 
      reviewerId: null, 
      likes: 0, 
      dislikes: 0, 
      comments: [] 
    }));
  };

  return (
    <Card title='Add New Resource' className="shadow-md m-2">
      <Form
        className="w-full p-4 bg-white"
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        {/* Title Field */}
        <Form.Item
          label="Title"
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message?.toString()}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Title" />}
          />
        </Form.Item>

        {/* Description Field */}
        <Form.Item
          label="Description"
          validateStatus={errors.description ? "error" : ""}
          help={errors.description?.message?.toString()}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Description" />}
          />
        </Form.Item>

        {/* Course Field */}
        <Form.Item
          label="Course"
          validateStatus={errors.course ? "error" : ""}
          help={errors.course?.message?.toString()}
        >
          <Controller
            name="course"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select a course">
                <Select.Option value="CS101">CS101</Select.Option>
                <Select.Option value="CS102">CS102</Select.Option>
              </Select>
            )}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
