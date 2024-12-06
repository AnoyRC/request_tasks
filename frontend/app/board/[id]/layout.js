import Sidebar from "@/components/layout/board/Sidebar";
import CreateTaskModal from "@/components/modal/CreateTaskModal";

export default function Layout({ children }) {
  return (
    <>
      <CreateTaskModal />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
