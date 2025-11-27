import * as Checkbox from "@radix-ui/react-checkbox";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <div className="flex items-center gap-2">
        <Checkbox.Root
          checked={todo.completed}
          onCheckedChange={(checked) => onToggle(todo.id, checked)}
          className="w-5 h-5 border rounded"
        />
        <span className={todo.completed ? "line-through opacity-50" : ""}>
          {todo.title}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 text-sm"
      >
        Delete
      </button>
    </div>
  );
}
