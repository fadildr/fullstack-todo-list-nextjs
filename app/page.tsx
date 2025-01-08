"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { createTask, getUsers, tasks, updateTask } from "@/services";
import { useUserContext } from "@/context/userContext";
import { Modal, ResponseModal, Filters, List, Header } from "./components";
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
    id: number;
    status: string;
  }) => {
    let request;

    if (editItem) {
      request = {
        title: itemData.title,
        description: itemData.description,
        assignedUserId: Number(itemData.assignedUserId),
        status: itemData.status,
        id: itemData.id,
        userId: user.id,
      };
    } else {
      request = {
        title: itemData.title,
        description: itemData.description,
        assignedUserId: Number(itemData.assignedUserId),
        createdById: user.id,
      };
    }

    try {
      const result = editItem
        ? await updateTask(request)
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
    <div className="container mx-auto p-10 bg-gray-100">
      <div className="mb-4">
        <Header />
      </div>
      <Filters
        searchTerm={filterParams.search}
        filterStatus={filterParams.status}
        assignedUserId={filterParams.assignedUserId}
        users={users}
        onFilterChange={handleFilterChange}
      />

      <List
        items={data}
        onItemClick={handleItemClick}
        lastItemRef={lastItemElementRef}
      />
      {!data?.length && (
        <p className="text-center mt-4">No items to display.</p>
      )}

      {isLead && (
        <button
          onClick={() => {
            setEditItem(null);
            setIsModalOpen(true);
          }}
          className="fixed bottom-20 right-20 w-20 h-20 bg-blue-500 text-white rounded-full shadow-[0px_4px_10px_rgba(0,0,0,0.2)]   flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
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
