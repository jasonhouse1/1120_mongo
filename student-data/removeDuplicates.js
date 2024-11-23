const { connectToDb, closeDbConnection } = require('./db'); // 引入 db.js

async function deleteDuplicates() {
    const client = await connectToDb();
    try {
        const database = client.db('411631327'); // 資料庫名稱
        const collection = database.collection('studentslist'); // 集合名稱

        // 聚合管道找出重複項
        const duplicates = await collection.aggregate([
            {
                $group: {
                    _id: { 帳號: "$帳號" }, // 按帳號分組
                    count: { $sum: 1 },
                    ids: { $push: "$_id" }
                }
            },
            { $match: { count: { $gt: 1 } } } // 過濾出重複的組
        ]).toArray();

        if (duplicates.length === 0) {
            console.log("未發現重複資料");
            return;
        }

        // 收集需要刪除的 _id
        const idsToDelete = [];
        for (const duplicate of duplicates) {
            const [keep, ...remove] = duplicate.ids; // 保留第一筆
            idsToDelete.push(...remove); // 收集需要刪除的 _id
        }

        // 刪除重複資料
        const result = await collection.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`成功刪除 ${result.deletedCount} 筆重複資料`);
    } catch (error) {
        console.error("刪除重複資料時發生錯誤:", error);
    } finally {
        await closeDbConnection(client); // 確保關閉資料庫連線
    }
}

module.exports = { deleteDuplicates };
