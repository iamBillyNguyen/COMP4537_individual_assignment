const msg_notSupported = "Sorry web Storage is not supported!";
const msg_missingQuestion = "Please enter your question!";
const msg_missingChoices = "Please enter your choice(s)!";
const msg_missingAnswer = "Please choose the correct answer!";
const unique_divider = " | ";
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const endPointRoot = 'https://www.billyvunguyen.com/COMP4537/individual_assignment';
let question_id = 1;
let choice_num = 3;
let count_q = 1;


/* GET EXISTING QUESTIONS */
const xhttp = new XMLHttpRequest();
xhttp.open(GET, endPointRoot + "/questions", true);
xhttp.send();

let obj;
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        obj = JSON.parse(this.responseText);
        console.log(obj);
        if (obj.length == 0) { // database is empty
            document.getElementById("loading_msg").innerHTML = "<p class='text msg'>No questions available.</p>";
        } else {
            document.getElementById("loading_msg").innerHTML = "<p class='text msg'>Loading questions ... </p>";
            displayQuestions(obj);
        }
    }
}

const div = document.createElement("div");
document.body.insertBefore(div, document.getElementById("your_questions"));
div.className = "question_div";
div.id = "question_area";

const main_content = '<label id="question_label"></label></br>'+
'<p id="message"></p>'+
'<textarea id="question" class="field" placeholder="Enter your question"></textarea></br></br>'+
'<input type="radio" id="radio1"/><textarea id="choice1" class="field" placeholder="Enter your choice"></textarea></br>'+
'<input type="radio" id="radio2"/><textarea id="choice2" class="field" placeholder="Enter your choice"></textarea></br>'+
'<div id="es_3"></div>'+
'<div id="es_4"></div>'+
'<input type="button" id="add_btn" value="Add" onClick="onClickAddBtn()">'+
'<input type="button" id="submit_btn" value="Submit" onClick="onClickSubmitBtn()">';
div.innerHTML = main_content;

document.getElementById("question_label").innerHTML = "Your Question :";

document.getElementById("radio1").name = "q"+question_id;
document.getElementById("radio2").name = "q"+question_id;

function displayQuestions(obj) {
    let count_c = 0;
    let curr_question = obj[obj.length - 1].question_id;
    let curr_question_size = obj[obj.length - 1].num_choices;
    let curr_choice;
    let content = '<label id="question_label'+count_q+'">Question ' + count_q + ':</label></br>' +
            '<textarea class="field" id="question'+curr_question+'">' + obj[obj.length - 1].question_detail + '</textarea></br></br>';
    let question = true;
    for (let i = obj.length-1; i >= 0; i--) {
        console.log(i);
        if (curr_question == obj[i].question_id) {
            //console.log("getting choices " + obj[i].question_id);
            count_c++;
            content +=  '<input type="radio" id="radio'+count_c+'_q' + obj[i].question_id + '" name="q'+obj[i].question_id+'"/><textarea class="field" id="choice'+count_c+'_q' + obj[i].question_id + '">' + obj[i].choice_detail + '</textarea></br>';
            
        } else {
            curr_choice = obj[i + 1].choice_id;
            // hit different question
            let new_div = document.createElement("div");
            document.body.insertBefore(new_div, document.getElementById("container"));
        
            new_div.className = "question_div";
            new_div.id = "question_area";
            content += '<input type="button" id="save_btn" value="Save changes" onclick="onClickSaveBtn('+curr_question+ ', ' + curr_question_size +', ' + (curr_choice + 1 - count_c) +')"/>';
            console.log("========= id " + curr_question);
            new_div.innerHTML = content;
            
            // reset
            content = "";
            count_c = 0;
            count_q++;
            curr_question = obj[i].question_id;
            curr_question_size = obj[i].num_choices;
            content += '<label id="question_label'+count_q+'">Question ' + count_q + ':</label></br>' +
            '<textarea class="field" id="question'+obj[i].question_id+'">' + obj[i].question_detail + '</textarea></br></br>';
            count_c++;
            content +=  '<input type="radio" id="radio'+count_c+'_q' + obj[i].question_id + '" name="q'+obj[i].question_id+'"/><textarea class="field" id="choice'+count_c+'_q' + obj[i].question_id + '">' + obj[i].choice_detail + '</textarea></br>';
        }
    }
    let new_div = document.createElement("div");
    document.body.insertBefore(new_div, document.getElementById("container"));

    new_div.className = "question_div";
    new_div.id = "question_area";
    content += '<input type="button" id="save_btn" value="Save changes" onclick="onClickSaveBtn('+obj[0].question_id+', ' + obj[0].num_choices+', ' + (obj[0].choice_id + 1 - obj[0].num_choices) +')"/>';
    new_div.innerHTML = content;
    
    document.getElementById("loading_msg").innerHTML = "";
}
        

function onClickDeleteChoice() {
    choice_num--;
    document.getElementById("es_"+choice_num).innerHTML = "";
}

