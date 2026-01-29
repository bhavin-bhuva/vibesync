import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/auth/google/callback", "routes/google-callback.tsx"),
  route("/conversations", "routes/conversations-layout.tsx", [
    index("routes/conversations-index.tsx"),
    route(":conversationId", "routes/conversation-detail.tsx"),
  ]),
  route("/add-friend", "routes/add-friend.tsx"),
  route("/friend-requests", "routes/friend-requests.tsx"),
  route("/friends", "routes/friends.tsx"),
  route("/status", "routes/status.tsx"),
  route("/chat", "routes/chat.tsx"),
] satisfies RouteConfig;



