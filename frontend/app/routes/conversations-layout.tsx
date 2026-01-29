import { Outlet } from "react-router";

export default function ConversationsLayout() {
  return (
    <div className="h-screen flex overflow-hidden">
      <Outlet />
    </div>
  );
}
