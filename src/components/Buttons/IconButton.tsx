import { ComponentProps, ForwardedRef, forwardRef } from "react";
import { clsx } from "../../utils";
import { Icon, IconProps } from "../Icon";

export type ButtonWithIconProps = {
  enabled?: boolean;
  variant?: string;
} & ComponentProps<"button"> &
  IconProps;

export const IconButton = forwardRef(function IconButton(
  props: ButtonWithIconProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const { icon, enabled, variant, onClick, children, className, ...rest } = props;
  return (
    <button
      className={clsx("sse-auth__call-controls__button", className, {
        [`sse-auth__call-controls__button--variant-${variant}`]: variant,
        "sse-auth__call-controls__button--enabled": enabled,
      })}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      ref={ref}
      {...rest}
    >
      <Icon icon={icon} />
      <div className="text-button">{children}</div>
    </button>
  );
});
