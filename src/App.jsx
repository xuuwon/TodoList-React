import { useEffect, useRef, useState, useFetch } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss';


function App() {
  const [todoLists, setTodoLists] = useState([]);

  useEffect(() => { // 서버에서 데이터 받아오기 
    fetch("http://localhost:3001/todo")
      .then(res => res.json())
      .then(res => setTodoLists(res))
  }, [])

  return (
    <>
      <TodoInput setTodoLists={setTodoLists} todoLists={todoLists} />
      <TodoList todoLists={todoLists} setTodoLists={setTodoLists} />
      <Footer />
    </>
  )
}

function TodoInput({ setTodoLists, todoLists }) {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className='todo-input'>
      <h1 className='todo-input-text'>
        TODO LIST
      </h1>
      <div className='todo-input-buttons'>
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          className='todoInput'
          style={{ width: "270px" }}
        />
        <button onClick={() => {
          if (inputValue.trim()) {
            const newTodoList = { content: inputValue, isDone: false }
            setInputValue('') // 빈 값으로 초기화

            fetch("http://localhost:3001/todo", { // 아이디는 알아서 만들어줌
              method: "POST", // url에 데이터 보내기
              body: JSON.stringify(newTodoList)
            }).then(res => res.json())
              .then(res => setTodoLists((prev) => [...prev, res]))
          }
        }}
        className='main-button'
        >ADD</button>
        <button onClick={() => {
          Promise.all(todoLists.map(todo =>
            fetch(`http://localhost:3001/todo/${todo.id}`, {
              method: "DELETE"
            })
          )).then(() => {
            // 상태를 비워서 전체 삭제된 상태를 반영
            setTodoLists([]);
          });
        }}
        className='main-button'
        >DELETE</button>
      </div>
    </div>
  )
}

function TodoList({ todoLists, setTodoLists }) {
  return (
    <ul className='todoList'>
      {todoLists.map((todoList) => <Todo
        key={todoList.id}
        todoList={todoList}
        todoLists={todoLists}
        setTodoLists={setTodoLists} />
      )}
    </ul>
  )
}

function Todo({ todoLists, todoList, setTodoLists }) {
  const [isDone, setIsDone] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false); 

  const doneTodo = () => {
    setIsDone(!isDone);

    const incompletedTodoList = (todoLists.filter((el) => el.id !== todoList.id)); // 완료되지 않은 리스트
    const completedTodo = { id: todoList.id, content: todoList.content, isDone: !todoList.isDone }; // 완료된 항목

    setTodoLists([...incompletedTodoList, completedTodo])
  };

  useEffect(() => {
    const incompletedTodoList = todoLists.filter((el) => !el.isDone);
    const completedTodoList = todoLists.filter((el) => el.isDone);

    // 기존 상태와 비교하여 리스트가 변경되었을 때만 상태 업데이트
    const newTodoLists = [...incompletedTodoList, ...completedTodoList];

    // 상태가 변경된 경우에만 업데이트 (불필요한 업데이트 방지)
    if (JSON.stringify(newTodoLists) !== JSON.stringify(todoLists)) {
      setTodoLists(newTodoLists);
    }
  }, [todoLists, setTodoLists]);

  const deleteTodo = () => {
    fetch(`http://localhost:3001/todo/${todoList.id}`, { 
      method: "DELETE", // url에 데이터 보내기
    }).then((res) => res.json());

    setTodoLists(todoLists.filter((el) => el.id !== todoList.id))
  }


  return (
    <div className='todo'>
      <li style={{ listStyle: "none", display: "flex" }}>
        <div className={`${isDone ? "done" : ""}`} onClick={() => setIsUpdate(true)}>
          {isUpdate ?
            <UpdateTodo todoList={todoList} todoLists={todoLists} setTodoLists={setTodoLists} setIsUpdate={setIsUpdate}/> 
            : (todoList.content)}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => { doneTodo() }} className={isDone ? "done-button" : ""}>Done</button>
          <button onClick={() => { deleteTodo() }}>Delete</button>
        </div>
      </li>
    </div>
  )
}


function UpdateTodo({ todoList, todoLists, setTodoLists, setIsUpdate}) {
  const [updateTodoInput, setTodoUpdateInput] = useState(todoList.content);

  const modifyTodo = () => {
    const updatedTodos = todoLists.map((el) =>
      el.id === todoList.id ? { ...el, content: updateTodoInput } : el
    );
    const modifyTodos = updatedTodos.find((el) => el.id === todoList.id)

    fetch(`http://localhost:3001/todo/${todoList.id}`, { // 아이디는 알아서 만들어줌
      method: "PUT", // url에 데이터 보내기
      body: JSON.stringify(modifyTodos)
    }).then((res) => res.json());

    setTodoLists(updatedTodos);  // 상태 업데이트 후 리렌더링 발생
    setIsUpdate(false);  // 수정 모드 종료
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center'
    }}>
      <input
        value={updateTodoInput}
        className='modifyInput'
        onChange={(event) => setTodoUpdateInput(event.target.value)}
      />
      <button onClick={(event) => {
        modifyTodo();
        event.stopPropagation(); // 부모 요소의 클릭 이벤트 막기
        setIsUpdate(false)
      }}>Modify</button>
    </div>
  )
}

function Footer() {
  const [text, setText] = useState(null);

  useEffect(() => {
    fetch("https://korean-advice-open-api.vercel.app/api/advice")
      .then(res => res.json())
      .then(res => setText(res))
  }, [])

  return (
    <div className='footer'>
      {text &&
        <div className='footer-text'>
          <p>{text.message}</p>
          <p>- {text.author} -</p>
        </div>
      }
    </div>
  )
}



export default App