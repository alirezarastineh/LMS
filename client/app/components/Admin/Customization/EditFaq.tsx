import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { styles } from "@/app/styles/styles";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import Loader from "../../Loader/Loader";
import { getApiErrorMessage, type IFaqItem } from "@/app/types/lms";

type EditFaqFormProps = {
  initialQuestions: IFaqItem[];
  onUpdated: () => Promise<unknown>;
};

const EditFaqForm = ({ initialQuestions, onUpdated }: EditFaqFormProps) => {
  const [editLayout] = useEditLayoutMutation();
  const [questions, setQuestions] = useState<IFaqItem[]>(() =>
    initialQuestions.map((q) => ({ ...q }))
  );

  const toggleQuestion = (index: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) =>
        i === index ? { ...q, active: !q.active } : q
      )
    );
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => (i === index ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (index: number, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => (i === index ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  const areQuestionsUnchanged = (
    originalQuestions: IFaqItem[],
    newQuestions: IFaqItem[]
  ) => {
    return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
  };

  const isAnyQuestionEmpty = (items: IFaqItem[]) => {
    return items.some((q) => q.question === "" || q.answer === "");
  };

  const handleEdit = async () => {
    if (
      !areQuestionsUnchanged(initialQuestions, questions) &&
      !isAnyQuestionEmpty(questions)
    ) {
      try {
        await editLayout({
          type: "FAQ",
          faq: questions,
        }).unwrap();
        await onUpdated();
        toast.success("FAQ updated successfully");
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      }
    }
  };

  const isDisabled =
    areQuestionsUnchanged(initialQuestions, questions) ||
    isAnyQuestionEmpty(questions);

  return (
    <div className="w-[90%] 800px:w-[80%] m-auto mt-30">
      <div className="mt-12">
        <dl className="space-y-8">
          {questions.map((q, index) => (
            <div
              key={q._id ?? index}
              className={`${index !== 0 && "border-t"} border-gray-200 pt-6`}
            >
              <dt className="text-lg">
                <button
                  type="button"
                  className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-hidden"
                  onClick={() => toggleQuestion(index)}
                >
                  <input
                    className={`${styles.input} border-none`}
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                    placeholder={"Add your question..."}
                  />

                  <span className="ml-6 shrink-0">
                    {q.active ? (
                      <HiMinus className="size-6" />
                    ) : (
                      <HiPlus className="size-6" />
                    )}
                  </span>
                </button>
              </dt>
              {q.active && (
                <dd className="mt-2 pr-12">
                  <input
                    className={`${styles.input} border-none`}
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={"Add your answer..."}
                  />
                  <span className="ml-6 shrink-0">
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() => {
                        setQuestions((prevQuestions) =>
                          prevQuestions.filter((_, i) => i !== index)
                        );
                      }}
                    />
                  </span>
                </dd>
              )}
            </div>
          ))}
        </dl>
        <br />
        <br />
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={newFaqHandler}
        />
      </div>

      <button
        type="button"
        disabled={isDisabled}
        className={`${
          styles.button
        } w-25! min-h-10! h-10! dark:text-white text-black bg-[#cccccc34] border-0
          ${
            isDisabled
              ? "cursor-not-allowed!"
              : "cursor-pointer! bg-[#42d383]!"
          }
          rounded-sm! fixed bottom-12 right-12`}
        onClick={() => {
          void handleEdit();
        }}
      >
        Save
      </button>
    </div>
  );
};

const EditFaq = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });

  const initialQuestions: IFaqItem[] =
    (data as { layout?: { faq?: IFaqItem[] } } | undefined)?.layout?.faq ?? [];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <EditFaqForm
      key={JSON.stringify(initialQuestions)}
      initialQuestions={initialQuestions}
      onUpdated={refetch}
    />
  );
};

export default EditFaq;
