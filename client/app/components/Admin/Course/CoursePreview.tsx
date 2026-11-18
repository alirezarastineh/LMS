import { IoCheckmarkDoneOutline } from "react-icons/io5";
import CoursePlayer from "../../../utils/CoursePlayer";
import { styles } from "../../../../app/styles/styles";
import Ratings from "../../../../app/utils/Ratings";
import type { ICoursePayload, IEditCoursePayload } from "@/app/types/lms";

type CoursePreviewProps = {
  active: number;
  setActive: (active: number) => void;
  courseData: ICoursePayload | IEditCoursePayload | null;
  handleCourseCreate: () => void | Promise<void>;
  isEdit?: boolean;
};

const CoursePreview = ({
  active,
  setActive,
  courseData,
  handleCourseCreate,
  isEdit,
}: CoursePreviewProps) => {
  const price = Number(courseData?.price ?? 0);
  const estimatedPrice = Number(courseData?.estimatedPrice ?? 0);
  const dicountPercentenge =
    estimatedPrice > 0 ? ((estimatedPrice - price) / estimatedPrice) * 100 : 0;

  const discountPercentengePrice = dicountPercentenge.toFixed(0);

  const prevButton = () => {
    setActive(active - 1);
  };

  const createCourse = () => {
    void handleCourseCreate();
  };

  return (
    <div className="w-[90%] m-auto py-5 mb-5">
      <div className="w-full relative">
        <div className="w-full mt-10">
          <CoursePlayer
            videoUrl={courseData?.demoUrl ?? ""}
            title={courseData?.name ?? ""}
          />
        </div>

        <div className="flex items-center">
          <h1 className="pt-5 text-[25px]">
            {price === 0 ? "Free" : `${courseData?.price}€`}
          </h1>

          <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80">
            {courseData?.estimatedPrice}€
          </h5>

          <h4 className="pl-5 pt-4 text-[22px]">
            {discountPercentengePrice}% Off
          </h4>
        </div>

        <div className="flex items-center">
          <div
            className={`${styles.button} w-45! my-3 font-Poppins bg-[crimson]! cursor-not-allowed`}
          >
            Buy Now {courseData?.price}€
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="text"
            name=""
            id=""
            placeholder="Discount code..."
            className={`${styles.input} 1500px:w-[50%]! 1100px:w-[60%] ml-3 mt-0!`}
          />

          <div
            className={`${styles.button} w-30! my-3 ml-4 font-Poppins cursor-pointer`}
          >
            Apply
          </div>
        </div>

        <p className="pb-1">• Source code included</p>

        <p className="pb-1">• Full lifetime access</p>

        <p className="pb-1">• Certificate of completion</p>

        <p className="pb-3 800px:pb-1">• Premium Support</p>
      </div>

      <div className="w-full">
        <div className="w-full 800px:pr-5">
          <h1 className="text-[25px] font-Poppins font-semibold">
            {courseData?.name}
          </h1>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center">
              <Ratings rating={0} />

              <h5>0 Reviews</h5>
            </div>

            <h5>0 Students</h5>
          </div>
          <br />
          <h1 className="text-[25px] font-Poppins font-semibold">
            What you will learn from this course?
          </h1>
        </div>

        {courseData?.benefits?.map((item) => (
          <div className="w-full flex 800px:items-center py-2" key={item.title}>
            <div className="w-3.75 mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>

            <p className="pl-2">{item.title}</p>
          </div>
        ))}
        <br />
        <br />
        <h1 className="text-[25px] font-Poppins font-semibold">
          What are the prerequisites for starting this course?
        </h1>

        {courseData?.prerequisites?.map((item) => (
          <div className="w-full flex 800px:items-center py-2" key={item.title}>
            <div className="w-3.75 mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>

            <p className="pl-2">{item.title}</p>
          </div>
        ))}
        <br />
        <br />
        <div className="w-full">
          <h1 className="text-[25px] font-Poppins font-semibold">
            Course Details
          </h1>

          <p className="text-[18px] mt-5 whitespace-pre-line w-full overflow-hidden">
            {courseData?.description}
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          className="w-full 800px:w-45 flex items-center justify-center h-10 bg-[#37a39a] text-center text-white rounded-sm mt-8 cursor-pointer border-0"
          onClick={() => prevButton()}
        >
          Prev
        </button>

        <button
          type="button"
          className="w-full 800px:w-45 flex items-center justify-center h-10 bg-[#37a39a] text-center text-white rounded-sm mt-8 cursor-pointer border-0"
          onClick={() => createCourse()}
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
};

export default CoursePreview;
