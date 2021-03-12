const http = require('http');
const url = require('url');
const mysql = require('mysql');
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const endPointRoot = "/COMP4537/individual_assignment";
const connectionInfo = {
    host: "localhost",
    user: "billyvun_admin",
    password: "Billy.z209",
    database: "billyvun_comp4537_individual_assignment_db",
    multipleStatements: true
}

const db = mysql.createConnection(connectionInfo);

let server = http.createServer(function(req, res) {
    let q = url.parse(req.url, true);
    let qdata = q.query;
    
    res.writeHead(200, {
        'Content-Type': 'text/plain', 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*'
    });
    
    if (req.method === GET && q.pathname === endPointRoot + '/questions') {
        let sql;
        
        console.log("SELECT");
        sql = `SELECT * FROM questions JOIN choices ON choices.question_id = questions.question_id JOIN answers ON choices.question_id = answers.question_id ORDER BY choices.choice_id DESC;`;
        db.query(sql, function(err, results, fields) {  
            if (err) throw err;
            console.log(results);
            res.end(JSON.stringify(results));
        });
        console.log("DONE");
    }
    
    if (req.method === POST && q.pathname === endPointRoot + '/questions') {
        let sql;
        console.log("INSERT");
        
        // INSERT question
        sql = `INSERT INTO questions(question_detail, num_choices) VALUES ("`+qdata.question_detail+`", `+qdata.num_choice+`);`;
        console.log(qdata.chocies);
        let choice = qdata.choices.split(' | ');
        // INSERT choice
        for (let i = 0; i < choice.length - 1; i++) {
            sql += `INSERT INTO choices(question_id, choice_detail) VALUES (0,` + `"`+choice[i]+`");`;
        }
        for (let i = 0; i < choice.length - 1; i++) {
            sql += `UPDATE choices SET question_id = (SELECT question_id FROM` + ` questions WHERE question_detail = "` + qdata.question_detail + `") WHERE choice_detail = "` + choice[i] + `";`;
        }
        // INSERT answer
        sql += `INSERT INTO answers(question_id, choice_id, answer_detail) VALUES ((SELECT question_id FROM choices WHERE choice_detail="` + qdata.answer + `"), (SELECT choice_id FROM choices WHERE choice_detail="` + qdata.answer + `"), (SELECT choice_detail FROM choices WHERE choice_detail="` + qdata.answer + `"));`;
    
        db.query(sql, function(err, results, fields) {
            if (err) throw err;
            console.log(results);
            res.end();
        });
    }
    
     if (req.method === PUT && q.pathname === endPointRoot + '/questions') {
        let sql;
        console.log("INSERT");
        
        // UPDATE question
        sql = `UPDATE questions SET question_detail="`+qdata.question_detail+`" WHERE question_id=`+qdata.question_id+`;`;
        console.log(qdata.chocies);
        let choice = qdata.choices.split(' | ');
        // UPDATE choice
        let id = qdata.choice_id;
        for (let i = 0; i < choice.length - 1; i++) {
            sql += `UPDATE choices SET choice_detail="`+choice[i]+`" WHERE choice_id=`+ id +`;`;
            id++;
        }
        // UPDATE answer
        sql += `UPDATE answers SET choice_id = (SELECT choice_id FROM choices WHERE choice_detail="` + qdata.answer + `"), answer_detail = (SELECT choice_detail FROM choices WHERE choice_detail="` + qdata.answer + `") WHERE question_id = (SELECT question_id FROM choices WHERE choice_detail="` + qdata.answer + `");`;
    
        db.query(sql, function(err, results, fields) {
            if (err) throw err;
            console.log(results);
            res.end();
        });
    }
});
server.listen();