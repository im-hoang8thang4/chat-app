import React from 'react';
import BarLoader from 'react-spinners/BarLoader';

const Spinner = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full absolute">
      <BarLoader loading={true} height={4} width={100} />
    </div>
  );
};

export default Spinner;