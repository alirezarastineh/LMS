import Image from "next/image";
import { format } from "timeago.js";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import socketIO from "socket.io-client";
import { styles } from "@/app/styles/styles";
import CoursePlayer from "@/app/utils/CoursePlayer";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import Ratings from "@/app/utils/Ratings";
import {
  getApiErrorMessage,
  type ICourse,
  type ICourseDataItem,
  type IQuestion,
  type IUser,
} from "@/app/types/lms";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI ?? "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type CourseContentMediaProps = {
  data: ICourseDataItem[];
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: IUser;
  refetch: () => void;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}: CourseContentMediaProps) => {
  const [activeBar, setActiveBar] = useState(0);

  const [question, setQuestion] = useState("");

  const [review, setReview] = useState("");

  const [rating, setRating] = useState(1);

  const [answer, setAnswer] = useState("");

  const [questionId, setQuestionId] = useState("");

  const [reply, setReply] = useState("");

  const [reviewId, setReviewId] = useState("");

  const [isReviewReply, setIsReviewReply] = useState(false);

  const [addNewQuestion, { isLoading: questionCreationLoading }] =
    useAddNewQuestionMutation();

  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
    id,
    { refetchOnMountOrArgChange: true },
  );

  const [addAnswerInQuestion, { isLoading: answerCreationLoading }] =
    useAddAnswerInQuestionMutation();

  const course = (courseData as { course?: ICourse } | undefined)?.course;

  const [addReviewInCourse, { isLoading: reviewCreationLoading }] =
    useAddReviewInCourseMutation();

  const [addReplyInReview, { isLoading: replyCreationLoading }] =
    useAddReplyInReviewMutation();

  const isReviewExists = course?.reviews?.find(
    (item) => item.user?._id === user._id,
  );

  const handleQuestion = async () => {
    if (question.length === 0) {
      toast.error("Question can't be empty");
      return;
    }
    try {
      await addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]?._id ?? "",
      }).unwrap();
      setQuestion("");
      refetch();
      socketId.emit("notification", {
        title: `New Question Received`,
        message: `You have a new question in ${data[activeVideo]?.title}`,
        userId: user._id,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleAnswerSubmit = async () => {
    try {
      await addAnswerInQuestion({
        answer,
        courseId: id,
        contentId: data[activeVideo]?._id ?? "",
        questionId,
      }).unwrap();
      setAnswer("");
      refetch();
      if (user.role !== "admin") {
        socketId.emit("notification", {
          title: `New Reply Received`,
          message: `You have a new reply in ${data[activeVideo]?.title}`,
          userId: user._id,
        });
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "An unexpected error occurred"));
    }
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review can't be empty");
      return;
    }
    try {
      await addReviewInCourse({ review, rating, courseId: id }).unwrap();
      setReview("");
      setRating(1);
      void courseRefetch();
      socketId.emit("notification", {
        title: `New Question Received`,
        message: `You have a new question in ${data[activeVideo]?.title}`,
        userId: user._id,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "An unexpected error occurred"));
    }
  };

  const handleReviewReplySubmit = async () => {
    if (!replyCreationLoading) {
      if (reply === "") {
        toast.error("Reply can't be empty");
        return;
      }
      try {
        await addReplyInReview({
          comment: reply,
          courseId: id,
          reviewId,
        }).unwrap();
        setReply("");
        void courseRefetch();
      } catch (error) {
        toast.error(getApiErrorMessage(error, "An unexpected error occurred"));
      }
    }
  };

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        title={data[activeVideo]?.title ?? ""}
        videoUrl={data[activeVideo]?.videoUrl ?? ""}
      />
      <div className="w-full flex items-center justify-between my-3">
        <button
          type="button"
          className={`${
            styles.button
          } text-white w-[unset]! min-h-10! py-[unset]! border-0 ${
            activeVideo === 0 && "cursor-no-drop! opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" />
          Prev Lesson
        </button>
        <button
          type="button"
          className={`${
            styles.button
          } w-[unset]! text-white min-h-10! py-[unset]! border-0 ${
            data.length - 1 === activeVideo && "cursor-no-drop! opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && data.length - 1 === activeVideo
                ? activeVideo
                : activeVideo + 1,
            )
          }
        >
          Next Lesson
          <AiOutlineArrowRight className="ml-2" />
        </button>
      </div>
      <h1 className="pt-2 text-[25px] font-semibold dark:text-white text-black">
        {data[activeVideo]?.title}
      </h1>
      <br />
      <div className="w-full p-4 flex items-center justify-between bg-slate-500/20 backdrop-blur-sm shadow-inner rounded-sm">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <button
            type="button"
            key={text}
            className={`800px:text-[20px] cursor-pointer bg-transparent border-0 p-0 ${
              activeBar === index
                ? "text-red-500"
                : "dark:text-white text-black"
            }`}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </button>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <p className="text-[18px] whitespace-pre-line mb-3 dark:text-white text-black">
          {data[activeVideo]?.description}
        </p>
      )}

      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links.map((item) => (
            <div
              className="mb-5"
              key={item.clientId ?? `${item.title}-${item.url}`}
            >
              <h2 className="800px:text-[20px] 800px:inline-block dark:text-white text-black">
                {item.title && `${item.title} :`}
              </h2>
              <a
                className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2"
                href={item.url}
              >
                {item.url}
              </a>
            </div>
          ))}
        </div>
      )}

      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={
                user.avatar
                  ? user.avatar.url
                  : "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png"
              }
              width={50}
              height={50}
              alt=""
              className="size-12.5 rounded-full object-cover"
            />
            <textarea
              name=""
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              id=""
              cols={40}
              rows={5}
              placeholder="Write your question..."
              className="outline-hidden bg-transparent ml-3 border dark:text-white text-black border-[#0000001d] dark:border-[#ffffff57] 800px:w-full p-2 rounded-sm w-[90%] 800px:text-[18px] font-Poppins"
            />
          </div>
          <div className="w-full flex justify-end">
            <button
              type="button"
              disabled={questionCreationLoading}
              className={`${
                styles.button
              } w-30! h-10! text-[18px] mt-5 border-0 ${
                questionCreationLoading && "cursor-not-allowed"
              }`}
              onClick={
                questionCreationLoading
                  ? undefined
                  : () => {
                      void handleQuestion();
                    }
              }
            >
              Submit
            </button>
          </div>
          <br />
          <br />
          <div className="w-full h-px bg-[#ffffff3b]" />
          <div>
            <CommentReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={() => {
                void handleAnswerSubmit();
              }}
              questionId={questionId}
              setQuestionId={setQuestionId}
              answerCreationLoading={answerCreationLoading}
            />
          </div>
        </>
      )}

      {activeBar === 3 && (
        <div className="w-full">
          {!isReviewExists && (
            <>
              <div className="flex w-full">
                <Image
                  src={
                    user.avatar
                      ? user.avatar.url
                      : "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png"
                  }
                  width={50}
                  height={50}
                  alt=""
                  className="size-12.5 rounded-full object-cover"
                />
                <div className="w-full">
                  <h5 className="pl-3 text-[20px] font-medium dark:text-white text-black">
                    Give a Rating <span className="text-red-500">*</span>
                  </h5>
                  <div className="flex w-full ml-2 pb-3">
                    {[1, 2, 3, 4, 5].map((i) =>
                      rating >= i ? (
                        <AiFillStar
                          key={i}
                          className="mr-1 cursor-pointer"
                          color="rgb(246,186,0)"
                          size={25}
                          onClick={() => setRating(i)}
                        />
                      ) : (
                        <AiOutlineStar
                          key={i}
                          className="mr-1 cursor-pointer"
                          color="rgb(246,186,0)"
                          size={25}
                          onClick={() => setRating(i)}
                        />
                      ),
                    )}
                  </div>
                  <textarea
                    name=""
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    id=""
                    cols={40}
                    rows={5}
                    placeholder="Write your comment..."
                    className="outline-hidden bg-transparent 800px:ml-3 dark:text-white text-black border border-[#00000027] dark:border-[#ffffff57] w-[95%] 800px:w-full p-2 rounded-sm text-[18px] font-Poppins"
                  />
                </div>
              </div>
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  disabled={reviewCreationLoading}
                  className={`${
                    styles.button
                  } w-30! h-10! text-[18px] mt-5 800px:mr-0 mr-2 border-0 ${
                    reviewCreationLoading && "cursor-no-drop"
                  }`}
                  onClick={
                    reviewCreationLoading
                      ? undefined
                      : () => {
                          void handleReviewSubmit();
                        }
                  }
                >
                  Submit
                </button>
              </div>
            </>
          )}
          <br />
          <div className="w-full h-px bg-[#ffffff3b]" />
          <div className="w-full">
            {(course?.reviews && [...course.reviews].reverse())?.map(
              (item, index: number) => {
                return (
                  <div
                    className="w-full my-5 dark:text-white text-black"
                    key={item._id ?? index}
                  >
                    <div className="w-full flex">
                      <div>
                        <Image
                          src={
                            item.user?.avatar
                              ? item.user.avatar.url
                              : "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="size-12.5 rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-2">
                        <h1 className="text-[18px]">{item.user?.name}</h1>
                        <Ratings rating={item.rating} />
                        <p>{item.comment}</p>
                        <small className="text-[#0000009e] dark:text-[#ffffff83]">
                          {item.createdAt ? format(item.createdAt) : ""} •
                        </small>
                      </div>
                    </div>
                    {user.role === "admin" &&
                      (item.commentReplies ?? []).length === 0 && (
                        <button
                          type="button"
                          className={`${styles.label} ml-10! cursor-pointer bg-transparent border-0 p-0`}
                          onClick={() => {
                            setIsReviewReply(true);
                            setReviewId(item._id);
                          }}
                        >
                          Add Reply
                        </button>
                      )}

                    {isReviewReply && reviewId === item._id && (
                      <div className="w-full flex relative">
                        <input
                          type="text"
                          placeholder="Enter your reply..."
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          className="block 800px:ml-12 mt-2 outline-hidden bg-transparent border-b border-black dark:border-white p-1.25 w-[95%]"
                        />
                        <button
                          type="submit"
                          className="absolute right-0 bottom-1"
                          onClick={() => {
                            void handleReviewReplySubmit();
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    )}

                    {item.commentReplies?.map((i, replyIndex: number) => (
                      <div
                        className="w-full flex 800px:ml-16 my-5"
                        key={i._id ?? replyIndex}
                      >
                        <div className="size-12.5">
                          <Image
                            src={
                              i.user?.avatar
                                ? i.user.avatar.url
                                : "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="size-12.5 rounded-full object-cover"
                          />
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[20px]">{i.user?.name}</h5>{" "}
                            <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                          </div>
                          <p>{i.comment}</p>
                          <small className="text-[#ffffff83]">
                            {i.createdAt ? format(i.createdAt) : ""} •
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}
    </div>
  );
};

type CommentReplyProps = {
  data: ICourseDataItem[];
  activeVideo: number;
  answer: string;
  setAnswer: (answer: string) => void;
  handleAnswerSubmit: () => void;
  questionId: string;
  setQuestionId: (questionId: string) => void;
  answerCreationLoading: boolean;
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}: CommentReplyProps) => {
  return (
    <div className="w-full my-3">
      {data[activeVideo]?.questions?.map((item, index) => (
        <CommentItem
          key={item._id ?? index}
          item={item}
          answer={answer}
          setAnswer={setAnswer}
          questionId={questionId}
          setQuestionId={setQuestionId}
          handleAnswerSubmit={handleAnswerSubmit}
          answerCreationLoading={answerCreationLoading}
        />
      ))}
    </div>
  );
};

type CommentItemProps = {
  questionId: string;
  setQuestionId: (questionId: string) => void;
  item: IQuestion;
  answer: string;
  setAnswer: (answer: string) => void;
  handleAnswerSubmit: () => void;
  answerCreationLoading: boolean;
};

const CommentItem = ({
  questionId,
  setQuestionId,
  item,
  answer,
  setAnswer,
  handleAnswerSubmit,
  answerCreationLoading,
}: CommentItemProps) => {
  const [replyActive, setReplyActive] = useState(false);
  const closedReplyLabel =
    item.questionReplies.length === 0 ? "Add Reply" : "All Replies";
  const replyToggleLabel = replyActive ? "Hide Replies" : closedReplyLabel;

  return (
    <div className="my-4">
      <div className="flex mb-2">
        <div>
          <Image
            src={
              item.user?.avatar
                ? item.user.avatar.url
                : "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png"
            }
            width={50}
            height={50}
            alt=""
            className="size-12.5 rounded-full object-cover"
          />
        </div>
        <div className="pl-3 dark:text-white text-black">
          <h5 className="text-[20px]">{item.user?.name}</h5>
          <p>{item.question}</p>
          <small className="text-[#000000b8] dark:text-[#ffffff83]">
            {item.createdAt ? format(item.createdAt) : ""} •
          </small>
        </div>
      </div>
      <div className="w-full flex">
        <button
          type="button"
          className="800px:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2 bg-transparent border-0 p-0"
          onClick={() => {
            setReplyActive(!replyActive);
            setQuestionId(item._id);
          }}
        >
          {replyToggleLabel}
        </button>
        <BiMessage
          size={20}
          className="dark:text-[#ffffff83] cursor-pointer text-[#000000b8]"
        />
        <span className="pl-1 -mt-1 cursor-pointer text-[#000000b8] dark:text-[#ffffff83]">
          {item.questionReplies.length}
        </span>
      </div>

      {replyActive && questionId === item._id && (
        <>
          {item.questionReplies.map((replyItem, replyIndex) => (
            <div
              className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
              key={replyItem._id ?? replyIndex}
            >
              <div>
                <Image
                  src={
                    replyItem.user?.avatar
                      ? replyItem.user.avatar.url
                      : "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293133/Avatars/avatar_dwjgxo.png"
                  }
                  width={50}
                  height={50}
                  alt=""
                  className="size-12.5 rounded-full object-cover"
                />
              </div>
              <div className="pl-3">
                <div className="flex items-center">
                  <h5 className="text-[20px]">{replyItem.user?.name}</h5>{" "}
                  {replyItem.user?.role === "admin" && (
                    <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                  )}
                </div>
                <p>{replyItem.answer}</p>
                <small className="text-[#ffffff83]">
                  {replyItem.createdAt ? format(replyItem.createdAt) : ""} •
                </small>
              </div>
            </div>
          ))}
          <>
            <div className="w-full flex relative dark:text-white text-black">
              <input
                type="text"
                placeholder="Enter your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={`block 800px:ml-12 mt-2 outline-hidden bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-white p-1.25 w-[95%] ${
                  answer === "" ||
                  (answerCreationLoading && "cursor-not-allowed")
                }`}
              />
              <button
                type="submit"
                className="absolute right-0 bottom-1"
                onClick={handleAnswerSubmit}
                disabled={answer === "" || answerCreationLoading}
              >
                Submit
              </button>
            </div>
            <br />
          </>
        </>
      )}
    </div>
  );
};

export default CourseContentMedia;
