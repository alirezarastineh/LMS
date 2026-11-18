import { type ChangeEvent, useState } from "react";
import { styles } from "@/app/styles/styles";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { AiOutlineCamera } from "react-icons/ai";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import { getApiErrorMessage } from "@/app/types/lms";
import Loader from "../../Loader/Loader";

interface IBannerData {
  title?: string;
  subtitle?: string;
  image?: {
    url?: string;
  };
}

type EditHeroFormProps = {
  initialBanner: IBannerData;
  onUpdated: () => Promise<unknown>;
};

const EditHeroForm = ({ initialBanner, onUpdated }: EditHeroFormProps) => {
  const initialImage = initialBanner.image?.url ?? "";
  const initialTitle = initialBanner.title ?? "";
  const initialSubtitle = initialBanner.subtitle ?? "";

  const [image, setImage] = useState(initialImage);
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);

  const [editLayout] = useEditLayoutMutation();

  const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2 && typeof reader.result === "string") {
        setImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleEdit = async () => {
    try {
      await editLayout({
        type: "Banner",
        image,
        title,
        subtitle,
      }).unwrap();
      toast.success("Hero updated successfully!");
      await onUpdated();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const hasChanges =
    initialTitle !== title ||
    initialSubtitle !== subtitle ||
    initialImage !== image;

  return (
    <div className="w-full 1000px:flex items-center">
      <div className="absolute top-25 1000px:top-[unset] 1500px:size-175 1100px:size-125 size-[50vh] hero_animation rounded-[50%] 1100px:left-72 1500px:left-84" />
      <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-17.5 1000px:pt-0 z-10">
        <div className="relative flex items-center justify-end">
          {image && (
            <Image
              src={image}
              alt=""
              className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-auto z-10"
              layout="responsive"
              width={500}
              height={300}
            />
          )}
          <input
            type="file"
            name=""
            id="banner"
            accept="image/*"
            onChange={handleUpdate}
            className="hidden"
          />
          <label htmlFor="banner" className="absolute bottom-0 right-0 z-20">
            <AiOutlineCamera className="dark:text-white text-black text-[18px] cursor-pointer" />
          </label>
        </div>
      </div>
      <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-0 text-center 1000px:text-left mt-37.5">
        <textarea
          className="dark:text-white resize-none text-[#000000c7] text-[30px] px-3 w-full 1000px:text-6xl/18.75 1500px:text-[70px] font-semibold font-Josefin py-2 1500px:w-[60%] 1100px:w-[78%] outline-hidden bg-transparent block"
          placeholder="Improve Your Online Learning Experience Better Instantly"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={4}
        />
        <br />
        <textarea
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="We have 40k+ Online courses & 500K+ Online registered student. Find your desired Courses from them."
          className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-semibold text-[18px] 1500px:w-[55%]! 1100px:w-[74%]! bg-transparent outline-hidden resize-none"
        />
        <br />
        <br />
        <br />
        <button
          type="button"
          disabled={!hasChanges}
          className={`${
            styles.button
          } w-25! min-h-10! h-10! dark:text-white text-black bg-[#cccccc34] border-0
          ${
            hasChanges ? "cursor-pointer! bg-[#42d383]!" : "cursor-not-allowed!"
          }
          rounded-sm! absolute bottom-12 right-12`}
          onClick={() => {
            void handleEdit();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

const EditHero = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <Loader />;
  }

  const initialBanner: IBannerData =
    (data as { layout?: { banner?: IBannerData } } | undefined)?.layout
      ?.banner ?? {};

  return (
    <EditHeroForm
      key={JSON.stringify(initialBanner)}
      initialBanner={initialBanner}
      onUpdated={refetch}
    />
  );
};

export default EditHero;
