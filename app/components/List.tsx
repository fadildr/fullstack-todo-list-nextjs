"use client";
import React from "react";

import { Card } from "./Card";

type ListProps = {
  items: any[];
  onItemClick: (item: any) => void;
  lastItemRef: (node: HTMLDivElement | null) => void;
};

export const List: React.FC<ListProps> = ({
  items,
  onItemClick,
  lastItemRef,
}) => {
  return (
    <div>
      {items &&
        items.map((item, index) => (
          <div
            key={item.id}
            className="mb-4 cursor-pointer"
            onClick={() => onItemClick(item)}
            ref={index === items.length - 1 ? lastItemRef : null}
          >
            <Card task={item} />
          </div>
        ))}
    </div>
  );
};
