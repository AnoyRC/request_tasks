import CreateProjectModal from "@/components/modal/CreateProjectModal";

export default function Layout({ children }) {
  return (
    <>
      <CreateProjectModal />
      {children}
    </>
  );
}
