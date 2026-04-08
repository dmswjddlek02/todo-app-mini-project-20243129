import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PhysicsCanvas } from './components/PhysicsCanvas';
import { TodoItem } from './components/TodoItem';
import { Plus } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const physicsRef = useRef(null);
  const themeCounterRef = useRef(0);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      // 처음 로딩 시 순서대로 인덱스를 고정 부여해서 중간 삭제시에도 색이 변하지 않도록 설정
      const loadedData = res.data.map((t, idx) => ({ ...t, themeIndex: idx % 4 }));
      setTodos(loadedData);
      themeCounterRef.current = loadedData.length;
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await axios.post(API_URL, { title: newTitle });
      // 추가될 때의 순서를 테마 인덱스로 영구 고정
      const newTodo = { ...res.data, themeIndex: themeCounterRef.current % 4 };
      setTodos([...todos, newTodo]);
      themeCounterRef.current++;
      setNewTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id, themeIndex) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos((prev) => prev.filter(t => t._id !== id));
      
      // 내려오는 도형이랑 같은 예전 도형은 서서히 지워지도록 PhysicsCanvas에서 자체 처리
      if (physicsRef.current) {
        physicsRef.current.dropShape(themeIndex);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-full bg-[var(--color-bg-dark)] relative flex flex-col">
      {/* 캔버스 영역 축소 (1/4 비율)하여 카드들이 4개까지 보일 수 있도록 */}
      <div className="relative w-full h-[25%] shrink-0">
        <PhysicsCanvas ref={physicsRef} />
      </div>

      {/* 화면의 하단 영역 확장 (3/4 비율) */}
      <div className="relative z-10 w-full h-[75%] flex flex-col px-6 pb-6 max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#FFFFFF] mt-6 mb-4 tracking-tight">
          To-do list
        </h1>
        
        {/* 드래그 영역 침범 방지를 위해 리스트만 스크롤 되게 설정 */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2 no-scrollbar">
          <div className="flex flex-col">
            {todos.map((todo) => (
              <TodoItem 
                key={todo._id} 
                todo={todo} 
                index={todo.themeIndex} // 인덱스 고정값 전달하여 색상 변동 방지
                onDelete={deleteTodo} 
              />
            ))}
          </div>
        </div>

        {/* 2/3 컨테이너의 하단에 입력 폼 이동 */}
        <form onSubmit={addTodo} className="flex shrink-0">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new task"
            className="flex-1 bg-white/5 text-white placeholder-white/40 px-6 py-4 rounded-[2rem] outline-none focus:ring-2 focus:ring-[var(--color-theme-blue)] transition-all font-semibold"
          />
          <button 
            type="submit" 
            className="ml-3 bg-[var(--color-theme-blue)] text-[var(--color-bg-dark)] w-14 h-14 rounded-full flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
