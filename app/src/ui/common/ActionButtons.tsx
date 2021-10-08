export interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  className?: string;
}

export const PrimaryAction: React.FC<ActionProps> = ({
  children,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`px-4 h-12 flex items-center justify-center bg-indigo-600 rounded-lg font-bold text-lg disabled:bg-gray-700 text-white disabled:bg-opacity-80 disabled:text-opacity-50 hover:bg-indigo-700 ${className}`}
      {...{ disabled, type }}
      {...props}
    >
      {children}
    </button>
  );
};

export const SecondaryAction: React.FC<ActionProps> = ({
  children,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      className={`px-4 h-12 flex items-center justify-center bg-gray-700 rounded-lg font-bold text-lg hover:bg-opacity-60 ${className}`}
      {...{ disabled, type }}
      {...props}
    >
      {children}
    </button>
  );
};
