export default function Loading() {
  // Subtle top progress bar during route transitions instead of a full-screen overlay.
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1">
      <div className="h-full w-full origin-left animate-[progress_1s_ease-in-out_infinite] bg-primary" />
      <style>{`@keyframes progress { 0% { transform: scaleX(0); transform-origin: left; } 50% { transform: scaleX(0.5); transform-origin: left; } 100% { transform: scaleX(1); transform-origin: left; } }`}</style>
    </div>
  );
}
