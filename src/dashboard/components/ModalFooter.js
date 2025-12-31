import React from "react";

export const ModalFooter = ({ children }) => {
  const childCount = React.Children.count(children);
  const justifyClass = childCount > 1 ? "justify-between" : "justify-end";

  return (
    <div className={`flex flex-row gap-2 ${justifyClass} items-center mt-4 pt-4 border-t border-neutral-800 bg-[#101010]`}>
      {children}
    </div>
  );
};

ModalFooter.displayName = "ModalFooter";
