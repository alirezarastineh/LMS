import { useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { styles } from "@/app/styles/styles";
import type { IFaqItem } from "@/app/types/lms";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";

const Faq = () => {
  const { data } = useGetHeroDataQuery("FAQ", {});

  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const questions: IFaqItem[] = data?.layout?.faq ?? [];

  const toggleQuestion = (id: string) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[80%] m-auto">
        <h1 className={`${styles.title} 800px:text-[40px]`}>
          Frequently Asked Questions
        </h1>

        <div className="mt-12">
          <dl className="space-y-8">
            {questions.map((q, index) => {
              const questionId = q._id ?? String(index);
              return (
                <div
                  key={questionId}
                  className={`${
                    q._id !== questions[0]?._id && "border-t"
                  } border-gray-200 pt-6`}
                >
                  <dt className="text-lg">
                    <button
                      type="button"
                      className="flex items-start justify-between w-full text-left focus:outline-hidden"
                      onClick={() => toggleQuestion(questionId)}
                    >
                      <span className="font-medium text-black dark:text-white">
                        {q.question}
                      </span>

                      <span className="ml-6 shrink-0">
                        {activeQuestion === questionId ? (
                          <HiMinus className="size-6 text-black dark:text-white" />
                        ) : (
                          <HiPlus className="size-6 text-black dark:text-white" />
                        )}
                      </span>
                    </button>
                  </dt>

                  {activeQuestion === questionId && (
                    <dd className="mt-2 pr-12">
                      <p className="text-base font-Poppins text-black dark:text-white">
                        {q.answer}
                      </p>
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default Faq;
