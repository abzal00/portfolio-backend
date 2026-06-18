const express = require('express');
const fs = require('fs')
const {Pool} = require('pg');
const app = express(); 
require('dotenv').config()
const port = 3003; 
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'portfolio',
    password: process.env.DB_PASSWORD,
    port: 5432,
})

app.use(express.json());
app.get("/" , (req, res)=>{
   return res.send("my first parfolio ")
});

// app.get("/api/notes", (req,res)=>{
    
//     const read = fs.readFileSync('data/notes.json', 'utf-8');
//     const parse = JSON.parse(read)
//     return res.json(parse.notes)
// })
app.get("/api/notes", async (req,res)=>{
    const result = await pool.query('SELECT * FROM notes');
    return res.json(result.rows);
})

// app.post("/api/notes", (req,res)=> {
//     const {title, content} = req.body;
//     const readNotes = fs.readFileSync('data/notes.json', 'utf-8');
//     const newData = JSON.parse(readNotes)
//     const newNote = {id: Date.now(), title, content};
//     newData.notes.push(newNote)
    
//     fs.writeFileSync('data/notes.json', JSON.stringify(newData, null, 2))
//     return res.status(201).json(newNote)
// })

app.post("/api/notes", async(req,res)=>{
    const {title, content} = req.body
    const result = await pool.query('INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
        [title, content]
    );
    return res.status(201).json(result.rows[0])
})

// app.delete("/api/notes/:id", (req,res)=>{
//     const id = req.params.id;

//     const notesRead = fs.readFileSync('data/notes.json', 'utf-8');
//     const notes = JSON.parse(notesRead);
//     const deleteId = notes.notes.filter(not => not.id !== Number(id) );
//     notes.notes = deleteId
//     fs.writeFileSync('data/notes.json', JSON.stringify(notes, null, 2))
//     res.status(201).json({message: 'deleted'})
// })

app.delete("/api/notes/:id", async(req, res)=> {
    const id = req.params.id;
    const result =  await pool.query('DELETE FROM notes WHERE id = $1',
        [id]
    )
    return res.status(200).json( {message: "deleted "})
})
app.listen(port, ()=>{
    console.log("server started ")
} )