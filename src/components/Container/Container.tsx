import { ReactNode, forwardRef, HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full my-0 mx-auto px-5 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container"; // optional but good for debugging

export default Container;
