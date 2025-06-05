
export type CourseStatus = "active" | "inactive" | "coming_soon";

export interface Course {
  id: string;
  courseId: string;
  name: string;
  status: CourseStatus;
  platform: string;
  platformLink: string;
  salesPageLink: string;
  accessPeriod: number;
  price: number;
  createdAt: string;
}
