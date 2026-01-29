export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/10 dark:bg-black/10 backdrop-blur-sm animate-fade-in">
         <div className="animate-spin rounded-full h-10 w-10 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 border-r-purple-600 dark:border-r-purple-400"></div>
    </div>
  );
}
