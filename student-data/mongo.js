const { MongoClient } = require('mongodb');
const csv = require('csv-parser');
const fs = require('fs');

// MongoDB 連線設定
const uri = 'mongodb://127.0.0.1:27017'; // MongoDB 連線地址
const client = new MongoClient(uri);

// 配置文件路徑
const csvFilePath = 'studentslist.csv';

// 核心功能：讀取 CSV 文件
async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                data.push(row); // 逐行讀取並存入陣列
            })
            .on('end', () => {
                console.log(`CSV 文件讀取完成，共 ${data.length} 行。`);
                resolve(data);
            })
            .on('error', (error) => {
                reject(`讀取 CSV 文件時出錯: ${error}`);
            });
    });
}

// 核心功能：插入資料到 MongoDB
async function insertDataToMongoDB(data) {
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();

        const database = client.db('411631327'); // 資料庫名稱
        const collection = database.collection('studentslist'); // 集合名稱

        // 插入資料
        const result = await collection.insertMany(data);
        console.log(`成功插入 ${result.insertedCount} 筆資料。`);
    } catch (error) {
        console.error('插入資料時發生錯誤:', error);
    } finally {
        await client.close();
        console.log('MongoDB 連線已關閉。');
    }
}

// 主函式：執行 CSV 讀取與資料插入
async function run() {
    if (!fs.existsSync(csvFilePath)) {
        console.error(`錯誤：CSV 文件 "${csvFilePath}" 不存在。`);
        process.exit(1);
    }

    try {
        const data = await readCSV(csvFilePath); // 讀取 CSV 文件
        if (data.length === 0) {
            console.warn('警告：CSV 文件為空，無需插入資料。');
            return;
        }

        console.log('第一筆資料樣本:', data[0]); // 列出第一筆資料供檢查
        await insertDataToMongoDB(data); // 插入資料到 MongoDB
    } catch (error) {
        console.error('程式執行過程中發生錯誤:', error);
    }
}

// 呼叫主函式
run();
