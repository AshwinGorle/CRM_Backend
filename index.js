import express from 'express';

const app = express();

app.listen(1234, ()=>{
    console.log('Server is running on port 1234.....');
})