export interface Comment {
    id: string;
    text: string;
    authorId: string;
    timestamp: string;
  }
  
  export interface Attachment {
    id: string;
    file_name: string;
    file_type: string;
    path: string;
    timestamp: string;
    file_path: string;
  }
  
  export interface Resource {
    id: string;
    resourceTitle: string;
    description: string;
    attachments: Attachment[]; // Ensure this is defined as Attachment[]
    courseCode: string;
    status: "pending" | "approved" | "rejected";
    instructorId: string;
    reviewerId: number | null;
    likes: number;
    dislikes: number;
    comments: Comment[];
  }
  