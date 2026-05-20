import { FC } from "react";

interface ResultBoxProps {
  data: unknown;
}

const ResultBox: FC<ResultBoxProps> = ({ data }) => {
  if (!data) return null;

  return (
    <pre className="bg-gray-100 dark:bg-neutral-900 p-3 rounded-lg max-h-60 overflow-auto text-sm mt-3">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default ResultBox;
