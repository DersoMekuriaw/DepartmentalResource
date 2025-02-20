'use client';
import { ColumnType } from 'antd/es/table'; // Import ColumnType from Ant Design
import { useState } from 'react';
import { Table, Input, Button, Card, Pagination, Space, Modal, Tooltip, Form, Select, Upload, message } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, FullscreenOutlined, CloseOutlined, CompressOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { addResource } from '../store/resourceSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Attachment, Resource } from '../models/resources.model';


function sortData(resources: Resource[], search: string) {
  return resources.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );
}

const resourceSchema = z.object({
  courseCode: z.string().min(1, "Please select a course"),
  resourceTitle: z.string().min(3, "Resource title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  attachments: z.array(z.object({
    id: z.string(),
    file_name: z.string(),
    file_type: z.string(),
    path: z.string(),
    timestamp: z.string(),
    file_path: z.string()
  }))
});

export default function TableSort() {  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resourceSchema),
  });
  
  const dispatch = useDispatch<AppDispatch>();

  const {resources} = useSelector((state: RootState) => state.resources);
  const [fileList, setFileList] = useState<Attachment[]>([]);
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(resources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
    setSortedData(sortData(resources, value));
    setCurrentPage(1); // Reset to first page after search
  };

  const handleSort = (key: keyof Resource, order: "ascend" | "descend" | null) => {
    if (!order) return;
  
    const sorted = [...sortedData].sort((a, b) => {
      // Ensure that the values are not null or undefined
      if (a[key] == null && b[key] == null) return 0;
      if (a[key] == null) return order === "ascend" ? -1 : 1;
      if (b[key] == null) return order === "ascend" ? 1 : -1;
  
      // Now it's safe to compare non-null values
      if (a[key] < b[key]) return order === "ascend" ? -1 : 1;
      if (a[key] > b[key]) return order === "ascend" ? 1 : -1;
      return 0;
    });
  
    setSortedData(sorted);
  };
  

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleNewResource = () => {
    setSelectedResource(null);
    setFormData({ id: uuidv4(), title: '', description: '', attachments: [], courseCode: '' });
    setFileList([]);
  };

  const handleRowClick = (resource: Resource) => {
    setSelectedResource(resource);
    setFormData(resource);
    setFileList(resource.attachments || []);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

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
      message.success(selectedResource ? 'Resource updated successfully!' : 'Resource created successfully!');
      setSelectedResource(null);
      setFormData(null);
      setFileList([]);
    };

  const handleDelete = () => {
    if (!selectedResource) return;
    Modal.confirm({
      title: 'Are you sure you want to delete this resource?',
      onOk: () => {
        setSortedData((prev) => prev.filter((p) => p.id !== selectedResource.id));
        setSelectedResource(null);
        setFormData(null);
        setFileList([]);
      },
    });
  };

  const isEditing = formData !== null;

  const columns: ColumnType<Resource>[] = [
    {
      title: 'Resource Title',
      dataIndex: 'resourceTitle',
      key: 'resourceTitle',
      sorter: (a: Resource, b: Resource) => a.resourceTitle.localeCompare(b.resourceTitle),
      sortDirections: ['ascend', 'descend'],
      onHeaderCell: () => ({
        onClick: () => handleSort('resourceTitle', 'ascend'),
      }),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a: Resource, b: Resource) => a.description.localeCompare(b.description),
      sortDirections: ['ascend', 'descend'],
      onHeaderCell: () => ({
        onClick: () => handleSort('description', 'ascend'),
      }),
    },
    {
      title: 'Course Code',
      dataIndex: 'courseCode',
      key: 'courseCode',
      sorter: (a: Resource, b: Resource) => a.courseCode.localeCompare(b.courseCode),
      sortDirections: ['ascend', 'descend'],
      onHeaderCell: () => ({
        onClick: () => handleSort('courseCode', 'ascend'),
      }),
    },
  ];
  
  // Define the primaryColumn with the correct type
  const primaryColumn: ColumnType<Resource> = {
    title: 'Resource Title',
    dataIndex: 'resourceTitle',
    key: 'resourceTitle',
    sorter: (a: Resource, b: Resource) => a.resourceTitle.localeCompare(b.resourceTitle),
    sortDirections: ['ascend', 'descend'],
  };
  const currentPageData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <div className={`m-2 flex ${isEditing ? 'flex-col md:flex-row gap-2' : 'w-full'}`}>
        <div className={isEditing ? 'w-1/3' : 'w-full'}>
          <Card title="Departmental Resource" extra={<Button icon={<PlusOutlined />} onClick={handleNewResource}>New</Button>}>
            <Input
              placeholder="Search here"
              value={search}
              onChange={handleSearchChange}
              suffix={
                <Tooltip title="Search by any field">
                  <SearchOutlined />
                </Tooltip>
              }
            />

            <Table
              dataSource={currentPageData}
              rowKey="id"
              pagination={false}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                className: record.id === selectedResource?.id ? 'bg-blue-100 border-l-4 border-blue-500' : '',
              })}
              columns={formData ? [primaryColumn] : columns}
            />

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={sortedData.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['5', '10', '20']}
              className="mt-4 text-center"
            />
          </Card>
        </div>

        {formData && (
          <div className={isFullscreen ? 'w-full' : 'w-full'}>
            {isEditing && (
              <Card>
                <div className="flex flex-row justify-between items-center">
                  <p className="">{selectedResource ? selectedResource.resourceTitle : 'New Resource'}</p>
                  <div className="flex items-center space-x-2 ml-auto">
                    <Button onClick={() => setIsFullscreen(!isFullscreen)}>
                      {isFullscreen ? <CompressOutlined /> : <FullscreenOutlined />}
                    </Button>
                    <Button onClick={() => { setSelectedResource(null); setFormData(null); }}>
                      <CloseOutlined />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            <Card title={selectedResource ? 'Edit Resource' : 'New Resource'} className='mt-2'>
              <Form
                className="w-full p-4 bg-white"
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 22 }}
                onFinish={handleSubmit(onSubmit)}
                autoComplete="on"
              >

                {/* Course Field */}
                <Form.Item
                  label="Course"
                  validateStatus={errors.course ? "error" : ""}
                  help={errors.courseCode?.message?.toString()}
                >
                  <Controller
                    name="courseCode"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} placeholder="eg. Web Programming (CS101)">
                        <Select.Option value="CoSc2015">Fundamentals of Programming (CS101)</Select.Option>
                        <Select.Option value="CoSc3081">Web Programming</Select.Option>
                        <Select.Option value="CoSc3053">Java Programming</Select.Option>
                      </Select>
                    )}
                  />
                </Form.Item>

                {/* Title Field */}
                <Form.Item
                  label="Resource Title"
                  validateStatus={errors.resourceTitle ? "error" : ""}
                  help={errors.resourceTitle?.message?.toString()}
                >
                  <Controller
                    name="resourceTitle"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="eg. Lab Manual" />}
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
                    render={({ field }) => <Input {...field} placeholder="eg. Full course lab manual" />}
                  />
                </Form.Item>

                {/* Attachment Field */}
                <Form.Item
                  label="Attachment"
                  validateStatus={errors.attachments ? "error" : ""}
                  help={errors.attachments?.message?.toString()}
                >
                  <Upload
                    fileList={fileList.map((file) => ({
                      uid: file.id,
                      name: file.file_name,
                      status: 'done',
                      url: file.file_path,
                    }))}
                    beforeUpload={(file) => {
                      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
                      if (!allowedTypes.includes(file.type)) {
                        message.error("Only PDF, DOCX, and PPTX files are allowed!");
                        return Upload.LIST_IGNORE;
                      }
                      return true;
                    }}
                    onChange={({ fileList }) => {
                      setFileList(
                        fileList.map((file) => ({
                          id: file.uid,
                          file_name: file.name,
                          file_type: file.type || '',
                          path: file.url || '',
                          timestamp: new Date().toISOString(),
                          file_path: file.url || '',
                        }))
                      );
                    }}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>

                {/* Submit Button */}
                <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
                    <Button type="primary" htmlType="submit" className='mr-2'>
                      {selectedResource ? 'Update' : 'Save'}
                    </Button>
                    {selectedResource && <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDelete}>Delete</Button>}
                </Form.Item>
              </Form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
