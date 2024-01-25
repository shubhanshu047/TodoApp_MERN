const exp = require('express');
const app = exp();
const mongo = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(cors())

app.use(exp.json());
const PORT = 4000;

mongo.connect('mongodb://127.0.0.1:27017/code')

const us = new mongo.Schema({
    email: String,
    password: String,
}
)
const ts = new mongo.Schema({
    user: String,
    title: String,
    description: String,
}, { _id: true });
const User = mongo.model('User', us);
const Todo = mongo.model('Todo', ts);

async function middleware(req, res, next) {
    const userToken = req.headers.authorization;

    try {
        const decodeToken = await jwt.verify(userToken, "sfkdf7987dffsn98");
        const user = await User.findOne({ email: decodeToken.user })
        if (!user) {
            return res.status(401).json({ message: "Unauthorized User" })
        }
        req.userintoken = user.email
        next()
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized User" })
    }
}

app.post('/api/login', async (req, res) => {

    const { uname, pass } = req.body;
    const userexist = await User.findOne({ email: uname });

    if (!userexist || pass != userexist.password) {
        res.status(300).json({ message: 'Invalid username or password' })
    }
    else {
        const token = jwt.sign({ user: uname }, "sfkdf7987dffsn98", { expiresIn: "1h" })
        res.status(201).json({ token: token, message: "Logged in successfully" })
    }
})
app.post('/api/Register', async (req, res) => {

    const { uname, pass } = req.body;
    const userexist = await User.findOne({ email: uname });

    if (userexist) {
        res.status(300).json({ message: 'This email id already registered, please try something else.' })
    }
    else {
        const adduser = await User.create({ email: uname, password: pass });
        res.status(201).json({ message: "New user created." })
    }
})
app.post('/api/getone', middleware, async (req, res) => {
    let todolist = null
    try {
        const uname = req.userintoken
        const start = req.body.start
        const end = req.body.end
        getlength = await Todo.find({user: uname})
        todolist = await Todo.find({ user: uname }).skip(start).limit(end - start);

        // firsttask = await Todo.findOne()
        // lasttask = await Todo.findOne({}, { sort: { _id: -1 }, limit: 1 });
        if (todolist == "") {
            return res.status(404).json({ message: "You do not have any tasks yet..." });
        }
        else {
            res.status(201).json({ todolist: todolist, todocount: getlength.length })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error :- " + error })
    }
})
app.post('/api/addtask', middleware, async (req, res) => {

    try {
        const addtodo = await Todo.insertMany({ user: req.userintoken, title: req.body.title, description: req.body.des })
        res.status(201).json({ message: "New task added successfully !" })
    }
    catch (error) {
        res.status(500).json({ message: "Error while adding new task" })
    }
})
app.put('/api/edittask', middleware, async (req, res) => {

    try {
        const { id, title, des } = req.body;
        const updatedata = await Todo.updateOne({ _id: id }, { $set: { title: title, description: des } });
        if (!updatedata) {
            return res.status(404).json({ message: "Todo task not found" })
        }
        else {
            return res.status(201).json({ message: "Data updated successfully" })
        }
    } catch (error) {
        return res.status(404).json({ message: "Todo task not found" })
    }
})
app.delete('/api/deletetask', middleware, async (req, res) => {

    try {
        const id = req.body._id;
        const deletedata = await Todo.deleteOne({ "_id": id });
        res.status(201).json({ message: "Task deleted successfully" })
    } catch (error) {
        res.status(300).json({ message: "Unable to perform requested operation." })
    }
})
app.post('/api/search',middleware, async (req, res) => {

    const uname = req.userintoken
    let todolist = null
    try {
        const tl = await Todo.find({user: req.userintoken});
        getlength = await Todo.find({user: uname})
        todolist = tl.filter((td) => {
            return td.title.toLowerCase().includes((req.body.word).toLowerCase()) ||
            td.description.toLowerCase().includes((req.body.word).toLowerCase())
        })
        if (todolist == "") {
            return res.status(404).json({ message: "No search result found..." });
        }
        else {
            res.status(201).json({ todolist: todolist, todocount: getlength.length });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error :- " + error })
    }
})


app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});