interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="col-span-full text-center text-gray-400 py-12">
      {message}
    </div>
  );
}
