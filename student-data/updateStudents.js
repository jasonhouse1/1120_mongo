const { connectToDb, closeDbConnection } = require('./db'); // 引用連線管理模組

async function countDepartments() {
    const client = await connectToDb();

    try {
        const database = client.db('411631327'); // 資料庫名稱
        const collection = database.collection('studentslist'); // 集合名稱

        // 聚合管道統計各院系人數
        const departmentCounts = await collection.aggregate([
            {
                $group: {
                    _id: "$院系", // 按 "院系" 分組
                    人數: { $sum: 1 } // 計算每組的數量
                }
            },
            { $sort: { 人數: -1 } } // 按人數降序排序
        ]).toArray();

        console.log("各科系人數統計：");
        departmentCounts.forEach((dept) => {
            console.log(`院系: ${dept._id}, 人數: ${dept.人數}`);
        });
    } catch (error) {
        console.error("統計各科系人數時發生錯誤:", error);
    } finally {
        await closeDbConnection(client);
    }
}

async function addAbsenceField() {
    const client = await connectToDb();

    try {
        const database = client.db('411631327'); // 資料庫名稱
        const collection = database.collection('studentslist'); // 集合名稱

        // 隨機生成 0~5 的缺席次數並更新每個學生的資料
        const result = await collection.updateMany(
            {}, // 更新條件，選擇所有文檔
            [
                {
                    $set: { 缺席次數: { $floor: { $multiply: [Math.random(), 6] } } } // $set 使用 $floor 和 $multiply 隨機生成 0~5 的整數
                }
            ]
        );

        console.log(`已更新 ${result.modifiedCount} 筆資料，新增 "缺席次數" 欄位`);
    } catch (error) {
        console.error("更新缺席次數時發生錯誤:", error);
    } finally {
        await closeDbConnection(client);
    }
}

async function run() {
    console.log("開始統計各科系人數：");
    await countDepartments();

    console.log("\n新增缺席次數欄位並隨機填值：");
    await addAbsenceField();
}

run();
