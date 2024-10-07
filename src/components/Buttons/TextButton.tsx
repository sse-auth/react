import React from "react";

export const TextButton = ({
  children,
  ...rest
}: Omit<React.ComponentProps<"button">, "ref" | "className">) => {
  return (
    <button className="sse-auth__text-button" {...rest}>
      {children}
    </button>
  );
};
