export interface IAvatar {
  public_id?: string;
  url: string;
}

export interface IUserCourseRef {
  _id: string;
  courseId?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: IAvatar;
  courses: IUserCourseRef[];
  createdAt?: string;
}

export interface ICourseLink {
  clientId?: string;
  title: string;
  url: string;
}

export interface ICourseTextItem {
  clientId?: string;
  title: string;
}

export interface IQuestionReply {
  _id?: string;
  user?: IUser;
  answer?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IQuestion {
  _id: string;
  user?: IUser;
  question: string;
  questionReplies: IQuestionReply[];
  createdAt?: string;
}

export interface IReview {
  _id: string;
  user?: IUser;
  rating: number;
  comment: string;
  commentReplies?: IQuestionReply[];
  createdAt?: string;
}

export interface ICourseDataItem {
  _id?: string;
  clientId?: string;
  videoUrl: string;
  title: string;
  videoSection: string;
  description: string;
  videoLength?: string | number;
  links: ICourseLink[];
  suggestion?: string;
  tags?: string;
  questions?: IQuestion[];
}

export interface ICourseFormInfo {
  name: string;
  description: string;
  categories?: string;
  price: string | number;
  estimatedPrice: string | number;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail: string;
}

export interface ICoursePayload {
  name: string;
  description: string;
  categories?: string;
  price: string | number;
  estimatedPrice?: string | number;
  tags: string;
  thumbnail: string;
  level: string;
  demoUrl: string;
  totalVideos: number;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  courseData: ICourseDataItem[];
}

export interface IEditCoursePayload
  extends Omit<ICoursePayload, "courseData"> {
  courseContent: ICourseDataItem[];
}

export interface ICourse {
  _id: string;
  name: string;
  description: string;
  categories?: string;
  price: number;
  estimatedPrice?: number;
  thumbnail?: IAvatar;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseDataItem[];
  ratings?: number;
  purchased?: number;
  createdAt?: string;
}

export interface INotification {
  _id: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface IOrder {
  _id: string;
  courseId: string;
  userId: string;
  createdAt: string;
}

export interface IAnalyticsPoint {
  month: string;
  count: number;
}

export interface IFaqItem {
  _id?: string;
  question: string;
  answer: string;
  active?: boolean;
}

export interface ICategoryItem {
  _id?: string;
  title: string;
}

export interface IBannerData {
  title?: string;
  subtitle?: string;
  image?: {
    public_id?: string;
    url?: string;
  };
}

export interface ILayout {
  _id?: string;
  type: string;
  faq?: IFaqItem[];
  categories?: ICategoryItem[];
  banner?: IBannerData;
}

let nextClientId = 0;

export function createClientId(prefix = "item"): string {
  nextClientId += 1;
  return `${prefix}-${nextClientId}`;
}

export function resolveNonEmpty(
  value: string | null | undefined,
  fallback: string
): string {
  return value && value.length > 0 ? value : fallback;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: unknown }).data === "object" &&
    (error as { data?: unknown }).data !== null &&
    "message" in (error as { data: Record<string, unknown> }).data
  ) {
    const message = (error as { data: { message?: unknown } }).data.message;
    if (typeof message === "string" && message.trim() !== "") {
      return message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
