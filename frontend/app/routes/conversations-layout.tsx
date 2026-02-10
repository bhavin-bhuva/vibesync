import { Outlet } from "react-router";

export default function ConversationsLayout() {
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-black">
      <Outlet />
    </div>
  );
}
