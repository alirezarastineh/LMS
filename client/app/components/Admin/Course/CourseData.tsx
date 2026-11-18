import { AiOutlinePlusCircle } from "react-icons/ai";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/styles";
import { createClientId, type ICourseTextItem } from "@/app/types/lms";

type CourseDataProps = {
  benefits: ICourseTextItem[];
  setBenefits: (benefits: ICourseTextItem[]) => void;
  prerequisites: ICourseTextItem[];
  setPrerequisites: (prerequisites: ICourseTextItem[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}: CourseDataProps) => {
  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = benefits.map((benefit, i) =>
      i === index ? { ...benefit, title: value } : benefit
    );
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { clientId: createClientId("benefit"), title: "" }]);
  };

  const handlePrerequisitesChange = (index: number, value: string) => {
    const updatedPrerequisites = prerequisites.map((prerequisite, i) =>
      i === index ? { ...prerequisite, title: value } : prerequisite
    );
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([
      ...prerequisites,
      { clientId: createClientId("prereq"), title: "" },
    ]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      benefits.at(-1)?.title === "" ||
      prerequisites.at(-1)?.title === ""
    ) {
      toast.error("Please fill the fields for go to next!");
      return;
    }
    setActive(active + 1);
  };

  return (
    <div className="w-[80%] m-auto mt-24 block">
      <div>
        <label className={`${styles.label} text-[20px]`} htmlFor="email">
          What are the benefits for students in this course?
        </label>
        <br />
        {benefits.map((benefit, index) => (
          <input
            type="text"
            key={benefit.clientId ?? benefit.title}
            name="Benefit"
            placeholder="You will be able to build a full stack LMS Platform..."
            required
            className={`${styles.input} my-2`}
            value={benefit.title}
            onChange={(e) => handleBenefitChange(index, e.target.value)}
          />
        ))}
        <AiOutlinePlusCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefit}
        />
      </div>

      <div>
        <label className={`${styles.label} text-[20px]`} htmlFor="email">
          What are the prerequisites for starting this course?
        </label>
        <br />
        {prerequisites.map((prerequisite, index) => (
          <input
            type="text"
            key={prerequisite.clientId ?? prerequisite.title}
            name="prerequisites"
            placeholder="You need basic knowledge of MERN stack"
            required
            className={`${styles.input} my-2`}
            value={prerequisite.title}
            onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
          />
        ))}
        <AiOutlinePlusCircle
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisites}
        />
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
          onClick={() => handleOptions()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseData;
