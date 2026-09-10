import { describe, expect, test } from "vitest";
import { createTask, deleteTask, getTasks } from "../services/taskApi";

describe("integrationstester för todoapp", () => {
  //read
  test("ska kunna returnera rätt data vid hämtning av todos", async () => {
    //säkerställa att inte listan är tom
    await createTask("baka bröd");

    const todoList = await getTasks();
    expect(todoList).not.toBe(null);
    expect(todoList.length).toBeGreaterThan(0);

    todoList.forEach((todo) => {
      expect(typeof todo.title).toBe("string");
      expect(typeof todo.completed).toBe("boolean");
      expect(typeof todo.id).toBe("string");
    });
  }, 30000);

  //create
  test("Ska kunna skapa en ny todo via API:t och returnera den skapade uppgiften med korrekt titel, id och completed-status.", async () => {
    const todo = "spela spel";
    const newTodo = await createTask(todo);

    expect(newTodo.completed).toBe(false);
    expect(newTodo.title).toContain("spela spel");
    expect(newTodo.id).not.toBe(null);
  }, 30000);

  //delete
  test("ska kunna radera en todo via API:t", async () => {
    const title = "äta lunch";
    const newTodo = await createTask(title);

    const todosBeforeDelete = await getTasks();

    //kontrollera att todo har lagts till i listan
    const found = todosBeforeDelete.find((todo) => todo.id === newTodo.id);
    expect(found).not.toBe(undefined);
    expect(found.id).toBe(newTodo.id);

    //radera todo
    const deletedTodo = await deleteTask(newTodo.id);
    const todosAfterDelete = await getTasks();

    const isFound = todosAfterDelete.find((todo) => todo.id == deletedTodo.id);

    expect(isFound).toBe(undefined);
    expect(todosAfterDelete).not.toContain(deletedTodo);
  }, 30000);

  test("ska kasta ett fel om man försöker radera en todo som inte finns", async () => {
    await expect(deleteTask(123)).rejects.toThrow(
      "Det gick inte att ta bort uppgiften.",
    );
  }, 30000);
});
