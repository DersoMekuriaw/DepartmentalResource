import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../app/store/courseSlice";
import { AppDispatch, RootState } from "../app/store/store";
import { Form, Select } from "antd";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface CourseDropdownProps {
    control: Control<any>; // Define the type for control
    errors: FieldErrors<any>; // Define the type for errors
  }
const CourseDropdown = ({ control, errors }: CourseDropdownProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Form.Item
      label="Course"
      validateStatus={errors.courseCode ? "error" : ""}
      help={errors.courseCode?.message?.toString()}
    >
      <Controller
        name="courseCode"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            showSearch
            placeholder="Select a course"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          >
            {courses.map((course) => (
              <Select.Option key={course.id} value={course.courseCode} label={`${course.courseCode} - ${course.courseTitle}`}>
                {course.courseCode} - {course.courseTitle}
              </Select.Option>
            ))}
          </Select>
        )}
      />
    </Form.Item>
  );
};

export default CourseDropdown;