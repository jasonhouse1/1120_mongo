const { MongoClient } = require('mongodb');

// MongoDB 連線設定
const uri = 'mongodb://127.0.0.1:27017'; // MongoDB 連線地址

// 建立 MongoDB 連線
async function connectToDb() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('成功連接到 MongoDB');
        return client; // 回傳 MongoClient 實例
    } catch (error) {
        console.error('無法連接到 MongoDB:', error);
        process.exit(1); // 如果連線失敗，終止程式
    }
}

// 關閉 MongoDB 連線
async function closeDbConnection(client) {
    try {
        await client.close();
        console.log('MongoDB 連線已關閉');
    } catch (error) {
        console.error('關閉 MongoDB 連線失敗:', error);
        throw error;
    }
}

module.exports = { connectToDb, closeDbConnection };
