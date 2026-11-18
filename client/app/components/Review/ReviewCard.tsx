import Image from "next/image";
import Ratings from "@/app/utils/Ratings";

interface ReviewItem {
  name: string;
  avatar: string;
  profession: string;
  comment: string;
}

type ReviewCardProps = {
  item: ReviewItem;
};

const ReviewCard = (props: ReviewCardProps) => {
  return (
    <div className="w-full h-max pb-4 dark:bg-slate-500/20 border border-[#00000028] dark:border-[#ffffff1d] backdrop-blur-sm shadow-inner rounded-lg p-3">
      <div className="flex w-full">
        <Image
          src={props.item.avatar}
          alt=""
          width={50}
          height={50}
          className="size-12.5 rounded-full object-cover"
        />

        <div className="800px:flex justify-between w-full hidden">
          <div className="pl-4">
            <h5 className="text-[20px] text-black dark:text-white">
              {props.item.name}
            </h5>

            <h6 className="text-[16px] text-black dark:text-[#ffffffab]">
              {props.item.profession}
            </h6>
          </div>

          <Ratings rating={5} />
        </div>

        <div className="800px:hidden justify-between w-full flex flex-col">
          <div className="pl-4">
            <h5 className="text-[20px] text-black dark:text-white">
              {props.item.name}
            </h5>

            <h6 className="text-[16px] text-black dark:text-[#ffffffab]">
              {props.item.profession}
            </h6>
          </div>

          <Ratings rating={5} />
        </div>
      </div>

      <p
        className="pt-2 px-2 font-Poppins
      text-black dark:text-white
      "
      >
        {props.item.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
