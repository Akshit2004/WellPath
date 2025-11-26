import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Todo } from "@/context/TodoContext";

export interface FirestoreTodo extends Omit<Todo, "createdAt" | "dueDate"> {
    createdAt: Timestamp;
    dueDate: Timestamp | null;
    userId: string;
}

export const todoService = {
    // Subscribe to user's todos in real-time
    subscribeTodos: (userId: string, callback: (todos: Todo[]) => void) => {
        const q = query(
            collection(db, "todos"),
            where("userId", "==", userId)
        );

        return onSnapshot(q, (snapshot) => {
            const todos: Todo[] = snapshot.docs.map((doc) => {
                const data = doc.data() as FirestoreTodo;
                return {
                    id: doc.id,
                    text: data.text,
                    completed: data.completed,
                    priority: data.priority,
                    createdAt: data.createdAt?.toMillis() || Date.now(),
                    dueDate: data.dueDate?.toMillis() || null,
                    order: data.order || 0,
                };
            });
            callback(todos);
        });
    },

    // Add a new todo
    addTodo: async (userId: string, todo: Omit<Todo, "id">) => {
        await addDoc(collection(db, "todos"), {
            ...todo,
            userId,
            createdAt: Timestamp.fromMillis(todo.createdAt),
            dueDate: todo.dueDate ? Timestamp.fromMillis(todo.dueDate) : null,
        });
    },

    // Update a todo
    updateTodo: async (todoId: string, updates: Partial<Todo>) => {
        const todoRef = doc(db, "todos", todoId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firestoreUpdates: Record<string, any> = { ...updates };

        if (updates.dueDate !== undefined) {
            firestoreUpdates.dueDate = updates.dueDate
                ? Timestamp.fromMillis(updates.dueDate)
                : null;
        }

        await updateDoc(todoRef, firestoreUpdates);
    },

    // Delete a todo
    deleteTodo: async (todoId: string) => {
        await deleteDoc(doc(db, "todos", todoId));
    },

    // Clear completed todos
    clearCompleted: async (userId: string, completedIds: string[]) => {
        const deletePromises = completedIds.map((id) =>
            deleteDoc(doc(db, "todos", id))
        );
        await Promise.all(deletePromises);
    },
};
