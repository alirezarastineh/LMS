import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/styles";
import { getApiErrorMessage, type ICategoryItem } from "@/app/types/lms";

type EditCategoriesFormProps = {
  initialCategories: ICategoryItem[];
  onUpdated: () => Promise<unknown>;
};

const EditCategoriesForm = ({
  initialCategories,
  onUpdated,
}: EditCategoriesFormProps) => {
  const [editLayout] = useEditLayoutMutation();
  const [categories, setCategories] = useState<ICategoryItem[]>(() =>
    initialCategories.map((c) => ({ ...c })),
  );

  const handleCategoriesAdd = (index: number, value: string) => {
    setCategories((prevCategory) =>
      prevCategory.map((item, i) =>
        i === index ? { ...item, title: value } : item,
      ),
    );
  };

  const newCategoriesHandler = () => {
    if (categories.length > 0 && categories.at(-1)?.title === "") {
      toast.error("Category title cannot be empty");
    } else {
      setCategories((prevCategory) => [...prevCategory, { title: "" }]);
    }
  };

  const areCategoriesUnchanged = (
    originalCategories: ICategoryItem[],
    newCategories: ICategoryItem[],
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (items: ICategoryItem[]) => {
    return items.some((q) => q.title === "");
  };

  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(initialCategories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      try {
        await editLayout({
          type: "Categories",
          categories,
        }).unwrap();
        await onUpdated();
        toast.success("Categories updated successfully");
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      }
    }
  };

  const isDisabled =
    areCategoriesUnchanged(initialCategories, categories) ||
    isAnyCategoryTitleEmpty(categories);

  return (
    <div className="mt-30 text-center">
      <h1 className={`${styles.title}`}>All Categories</h1>
      {categories.map((item, index: number) => (
        <div className="p-3" key={item._id ?? index}>
          <div className="flex items-center w-full justify-center">
            <input
              className={`${styles.input} w-[unset]! border-none! text-[20px]!`}
              value={item.title}
              onChange={(e) => handleCategoriesAdd(index, e.target.value)}
              placeholder="Enter category title..."
            />
            <AiOutlineDelete
              className="dark:text-white text-black text-[18px] cursor-pointer"
              onClick={() => {
                setCategories((prevCategory) =>
                  prevCategory.filter((_, i) => i !== index),
                );
              }}
            />
          </div>
        </div>
      ))}
      <br />
      <br />
      <div className="w-full flex justify-center">
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={newCategoriesHandler}
        />
      </div>
      <button
        type="button"
        disabled={isDisabled}
        className={`${
          styles.button
        } w-25! min-h-10! h-10! dark:text-white text-black bg-[#cccccc34] border-0
        ${isDisabled ? "cursor-not-allowed!" : "cursor-pointer! bg-[#42d383]!"}
        rounded-sm! absolute bottom-12 right-12`}
        onClick={() => {
          void editCategoriesHandler();
        }}
      >
        Save
      </button>
    </div>
  );
};

const EditCategories = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const initialCategories: ICategoryItem[] =
    (data as { layout?: { categories?: ICategoryItem[] } } | undefined)?.layout
      ?.categories ?? [];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <EditCategoriesForm
      key={JSON.stringify(initialCategories)}
      initialCategories={initialCategories}
      onUpdated={refetch}
    />
  );
};

export default EditCategories;
