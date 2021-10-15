export interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: 'button'|'submit'|'reset'|undefined;
  disabled?: boolean;
  className?: string;
}

export const PrimaryAction: React.FC<ActionProps>=({
  children,
  disabled=false,
  type='button',
  className='',
  ...props
}) => {
  return (
    <button
      className={`px-4 h-14 flex items-center justify-center bg-gradient-primary disabled:bg-none rounded-lg font-bold text-lg disabled:bg-gray-300 disabled:text-gray-500 text-white hover:bg-indigo-700 ${className}`}
      {...{disabled,type}}
      {...props}
    >
      {children}
    </button>
  );
};

export const SecondaryAction: React.FC<ActionProps>=({
  children,
  disabled=false,
  className='',
  type='button',
  ...props
}) => {
  return (
    <button
      className={`px-4 h-14 flex items-center justify-center bg-white rounded-lg font-bold text-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 ${className}`}
      {...{disabled,type}}
      {...props}
    >
      {children}
    </button>
  );
};
