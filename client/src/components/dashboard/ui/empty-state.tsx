export function EmptyState({ text = "Không có dữ liệu phù hợp với bộ lọc" }: { text?: string }) {
  return <div className="grid h-40 place-items-center text-sm text-gray-400">{text}</div>;
}
