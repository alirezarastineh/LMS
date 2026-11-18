import {
  type ChangeEvent,
  type DragEvent,
  type SubmitEvent,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { styles } from "@/app/styles/styles";
import type { ICategoryItem, ICourseFormInfo } from "@/app/types/lms";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

type CourseInformationProps = {
  courseInfo: ICourseFormInfo;
  setCourseInfo: (courseInfo: ICourseFormInfo) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}: CourseInformationProps) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data } = useGetHeroDataQuery("Categories", {});

  const categories: ICategoryItem[] =
    (data as { layout?: { categories?: ICategoryItem[] } } | undefined)?.layout
      ?.categories ?? [];

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const readThumbnailFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readThumbnailFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      readThumbnailFile(file);
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit} className={`${styles.label}`}>
        <div>
          <label htmlFor="name">Course Name</label>

          <input
            type="name"
            name=""
            required
            value={courseInfo.name}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            id="name"
            placeholder="MERN stack LMS platform with next 14"
            className={`
            ${styles.input}`}
          />
        </div>
        <br />
        <div className="mb-5">
          <label htmlFor="description" className={`${styles.label}`}>
            Course Description
          </label>

          <textarea
            name=""
            id="description"
            cols={30}
            rows={8}
            placeholder="Write something amazing..."
            className={`${styles.input} h-min! py-2!`}
            value={courseInfo.description}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          />
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="price" className={`${styles.label}`}>
              Course Price
            </label>

            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              id="price"
              placeholder="29"
              className={`
            ${styles.input}`}
            />
          </div>

          <div className="w-[50%]">
            <label htmlFor="estimatedPrice" className={`${styles.label} w-[50%]`}>
              Estimated Price (optional)
            </label>

            <input
              type="number"
              name=""
              value={courseInfo.estimatedPrice}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="estimatedPrice"
              placeholder="79"
              className={`
            ${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${styles.label}`} htmlFor="tags">
              Course Tags
            </label>

            <input
              type="text"
              required
              name=""
              value={courseInfo.tags}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, tags: e.target.value })
              }
              id="tags"
              placeholder="MERN,Next 13,Socket io,tailwind css,LMS"
              className={`
            ${styles.input}`}
            />
          </div>

          <div className="w-[50%]">
            <label htmlFor="categories" className={`${styles.label} w-[50%]`}>
              Course Categories
            </label>

            <select
              name=""
              id="categories"
              className={`${styles.input}`}
              value={courseInfo.categories ?? ""}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, categories: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((item, index) => (
                <option value={item.title} key={item._id ?? index}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label htmlFor="level" className={`${styles.label}`}>
              Course Level
            </label>

            <input
              type="text"
              name=""
              value={courseInfo.level}
              required
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              id="level"
              placeholder="Beginner/Intermediate/Expert"
              className={`
            ${styles.input}`}
            />
          </div>

          <div className="w-[50%]">
            <label htmlFor="demoUrl" className={`${styles.label} w-[50%]`}>
              Demo Url
            </label>

            <input
              type="text"
              name=""
              required
              value={courseInfo.demoUrl}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              id="demoUrl"
              placeholder="Demo URL"
              className={`
            ${styles.input}`}
            />
          </div>
        </div>
        <br />
        <div className="w-full">
          <label htmlFor="file" className="sr-only">
            Course thumbnail
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center cursor-pointer ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
          >
            {courseInfo.thumbnail ? (
              <Image
                src={courseInfo.thumbnail}
                alt=""
                layout="responsive"
                objectFit="cover"
                width={500}
                height={300}
                className="max-h-full w-full"
              />
            ) : (
              <span className="text-black dark:text-white">
                Drag and drop your thumbnail here or click to browse
              </span>
            )}
          </button>
        </div>
        <br />
        <div className="w-full flex items-center justify-end">
          <input
            type="submit"
            value="Next"
            className="w-full 800px:w-45 h-10 bg-[#37a39a] text-center text-white rounded-sm mt-8 cursor-pointer"
          />
        </div>
        <br />
        <br />
      </form>
    </div>
  );
};

export default CourseInformation;
