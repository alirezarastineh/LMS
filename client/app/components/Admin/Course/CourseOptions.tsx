import { IoMdCheckmark } from "react-icons/io";

type CourseOptionsProps = {
  active: number;
};

const CourseOptions = ({ active }: CourseOptionsProps) => {
  const options = [
    "Course Information",
    "Course Options",
    "Course Content",
    "Course Preview",
  ];

  return (
    <div>
      {options.map((option, index) => (
        <div key={option} className={`w-full flex py-5`}>
          <div
            className={`size-8.75 rounded-full flex items-center justify-center ${
              active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
            } relative`}
          >
            <IoMdCheckmark className="text-[25px]" />

            {index !== options.length - 1 && (
              <div
                className={`absolute h-7.5 w-1 ${
                  active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
                } -bottom-full`}
              />
            )}
          </div>

          <h5 className="pl-3 dark:text-white text-black text-[20px]">
            {option}
          </h5>
        </div>
      ))}
    </div>
  );
};

export default CourseOptions;