function onClickAddBtn() {
    if (choice_num <= 4) {
    let choice = '<input type="radio" id="radio'+choice_num+'"/><textarea id="choice'+choice_num+'" class="field" placeholder="Enter your choice"></textarea><span class="delete_choice" onClick="onClickDeleteChoice()">X</span></br>';
    document.getElementById("es_"+choice_num).innerHTML = choice;
    document.getElementById("radio"+choice_num).name = "q"+question_id;
    choice_num++;
    } else {
        alert("Maximum of 4 choices!");
    }
}

function getNewQuestion() {
    // GET QUESTION
    let question = document.getElementById("question").value;
    let answer = null;
    // GET ANSWER
    for (let i = 1; i <= choice_num - 1; i++) { 
        let x = document.getElementById("radio"+i).checked;
        if (x) {
            answer = document.getElementById("choice"+i).value;
            break;
        }
    }
    if (question == "") {
        document.getElementById("message").innerHTML = msg_missingQuestion;
    } else if (answer == null) {
        document.getElementById("message").innerHTML = msg_missingAnswer;
    } else {
        // GET CHOICES
        document.getElementById("message").innerHTML = "";
        let str = "?question_detail="+question+"&choices=";
        let choice1 = document.getElementById("choice1").value;
        let choice2 = document.getElementById("choice2").value;
        str += choice1 + unique_divider;
        str += choice2 + unique_divider;
        document.getElementById("radio1").value = choice1;
        document.getElementById("radio2").value = choice2;
        
        let choice3 = null, choice4 = null;
        if (choice_num - 1 == 3) {
         choice3 = document.getElementById("choice3").value;
         document.getElementById("radio3").value = choice3;
         str += choice3 + unique_divider;
        } else if (choice_num - 1 == 4){
            choice3 = document.getElementById("choice3").value;
            choice4 = document.getElementById("choice4").value;
            str += choice3 + unique_divider;
            str += choice4 + unique_divider;
            document.getElementById("radio3").value = choice3;
            document.getElementById("radio4").value = choice4;
        }
        str+= "&answer="+answer;
        str+= "&num_choice="+(choice_num-1);
        console.log(str);
        return str;
    }
}

function getQuestionWithId(id, size, choice_id) {
    // GET QUESTION
    let question = document.getElementById("question"+id).value;
    console.log(question);
    let answer = null;
    // GET ANSWER
    for (let i = 1; i <= 4; i++) { 
        let x = document.getElementById("radio"+i+"_q"+id).checked;
        if (x) {
            answer = document.getElementById("choice"+i+"_q"+id).value;
            break;
        }
    }
    if (question == "") {
        document.getElementById("message").innerHTML = msg_missingQuestion;
    } else if (answer == null) {
        document.getElementById("message").innerHTML = msg_missingAnswer;
    } else {
        // GET CHOICES
        document.getElementById("message").innerHTML = "";
        let str = "?question_id="+id+"&question_detail="+question+"&choice_id="+choice_id+"&choices=";
        let choice1 = document.getElementById("choice1_q"+id).value;
        let choice2 = document.getElementById("choice2_q"+id).value;
        str += choice1 + unique_divider;
        str += choice2 + unique_divider;
        document.getElementById("radio1_q"+id).value = choice1;
        document.getElementById("radio2_q"+id).value = choice2;
        
        let choice3 = null, choice4 = null;
        if (size == 3) {
            choice3 = document.getElementById("choice3_q"+id).value;
            document.getElementById("radio3_q"+id).value = choice3;
            str += choice3 + unique_divider;
        }
        
        if (size == 4) {
            choice3 = document.getElementById("choice3_q"+id).value;
            document.getElementById("radio3_q"+id).value = choice3;
            str += choice3 + unique_divider;
            choice4 = document.getElementById("choice4_q"+id).value;
            str += choice4 + unique_divider;
            document.getElementById("radio4_q"+id).value = choice4;
        }
        str+= "&answer="+answer;
        return str;
    }
}

function onClickSubmitBtn() {
    let str = getNewQuestion();
    console.log(str);
    const xhttp = new XMLHttpRequest();
    xhttp.open(POST, endPointRoot + "/questions"+str, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("sent!");
        }
    }
    resetFields();
    window.location.reload(true); 
}   

function resetFields() {
    document.getElementById("question").value = "";
    document.getElementById("choice1").value = "";
    document.getElementById("choice2").value = "";
    if (choice_num - 1 == 3) document.getElementById("choice3").value = "";
    else if (choice_num - 1 == 4){
        document.getElementById("choice3").value = "";
        document.getElementById("choice4").value = "";
    }
    for (let i = 1; i <= choice_num - 1; i++) {
        let x = document.getElementById("radio"+i).checked;
        if (x) {
            document.getElementById("radio"+i).checked = false;
            break;
        }
    }
    choice_num = 3;
    question_id++;
    document.getElementById("question_label").innerHTML = "Question " + question_id + ":"; 
}

function onClickSaveBtn(id, size, choice_id) {
    console.log(id + " " + size);
    let str = getQuestionWithId(id, size, choice_id);
    console.log(str);
    
    const xhttp = new XMLHttpRequest();
    xhttp.open(PUT, endPointRoot + "/questions"+str, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("saved!");
        }
    }
    alert("Changes saved!");
}
