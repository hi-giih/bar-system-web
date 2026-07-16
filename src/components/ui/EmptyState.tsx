interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <p className="text-text-secondary">{message}</p>
    </div>
  )
}
