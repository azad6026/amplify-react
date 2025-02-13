import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function addAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = formData.get("todo") as string;
    console.log(data);
    client.models.Todo.create({ content: data });
  }
  function editAction(e: React.ChangeEvent<HTMLInputElement>, id: string) {
    client.models.Todo.update({ id, content: e.target.value });
  }
  function deleteAction(id: string) {
    client.models.Todo.delete({ id });
  }
  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <form onSubmit={addAction}>
        <label htmlFor="todo">Todo</label>
        <input type="text" id="todo" name="todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              onChange={(e) => editAction(e, todo.id)}
              value={todo.content ?? ""}
            />
            <button onClick={() => deleteAction(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div></div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
