import { HydratedRouter } from "react-router/dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { Buffer } from "buffer";
import process from "process";

// Polyfill Node.js globals for the browser (needed for simple-peer)
if (typeof window !== "undefined") {
  window.global = window;
  window.Buffer = Buffer;
  window.process = process;
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
