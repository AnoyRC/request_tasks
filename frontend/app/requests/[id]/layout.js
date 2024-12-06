import DeleteTaskModal from "@/components/modal/DeleteTaskModal";

export default function Layout({ children }) {
  return (
    <>
      <DeleteTaskModal />
      {children}
    </>
  );
}
