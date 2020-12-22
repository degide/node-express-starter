const Joi = require('joi')
const config = require('config')
const morgan = require('morgan')
const auth = require('./authenticate')
const log = require('./logger')
const express = require('express')
const app = express()


//if(process.env.NODE_ENV=='development'){
if (app.get('env') == 'development') {

    app.use(log)
    app.use(morgan('tiny'))

}
app.use(auth)
    //middle ware

app.use(express.urlencoded({
    extended: true
}))
app.use(express.static('public'))
app.use(express.json())
let courses = [{
        id: 1,
        name: 'course 1'
    },
    {
        id: 2,
        name: 'course 2'
    },
    {
        id: 3,
        name: 'course 3'
    },
    {
        id: 4,
        name: 'course 4'
    },
]


//get all courses
app.get('/api/courses', (req, res, next) => {
    if (courses.length < 1) {
        let err = new Error('I couldn\'t find it.');
        err.httpStatusCode = 404;
        next(err);
    }
    return res.send(courses)
})

//create new and validate with joi
app.post('/api/courses', (req, res) => {
        const schema = {
            name: Joi.string().min(3).max(30).required()
        }
        const result = Joi.validate(req.body, schema);
        console.log(result)
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }
        let course = {
            id: courses.length + 1,
            name: req.body.name,
            instructor: req.body.instructor
        }
        courses.push(course)
        return res.status(201).send(course)
    })
    // app.use((err, req, res, next) => {

//     if(!res.headersSent){
//         return res.status(err.httpStatusCode).send(err.message);
//     }
//     next(err);
// });
//console.log(process.env)
console.log(`App settings:...name:${config.get('name')}....company:${config.get('companyName')}`);
console.log(`db settings:...name:${config.get('dbConfig.name')}....username:${config.get('dbConfig.username')}`)
console.log(`...dbpassword:${config.get('dbConfig.password')}...dbport:${config.get('dbConfig.port')}`)
console.log(`Our environment is ${process.env.NODE_ENV}`)
console.log(`app:env ${app.get('env')}`)
const port = 4001;
app.listen(port, () => console.log(`Server running on port` + port))