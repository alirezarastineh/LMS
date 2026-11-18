import { type SubmitEvent, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsLink45Deg, BsPencil } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { styles } from "@/app/styles/styles";
import { createClientId, type ICourseDataItem } from "@/app/types/lms";

const handleFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
};

type CourseContentProps = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: ICourseDataItem[];
  setCourseContentData: (courseContentData: ICourseDataItem[]) => void;
  handleSubmit: () => void | Promise<void>;
};

const CourseContent = ({
  courseContentData,
  setCourseContentData,
  active,
  setActive,
  handleSubmit: handlleCourseSubmit,
}: CourseContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>(() =>
    Array.from({ length: courseContentData.length }, () => false),
  );

  const [activeSection, setActiveSection] = useState(1);

  const handleCollapseToggle = (index: number) => {
    const updatedCollasped = [...isCollapsed];
    updatedCollasped[index] = !updatedCollasped[index];
    setIsCollapsed(updatedCollasped);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = courseContentData.map((content, i) =>
      i === index
        ? {
            ...content,
            links: content.links.filter((_, li) => li !== linkIndex),
          }
        : content,
    );
    setCourseContentData(updatedData);
  };

  const handleAddLink = (index: number) => {
    const updatedData = courseContentData.map((content, i) =>
      i === index
        ? {
            ...content,
            links: [
              ...content.links,
              { clientId: createClientId("link"), title: "", url: "" },
            ],
          }
        : content,
    );
    setCourseContentData(updatedData);
  };

  const newContentHandler = (item: ICourseDataItem) => {
    if (
      item.title === "" ||
      item.description === "" ||
      item.videoUrl === "" ||
      item.links[0].title === "" ||
      item.links[0].url === "" ||
      item.videoLength === ""
    ) {
      toast.error("Please fill all the fields first!");
      return;
    }

    const newVideoSection = courseContentData.at(-1)?.videoSection ?? "";

    const newContent: ICourseDataItem = {
      clientId: createClientId("content"),
      videoUrl: "",
      title: "",
      description: "",
      videoSection: newVideoSection,
      videoLength: "",
      links: [{ clientId: createClientId("link"), title: "", url: "" }],
    };

    setCourseContentData([...courseContentData, newContent]);
  };

  const addNewSection = () => {
    const lastItem = courseContentData.at(-1);
    if (
      !lastItem ||
      lastItem.title === "" ||
      lastItem.description === "" ||
      lastItem.videoUrl === "" ||
      lastItem.links[0].title === "" ||
      lastItem.links[0].url === ""
    ) {
      toast.error("Please fill all the fields first!");
      return;
    }

    setActiveSection(activeSection + 1);

    const newContent: ICourseDataItem = {
      clientId: createClientId("content"),
      videoUrl: "",
      title: "",
      description: "",
      videoLength: "",
      videoSection: `Untitled Section ${activeSection}`,
      links: [{ clientId: createClientId("link"), title: "", url: "" }],
    };

    setCourseContentData([...courseContentData, newContent]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    const lastItem = courseContentData.at(-1);
    if (
      !lastItem ||
      lastItem.title === "" ||
      lastItem.description === "" ||
      lastItem.videoUrl === "" ||
      lastItem.links[0].title === "" ||
      lastItem.links[0].url === ""
    ) {
      toast.error("Section can't be empty!");
      return;
    }
    setActive(active + 1);
    void handlleCourseSubmit();
  };

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleFormSubmit}>
        {courseContentData?.map((item, index) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;

          return (
            <div
              className={`w-full bg-[#cdc8c817] p-4 ${
                showSectionInput ? "mt-10" : "mb-0"
              }`}
              key={item.clientId ?? item._id ?? item.title}
            >
              {showSectionInput && (
                <>
                  <div className="flex w-full items-center">
                    <input
                      type="text"
                      className={`text-[20px] ${
                        item.videoSection === "Untitled Section"
                          ? "w-42.5"
                          : "w-min"
                      } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-hidden`}
                      value={item.videoSection}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoSection = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                    <BsPencil className="cursor-pointer dark:text-white text-black" />
                  </div>
                  <br />
                </>
              )}

              <div className="flex w-full items-center justify-between my-0">
                {Boolean(isCollapsed[index] && item.title) && (
                  <p className="font-Poppins dark:text-white text-black">
                    {index + 1}. {item.title}
                  </p>
                )}
                {!isCollapsed[index] && <div />}

                <div className="flex items-center">
                  <AiOutlineDelete
                    className={`dark:text-white text-[20px] mr-2 text-black ${
                      index > 0 ? "cursor-pointer" : "cursor-no-drop"
                    }`}
                    onClick={() => {
                      if (index <= 0) {
                        return;
                      }
                      const updatedData = [...courseContentData];
                      updatedData.splice(index, 1);
                      setCourseContentData(updatedData);
                    }}
                  />

                  <MdOutlineKeyboardArrowDown
                    fontSize="large"
                    className="dark:text-white text-black"
                    style={{
                      transform: isCollapsed[index]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                    onClick={() => handleCollapseToggle(index)}
                  />
                </div>
              </div>

              {!isCollapsed[index] && (
                <>
                  <div className="my-3">
                    <label
                      htmlFor={`video-title-${item.clientId ?? item._id ?? index}`}
                      className={styles.label}
                    >
                      Video Title
                    </label>
                    <input
                      id={`video-title-${item.clientId ?? item._id ?? index}`}
                      type="text"
                      placeholder="Project Plan..."
                      className={`${styles.input}`}
                      value={item.title}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].title = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`video-url-${item.clientId ?? item._id ?? index}`}
                      className={styles.label}
                    >
                      Video Url
                    </label>
                    <input
                      id={`video-url-${item.clientId ?? item._id ?? index}`}
                      type="text"
                      placeholder="URL"
                      className={`${styles.input}`}
                      value={item.videoUrl}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoUrl = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor={`video-length-${item.clientId ?? item._id ?? index}`}
                      className={styles.label}
                    >
                      Video Length (in minutes)
                    </label>
                    <input
                      id={`video-length-${item.clientId ?? item._id ?? index}`}
                      type="number"
                      placeholder="20"
                      className={`${styles.input}`}
                      value={item.videoLength}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoLength = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor={`video-desc-${item.clientId ?? item._id ?? index}`}
                      className={styles.label}
                    >
                      Video Description
                    </label>
                    <textarea
                      id={`video-desc-${item.clientId ?? item._id ?? index}`}
                      rows={8}
                      cols={30}
                      placeholder="Description"
                      className={`${styles.input} h-min! py-2`}
                      value={item.description}
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].description = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                    <br />
                  </div>
                  {item?.links.map((link, linkIndex) => (
                    <div className="mb-3 block" key={link.clientId ?? link.url}>
                      <div className="w-full flex items-center justify-between">
                        <label className={styles.label}>
                          Link {linkIndex + 1}
                        </label>

                        <AiOutlineDelete
                          className={`${
                            linkIndex === 0
                              ? "cursor-no-drop"
                              : "cursor-pointer"
                          } text-black dark:text-white text-[20px]`}
                          onClick={() => {
                            if (linkIndex > 0) {
                              handleRemoveLink(index, linkIndex);
                            }
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Source Code... (Link title)"
                        className={`${styles.input}`}
                        value={link.title}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].links[linkIndex].title =
                            e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                      <input
                        type="url"
                        placeholder="Source Code Url... (Link URL)"
                        className={`${styles.input} mt-6`}
                        value={link.url}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].links[linkIndex].url =
                            e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                  ))}
                  <br />
                  <div className="inline-block mb-4">
                    <button
                      type="button"
                      className="flex items-center text-[18px] dark:text-white text-black cursor-pointer bg-transparent border-0 p-0"
                      onClick={() => handleAddLink(index)}
                    >
                      <BsLink45Deg className="mr-2" /> Add Link
                    </button>
                  </div>
                </>
              )}
              <br />
              {index === courseContentData.length - 1 && (
                <div>
                  <button
                    type="button"
                    className="flex items-center text-[18px] dark:text-white text-black cursor-pointer bg-transparent border-0 p-0"
                    onClick={() => newContentHandler(item)}
                  >
                    <AiOutlinePlusCircle className="mr-2" /> Add New Content
                  </button>
                </div>
              )}
            </div>
          );
        })}
        <br />
        <button
          type="button"
          className="flex items-center text-[20px] dark:text-white text-black cursor-pointer bg-transparent border-0 p-0"
          onClick={() => addNewSection()}
        >
          <AiOutlinePlusCircle className="mr-2" /> Add new Section
        </button>
      </form>
      <br />
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
          onClick={() => handleOptions()}
        >
          Next
        </button>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default CourseContent;
