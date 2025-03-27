import { Task } from "../../types";

/**
 * A queue for managing asynchronous tasks
 */
export default class Queue {
	private tasks: Task[] = [];

	/**
	 * Add a new task to the queue
	 * @param task The task to add
	 */
	push(task: Task): void {
		this.tasks.push(task);
	}

	/**
	 * Cancel all tasks in the queue
	 */
	cancel(): void {
		this.tasks = [];
	}

	/**
	 * Remove a specific task from the queue
	 * @param product The product identifier of the task to remove
	 */
	remove(product: string): void {
		this.tasks = this.tasks.filter(task => task.product !== product);
	}

	/**
	 * Get all tasks in the queue
	 * @returns Array of tasks
	 */
	list(): Task[] {
		return [...this.tasks];
	}

	/**
	 * Execute all tasks in the queue
	 * @returns Promise that resolves when all tasks are complete
	 */
	async execute(): Promise<void> {
		const tasks = [...this.tasks];
		this.tasks = [];
		
		await Promise.all(tasks.map(task => task.task()));
	}
}
