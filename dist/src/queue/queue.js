/**
 * A queue for managing asynchronous tasks
 */
export default class Queue {
    constructor() {
        this.tasks = [];
    }
    /**
     * Add a new task to the queue
     * @param task The task to add
     */
    push(task) {
        this.tasks.push(task);
    }
    /**
     * Cancel all tasks in the queue
     */
    cancel() {
        this.tasks = [];
    }
    /**
     * Remove a specific task from the queue
     * @param product The product identifier of the task to remove
     */
    remove(product) {
        this.tasks = this.tasks.filter(task => task.product !== product);
    }
    /**
     * Get all tasks in the queue
     * @returns Array of tasks
     */
    list() {
        return [...this.tasks];
    }
    /**
     * Execute all tasks in the queue
     * @returns Promise that resolves when all tasks are complete
     */
    async execute() {
        const tasks = [...this.tasks];
        this.tasks = [];
        await Promise.all(tasks.map(task => task.task()));
    }
}
//# sourceMappingURL=queue.js.map