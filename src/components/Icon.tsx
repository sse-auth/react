import { clsx } from "../utils";
import React from "react";

export type IconProps = {
  icon: string | React.ReactNode;
  className?: string;
};

export const Icon = ({ icon, className }: IconProps) => (
  <span className={clsx("sse-auth_icon", className)}>
    {typeof icon === "string" ? (
      <div dangerouslySetInnerHTML={{ __html: icon }} />
    ) : (
      icon
    )}
  </span>
);
