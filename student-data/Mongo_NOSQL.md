# SQL 指令統計各科系人數
db.studentslist.aggregate([
  { $group: { _id: "$院系", 人數: { $sum: 1 } } },
  { $project: { 院系: "$_id", 人數: 1, _id: 0 } }
])
