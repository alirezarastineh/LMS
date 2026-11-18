import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface ICommentReply {
  user?: IUser;
  answer?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IComment {
  _id?: mongoose.Types.ObjectId;
  user?: IUser;
  question: string;
  questionReplies: ICommentReply[];
}

export interface IReview {
  _id?: mongoose.Types.ObjectId;
  user?: IUser;
  rating?: number;
  comment: string;
  commentReplies?: ICommentReply[];
}

export interface ILink {
  title: string;
  url: string;
}

export interface ICourseData {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

export interface ICourse extends Document {
  name: string;
  description: string;
  categories: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: {
    public_id?: string;
    url?: string;
  };
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased: number;
}

const reviewSchema = new Schema<IReview>(
  {
    user: Object,
    rating: { type: Number, default: 0 },
    comment: String,
    commentReplies: [Object],
  },
  { timestamps: true }
);

const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const commentSchema = new Schema<IComment>(
  {
    user: Object,
    question: String,
    questionReplies: [Object],
  },
  { timestamps: true }
);

const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    categories: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    estimatedPrice: { type: Number },

    thumbnail: {
      public_id: { type: String },
      url: { type: String },
    },

    tags: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    demoUrl: {
      type: String,
      required: true,
    },

    benefits: [{ title: String }],

    prerequisites: [{ title: String }],

    reviews: [reviewSchema],

    courseData: [courseDataSchema],

    ratings: {
      type: Number,
      default: 0,
    },

    purchased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;
