import clsx from "clsx";
import type { ReactNode } from "react";

interface ButtonProps {
  id: string;
  title: string;
  rightIcon?: ReactNode | undefined | null;
  leftIcon?: ReactNode | undefined | null;
  containerClass?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  id,
  title,
  rightIcon,
  leftIcon,
  containerClass,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "group relative z-10 w-fit overflow-hidden rounded-full px-7 py-3 text-black flex items-center justify-center",
        containerClass
      )}
    >
      {leftIcon}

      <span className="relative inline-flex overflow-hidden text-xs uppercase">
        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </span>

      {rightIcon}
    </button>
  );
};

export default Button;
