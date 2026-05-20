import { FC, ReactNode } from 'react';

interface FormGridProps {
  children: ReactNode;
}

const FormGrid: FC<FormGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      {children}
    </div>
  );
};

export default FormGrid;
