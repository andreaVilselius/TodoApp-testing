import { describe, expect, test } from "vitest";

import {
  countActiveTasks,
  countCompletedTasks,
  filterTasks,
  validateTitle,
} from "../utils/taskUtils";

describe("TodoAppen", () => {
  ////enhetstester med vite -10 st
  test("validera att tom todotext returnerar felmeddelande ", () => {
    //arrange
    const emptyText = "";
    const expectedResult = "Skriv en uppgift innan du fortsätter.";

    //act
    const result = validateTitle(emptyText);

    //assert
    expect(result).toBe(expectedResult);
  });

  test("validera att för kort text returnerar ett felmeddelande", () => {
    const textShorterThanTwoChars = "b";
    const expectedResult = "Uppgiften måste innehålla minst två tecken.";

    const result = validateTitle(textShorterThanTwoChars);

    expect(result).toBe(expectedResult);
  });

  test("validera att textsträng med exakt 2 tecken returnerar en tom sträng", () => {
    const title = "ab";
    const expectedResult = "";
    const result = validateTitle(title);

    expect(result).toBe(expectedResult);
  });

  test("visa antalet aktiva uppgifter", () => {
    //arrange
    const tasks = [
      { title: "spela", id: 3, completed: false },
      { title: "fiska", id: 1, completed: true },
      { title: "äta", id: 3, completed: true },
    ];

    //act
    const activeTasks = countActiveTasks(tasks);

    //assert
    expect(activeTasks).toBe(1);
  });

  test("visa antalet slutförda uppgifter", () => {
    //arrange
    const tasks = [
      { title: "spela", id: 3, completed: false },
      { title: "fiska", id: 1, completed: true },
      { title: "äta", id: 3, completed: true },
    ];

    //act
    const activeTasks = countCompletedTasks(tasks);

    //assert
    expect(activeTasks).toBe(2);
  });

  test("visa totalt antal uppgifter", () => {
    const tasks = [
      { title: "spela", id: 3, completed: false },
      { title: "fiska", id: 1, completed: true },
      { title: "äta", id: 3, completed: true },
    ];

    const activeTasks = countActiveTasks(tasks);
    const completedTasks = countCompletedTasks(tasks);
    const result = activeTasks + completedTasks;

    expect(result).toBe(3);
  });

  //filtrering
  test("filtrera en tom lista", () => {
    const tasks = [];
    const expectedResult = [];
    const result = filterTasks(tasks);
    expect(result).toStrictEqual(expectedResult);
  });

  test("filtrera aktiva uppgifter", () => {
    const tasks = [
      { title: "spela", id: 3, completed: false },
      { title: "fiska", id: 1, completed: true },
      { title: "äta", id: 3, completed: true },
    ];

    const expectedResult = [{ title: "spela", id: 3, completed: false }];

    const result = filterTasks(tasks, "active");

    expect(result).toStrictEqual(expectedResult);
  });

  test("filtrera alla uppgifter", () => {
    const tasks = [
      { title: "spela", id: 3, completed: false },
      { title: "fiska", id: 1, completed: true },
      { title: "äta", id: 3, completed: true },
    ];

    const expectedResult = tasks;

    const result = filterTasks(tasks);

    expect(result).toStrictEqual(expectedResult);
  });

  test("filtrera slutförda uppgifter", () => {
    const tasks = [
      { title: "spela", id: 3, completed: false },
      { title: "fiska", id: 1, completed: true },
      { title: "äta", id: 3, completed: true },
    ];

    const expectedResult = [
      { title: "fiska", id: 1, completed: true },
      { title: "äta", id: 3, completed: true },
    ];

    const result = filterTasks(tasks, "completed");

    expect(result).toStrictEqual(expectedResult);
  });
});
