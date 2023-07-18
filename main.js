const baseUrl = "http://localhost:3000";
const createCheckbox = (todoDataItem, todoElementRef) => {
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.name = "isDone";
  checkBox.checked = todoDataItem.is_done;

  checkBox.addEventListener("change", async (e) => {
    const inputValues = {
      isDone: e.target.checked,
      userId: localStorage.getItem("id"),
      value: todoDataItem.value,
      todoItemId: todoDataItem.id,
    };
    todoElementRef.classList.toggle("done-todo-container");
    fetch(`${baseUrl}/todos/update-todo-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValues),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      });
  });
  return checkBox;
};

const createDeleteButton = (todoDataItem, todoElementRef) => {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "X";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const inputValues = {
      userId: localStorage.getItem("id"),
      todoItemId: todoDataItem.id,
    };
    fetch(`${baseUrl}/todos/delete-todo-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValues),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        todoElementRef.remove();
      });
  });
  return deleteButton;
};

const getTodoElement = (todo) => {
  const todoItem = document.createElement("li");
  todoItem.className = "todo-container";
  const checkBox = createCheckbox(todo, todoItem);
  console.log("todo", checkBox);
  if (todo.is_done) {
    todoItem.classList.toggle("done-todo-container");
  }
  todoItem.appendChild(checkBox);
  const todoTitle = document.createElement("span");
  todoTitle.innerHTML = todo.value;
  todoTitle.className = "todo-title";
  todoItem.appendChild(todoTitle);
  const span = document.createElement("span");
  span.className = "todo-checkmark";
  todoItem.appendChild(todoTitle);
  todoItem.appendChild(span);
  const deleteButton = createDeleteButton(todo, todoItem);
  todoItem.appendChild(deleteButton);
  todoItem.addEventListener("click", (e) => {
    if (e.target.tagName === "INPUT") return;
    checkBox.click();
  });
  return todoItem;
};

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if (isLoggedIn) {
    fetch(`${baseUrl}/todos?userId=${localStorage.getItem("id")}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        const todoList = document.querySelector(".todo-list");
        data.forEach((todo) => {
          const todoItem = getTodoElement(todo);
          todoList.appendChild(todoItem);
        });
      });
    const todoBox = document.querySelector(".todo-box");
    todoBox.style.display = "block";

    const addTodoButton = document.querySelector(".add-item-button");
    addTodoButton.addEventListener("click", async () => {
      const inputValues = {
        value: document.querySelector(".add-item-input").value,
        userId: localStorage.getItem("id"),
      };
      console.log('"~~~ hello', inputValues);

      fetch(`${baseUrl}/todos/add-todo-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValues),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          const todoDataItem = data[data.length - 1];
          const todoList = document.querySelector(".todo-list");
          const todoItem = getTodoElement(todoDataItem);
          todoList.appendChild(todoItem);
          const inputNode = document.querySelector(".add-item-input");
          inputNode.value = "";
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

    const inputBox = document.querySelector(".add-item-input");
    inputBox.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        addTodoButton.click();
      }
    });
  } else {
    const loginBox = document.querySelector(".login-box");
    loginBox.style.display = "block";
  }

  // login
  const submitButton = document.querySelector(".login-submit-button");
  submitButton.addEventListener("click", async () => {
    const inputValues = {
      email: document.querySelector(".login-email-input").value,
      password: document.querySelector(".login-password-input").value,
    };
    console.log('"~~~ hello', inputValues);
    fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValues),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("id", data.user.id);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // signup
  const signUp = document.querySelector(".signup-submit-button");
  signUp.addEventListener("click", async () => {
    const inputValues = {
      name: document.querySelector(".signup-name-input").value,
      email: document.querySelector(".signup-email-input").value,
      password: document.querySelector(".signup-password-input").value,
      confirmPassword: document.querySelector(".signup-confirm-password-input")
        .value,
    };

    if (inputValues.password !== inputValues.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    fetch(`${baseUrl}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValues),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("id", data.user.id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
