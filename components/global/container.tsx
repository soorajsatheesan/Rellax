import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer";
};

export function Container({
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={["mx-auto w-full max-w-7xl px-5 sm:px-8", className]
      .filter(Boolean)
      .join(" ")}
    >
      {children}
    </Component>
  );
}
