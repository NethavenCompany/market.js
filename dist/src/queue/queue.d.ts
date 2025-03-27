import { Task } from "../../types";
/**
 * A queue for managing asynchronous tasks
 */
export default class Queue {
    private tasks;
    /**
     * Add a new task to the queue
     * @param task The task to add
     */
    push(task: Task): void;
    /**
     * Cancel all tasks in the queue
     */
    cancel(): void;
    /**
     * Remove a specific task from the queue
     * @param product The product identifier of the task to remove
     */
    remove(product: string): void;
    /**
     * Get all tasks in the queue
     * @returns Array of tasks
     */
    list(): Task[];
    /**
     * Execute all tasks in the queue
     * @returns Promise that resolves when all tasks are complete
     */
    execute(): Promise<void>;
}
//# sourceMappingURL=queue.d.ts.map