import Sidebar from "@/components/layout/board/Sidebar";
import CreateTaskModal from "@/components/modal/CreateTaskModal";
import DeleteTaskModal from "@/components/modal/DeleteTaskModal";
import UpdateTaskModal from "@/components/modal/UpdateTaskModal";

export default function Layout({ children }) {
  return (
    <>
      <CreateTaskModal />
      <UpdateTaskModal />
      <DeleteTaskModal />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
