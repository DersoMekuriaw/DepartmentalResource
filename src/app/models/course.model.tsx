export interface Course {
    id: string;
    courseTitle: string;
    courseCode: string;
    yearOfOffering: {
      year: number;
      semester: number;
    };
  }