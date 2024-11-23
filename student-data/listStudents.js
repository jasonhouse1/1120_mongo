const { connectToDb, closeDbConnection } = require('./db'); // 引入 db.js

async function listStudents() {
    const client = await connectToDb();
    try {
        const database = client.db('411631327'); // 資料庫名稱
        const collection = database.collection('studentslist'); // 集合名稱

        const students = await collection.find({}).toArray(); // 查詢所有學生資料
        console.log('學生名單：');
        students.forEach((student, index) => {
            console.log(`${index + 1}. 帳號: ${student.帳號}, 座號: ${student.座號}, 姓名: ${student.姓名}, 院系: ${student.院系}, 年級: ${student.年級}, 班級: ${student.班級}, Email: ${student.Email}`);
        });
    } catch (error) {
        console.error("無法查詢學生名單:", error);
    } finally {
        await closeDbConnection(client); // 確保關閉資料庫連線
    }
}

module.exports = { listStudents };
