"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { createTask, getUsers, tasks, updateTask } from "@/services";
import { useUserContext } from "@/context/userContext";
import { Modal, ResponseModal, Filters, List } from "./components";
import { useTasks } from "./hooks/useTasks";

export default function Home() {
  const { user, isLead } = useUserContext();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [responseModalState, setResponseModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const [filterParams, setFilterParams] = useState({
    search: "",
    status: "",
    assignedUserId: undefined,
    sortBy: "created_at",
    sortOrder: "desc" as "asc" | "desc",
  });

  const { data, hasMore, updateParams, loadMore } = useTasks(
    filterParams,
    tasks
  );

  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, loadMore]
  );

  const handleCreateOrUpdate = async (itemData: {
    title: string;
    description: string;
    assignedUserId: number;
  }) => {
    let request = {
      title: itemData.title,
      description: itemData.description,
      assignedUserId: Number(itemData.assignedUserId),
      createdById: user.id,
    };
    try {
      const result = editItem
        ? await updateTask({ ...request, ...editItem })
        : await createTask(request);

      setIsModalOpen(false);
      setResponseModalState({
        isOpen: true,
        title: "Success",
        message: `Successfully ${editItem ? "updated" : "created"} the item.`,
        type: "success",
      });
      setEditItem(null);
      updateParams(filterParams);
    } catch (error: any) {
      setResponseModalState({
        isOpen: true,
        title: "Error",
        message:
          error.message ||
          `Failed to ${editItem ? "update" : "create"} the item.`,
        type: "error",
      });
    }
  };

  const handleItemClick = (item: any) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const updatedParams = {
      ...filterParams,
      [name]: value,
    };

    setFilterParams(updatedParams);
    updateParams(updatedParams);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <Filters
        searchTerm={filterParams.search}
        filterStatus={filterParams.status}
        assignedUserId={filterParams.assignedUserId}
        sortBy={filterParams.sortBy}
        sortOrder={filterParams.sortOrder}
        users={users}
        onFilterChange={handleFilterChange}
      />

      {isLead && (
        <button
          onClick={() => {
            setEditItem(null);
            setIsModalOpen(true);
          }}
          className="mb-4 px-4 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Create Item
        </button>
      )}

      <List
        items={data}
        onItemClick={handleItemClick}
        lastItemRef={lastItemElementRef}
      />
      {!data?.length && (
        <p className="text-center mt-4">No items to display.</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editItem || undefined}
        users={users}
      />
      <ResponseModal
        isOpen={responseModalState.isOpen}
        onClose={() =>
          setResponseModalState({ ...responseModalState, isOpen: false })
        }
        title={responseModalState.title}
        message={responseModalState.message}
        type={responseModalState.type}
      />
    </div>
  );
}
