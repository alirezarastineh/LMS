import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";
import type { ICourseDataItem } from "@/app/types/lms";

type CourseContentListProps = {
  data: ICourseDataItem[];
  activeVideo?: number;
  setActiveVideo?: (index: number) => void;
  isDemo?: boolean;
};

const CourseContentList = ({
  data,
  activeVideo,
  setActiveVideo,
  isDemo,
}: CourseContentListProps) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>()
  );

  const videoSections: string[] = [
    ...new Set<string>(data?.map((item) => item.videoSection) ?? []),
  ];

  let totalCount = 0;

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);

    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }

    setVisibleSections(newVisibleSections);
  };

  return (
    <div
      className={`mt-3.75 w-full ${
        !isDemo && "-ml-7.5 min-h-screen sticky top-24 left-0 z-30"
      }`}
    >
      {videoSections.map((section: string) => {
        const isSectionVisible = visibleSections.has(section);

        const sectionVideos: ICourseDataItem[] = data.filter(
          (item) => item.videoSection === section
        );

        const sectionVideoCount: number = sectionVideos.length;
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item) =>
            totalLength + Number(item.videoLength ?? 0),
          0
        );
        const sectionStartIndex: number = totalCount;
        totalCount += sectionVideoCount;

        const sectionContentHours: number = sectionVideoLength / 60;

        return (
          <div
            className={`${
              !isDemo &&
              "border-b border-[#0000001c] dark:border-[#ffffff8e] pb-2"
            }`}
            key={section}
          >
            <div className="w-full flex">
              <div className="w-full flex justify-between items-center">
                <h2 className="text-[22px] text-black dark:text-white">
                  {section}
                </h2>
                <button
                  type="button"
                  className="mr-4 cursor-pointer text-black dark:text-white"
                  onClick={() => toggleSection(section)}
                >
                  {isSectionVisible ? (
                    <BsChevronUp size={20} />
                  ) : (
                    <BsChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>
            <h5 className="text-black dark:text-white">
              {sectionVideoCount} Lessons ·{" "}
              {sectionVideoLength < 60
                ? sectionVideoLength
                : sectionContentHours.toFixed(2)}{" "}
              {sectionVideoLength > 60 ? "hours" : "minutes"}
            </h5>
            <br />
            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos.map((item, index: number) => {
                  const videoIndex: number = sectionStartIndex + index;
                  const videoLengthNum = Number(item.videoLength ?? 0);
                  const contentLength: number = videoLengthNum / 60;
                  return (
                    <button
                      type="button"
                      disabled={isDemo}
                      className={`w-full text-left border-0 ${
                        videoIndex === activeVideo ? "bg-slate-800" : "bg-transparent"
                      } cursor-pointer transition-all p-2`}
                      key={item._id ?? index}
                      onClick={
                        isDemo ? undefined : () => setActiveVideo?.(videoIndex)
                      }
                    >
                      <div className="flex items-start">
                        <div>
                          <MdOutlineOndemandVideo
                            size={25}
                            className="mr-2"
                            color="#1cdada"
                          />
                        </div>
                        <h1 className="text-[18px] inline-block wrap-break-word text-black dark:text-white">
                          {item.title}
                        </h1>
                      </div>
                      <h5 className="pl-8 text-black dark:text-white">
                        {videoLengthNum > 60
                          ? contentLength.toFixed(2)
                          : videoLengthNum}{" "}
                        {videoLengthNum > 60 ? "hours" : "minutes"}
                      </h5>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
