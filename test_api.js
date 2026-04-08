async function runTests() {
  try {
    console.log("1. POST /api/todos 테스트: 할 일 추가 중...");
    const postRes = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "API 테스트 코딩하기 🚀" })
    });
    const postData = await postRes.json();
    console.log("=> 생성된 Todo:", postData);
    const todoId = postData._id;

    console.log("\n2. GET /api/todos 테스트: 할 일 목록 조회 중...");
    const getRes = await fetch("http://localhost:5000/api/todos");
    const getData = await getRes.json();
    console.log(`=> 현재 Todo 개수: ${getData.length}개`);

    console.log(`\n3. PUT /api/todos/${todoId} 테스트: 완료 처리 중...`);
    const putRes = await fetch(`http://localhost:5000/api/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true })
    });
    const putData = await putRes.json();
    console.log("=> 업데이트된 Todo:", putData);

    console.log(`\n4. DELETE /api/todos/${todoId} 테스트: 삭제 중...`);
    const deleteRes = await fetch(`http://localhost:5000/api/todos/${todoId}`, { method: "DELETE" });
    const deleteData = await deleteRes.json();
    console.log("=> 삭제 결과:", deleteData);
    
    console.log("\n✅ 모든 엔드포인트 테스트가 성공적으로 완료되었습니다!");
  } catch (error) {
    console.error("테스트 중 에러 발생:", error);
  }
}
runTests();
