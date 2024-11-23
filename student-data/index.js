const { listStudents } = require('./listStudents'); // 引入 listStudents.js
const { deleteDuplicates } = require('./removeDuplicates'); // 引入 removeDuplicates.js

async function run() {
    console.log("學生名單：");
    await listStudents(); // 顯示學生名單

    console.log("\n正在刪除重複資料...");
    await deleteDuplicates(); // 刪除重複資料
}

run(); // 執行主函式
