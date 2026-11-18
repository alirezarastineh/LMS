import Link from "next/link";
import Image from "next/image";
import { AiOutlineUnorderedList } from "react-icons/ai";
import Ratings from "@/app/utils/Ratings";
import { resolveNonEmpty, type ICourse } from "@/app/types/lms";

type CourseCardProps = {
  item: ICourse;
  isProfile?: boolean;
};

const CourseCard = ({ item, isProfile }: CourseCardProps) => {
  return (
    <Link
      href={isProfile ? `course-access/${item._id}` : `/course/${item._id}`}
    >
      <div className="w-full min-h-[35vh] dark:bg-slate-500/20 backdrop-blur-sm border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-inner rounded-lg p-3 shadow-xs">
        <Image
          src={resolveNonEmpty(
            item.thumbnail?.url,
            "https://res.cloudinary.com/kouroshrstn/image/upload/v1707293135/Avatars/banner-img-1_l7ak1q.png",
          )}
          width={500}
          height={300}
          objectFit="contain"
          className="rounded-sm w-full"
          alt=""
        />
        <br />
        <h1 className="font-Poppins text-[16px] text-black dark:text-white">
          {item.name}
        </h1>
        <div className="w-full flex items-center justify-between pt-2">
          <Ratings rating={item.ratings ?? 0} />
          <h5
            className={`text-black dark:text-white ${
              isProfile && "hidden 800px:inline"
            }`}
          >
            {item.purchased} Students
          </h5>
        </div>
        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex">
            <h3 className="text-black dark:text-white">
              {item.price === 0 ? "Free" : `${item.price}€`}
            </h3>
            <h5 className="pl-3 text-[14px] -mt-1.25 line-through opacity-80 text-black dark:text-white">
              {item.estimatedPrice}€
            </h5>
          </div>
          <div className="flex items-center pb-3">
            <AiOutlineUnorderedList size={20} fill="#fff" />
            <h5 className="pl-2 text-black dark:text-white">
              {item.courseData?.length} Lectures
            </h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
