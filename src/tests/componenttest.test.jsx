
import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import TodoSummary from "../components/TodoSummary.jsx";
import TodoList from "../components/TodoList.jsx";
import TodoItem from "../components/TodoItem.jsx";
import TodoForm from "../components/TodoForm.jsx";




describe("Komponenttester för todoapp ", () => {
  test("testa todosummary", () => {

     const tasks = [
      { title: "spela", id: 3, completed: false },
      { title: "fiska", id: 1, completed: true },
      { title: "äta", id: 2, completed: true },
    ];


    render(<TodoSummary tasks={tasks}/>);
      expect(screen.getByText("Totalt: 3")).toBeInTheDocument();
      expect(screen.getByText("Aktiva: 1")).toBeInTheDocument();
      expect(screen.getByText("Slutförda: 2")).toBeInTheDocument();

  });

test("testa tom todoLista", () => {
  render(<TodoList hasAnyTasks={false}/>)
  expect(screen.getByText("Det finns inga uppgifter ännu.")).toBeInTheDocument();


})
test("testa completed filter med endast aktiva todos", () => {
  const tasks = [];

  render(
    <TodoList
      hasAnyTasks={true}
      tasks={tasks}
      selectedFilter={"completed"}
    />
  );

  expect(
    screen.getByText("Det finns inga slutförda uppgifter.")
  ).toBeInTheDocument();
});
test("visa alla tasks", () => {
    const tasks = [
      { title: "spela", id: 3, completed: false },
      { title: "fiska", id: 1, completed: true },
      { title: "äta", id: 2, completed: true },
    ];

    render(<TodoList tasks={tasks} hasAnyTasks={true}/>)


    tasks.forEach((task) => {
  expect(screen.getByText(task.title)).toBeInTheDocument();
  });
})


test("ska kalla på ondelete med rätt id när todo ta bort-knapp klickas",() => {
const task =  { title: "spela", id: 3, completed: false }
const handleClick = vi.fn();
render(<TodoItem onDeleteTask={handleClick} task={task}/>)
const deleteBtn = screen.getByRole("button");
fireEvent.click(deleteBtn);
expect(handleClick).toHaveBeenCalledWith(3);

});

test("ska kalla på onAddTask när todo skapas", () => {
const handleSubmitMock = vi.fn();
render(<TodoForm onAddTask={handleSubmitMock}/>);
const submitBtn = screen.getByRole("button");
const todoInput = screen.getByPlaceholderText("Vad behöver du göra?");
fireEvent.change(todoInput, { target: { value: 'baka bröd' } });
fireEvent.click(submitBtn);
expect(handleSubmitMock).toHaveBeenCalledWith( 'baka bröd');

})

test("ska skicka en slutförd uppgift när checkboxen klickas", async () => {
  const task = {
    id: 1,
    title: "Handla mat",
    completed: true,
  };

  const onToggleTask = vi.fn();


  render(
    <TodoItem
      task={task}
      onToggleTask={onToggleTask} 
    />
  );

  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);
  expect(onToggleTask).toHaveBeenCalledWith(task);
});



 
});