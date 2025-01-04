"use client";
import { useState, useEffect, useCallback } from "react";
import { Task } from "../types/task";

type ItemParams = {
  search?: string;
  status?: string;
  assignedUserId?: number | undefined;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const useTasks = (initialParams: ItemParams, service: any) => {
  const [params, setParams] = useState(initialParams);
  const [data, setData] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<any>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  const fetch = useCallback(
    async (pageNum: number, isInitialFetch: boolean = false) => {
      try {
        const res = await service({
          ...params,
          page: pageNum,
          limit,
        });
        setPagination(res.data.meta);
        if (isInitialFetch) {
          setData(res.data.tasks);
        } else {
          setData((prevData) => [...prevData, ...res.data.tasks]);
        }

        setHasMore(pageNum < res.data.totalPages);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    [params, limit, pagination.totalPages]
  );

  useEffect(() => {
    fetch(1, true);
  }, [fetch]);

  useEffect(() => {
    if (page > 1) {
      fetch(page);
    }
  }, [page, fetch]);

  const updateParams = (newParams: Partial<ItemParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
    setPage(1);
  };

  const loadMore = () => setPage((prev) => prev + 1);

  return { data, hasMore, updateParams, loadMore };
};
