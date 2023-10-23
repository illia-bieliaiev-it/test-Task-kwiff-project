What is the main difference between these two functions? 
Why is one better than the other?

const db = myDatabaseManager;

const myDbFunc = async (data) => {
    await db(INSERT INTO table (id,name,age) 
    VALUES(${data.id},“{data.name}”, ${data.age}) 
    ON DUPLICATE KEY UPDATE name =‘${data.name}”,age=${data.age};‘)
    }
    
const myOtherDbFunc = async (data) => {    
    const updatedRows = await db(`UPDATE table SET (name, age) VALUES ("${data.name}",${data.age}) WHERE id = ${data.id} RETURNING *;`)    
    // If no rows were updated    
    if (!updatedRows) {
        await db(`INSERT INTO table (id, name, age) VALUES(${data.id},"${data.name}", ${data.age});`)
    }}