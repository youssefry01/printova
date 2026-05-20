import { FC, ChangeEvent } from "react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector: FC<QuantitySelectorProps> = ({ value, onChange, min = 1, max }) => {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (!max || value < max) onChange(value + 1);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= min && (!max || val <= max)) {
      onChange(val);
    }
  };

  return (
    <div className="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
      <div className="flex items-center gap-x-1.5">
        {/* Decrement */}
        <button
          type="button"
          onClick={decrement}
          className="size-6 cursor-pointer inline-flex justify-center items-center rounded-md border border-gray-200 text-gray-800 hover:bg-gray-50 transition dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Decrease"
          disabled={value <= min}
        >
          <svg
            className="size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
          </svg>
        </button>

        {/* Input */}
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="w-10 bg-transparent border-0 text-center text-sm text-gray-800 focus:ring-0 dark:text-neutral-200
            [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        {/* Increment */}
        <button
          type="button"
          onClick={increment}
          className="size-6 cursor-pointer inline-flex justify-center items-center rounded-md border border-gray-200 text-gray-800 hover:bg-gray-50 transition dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
          aria-label="Increase"
          disabled={max !== undefined && value >= max}
        >
          <svg
            className="size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
