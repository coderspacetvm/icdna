import React from 'react';

type Props = {
  name: string;
  variant_name?:string
  style?: React.CSSProperties;
};

export const DishName: React.FC<Props> = ({name,variant_name,style}) => {
  return (
    <>
      <p
        style={style}
      >
        {name}
      </p>
      {variant_name&&<p className='t14 number-of-lines-1'>{variant_name}</p>}
    </>
  );
};
