// Thin, rounded scrollbar for scrolling panels instead of the platform default
// (Firefox reads scrollbar-width / scrollbar-color, WebKit the ::-webkit-scrollbar rules).
export const SLIM_SCROLLBAR =
  "[scrollbar-width:thin] [scrollbar-color:#e5e7eb_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300";
