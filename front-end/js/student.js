let question_id = 1;
let total = 0;
let done = false;
let obj;
let count_q = 1;
let index;
const msg_attempt = "You are only allowed to do the quiz once!";
const GET = 'GET';
const endPointRoot = 'https://www.billyvunguyen.com/COMP4537/individual_assignment';

const xhttp = new XMLHttpRequest();
xhttp.open(GET, endPointRoot + "/questions", true);
xhttp.send();

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        obj = JSON.parse(this.responseText);
        console.log(obj);
        if (obj.length == 0) { // database is empty
            document.getElementById("loading_msg").innerHTML = "<p class='text msg'>No questions available.</p>";
            document.getElementById("submit_btn").hidden = true;
            document.getElementById("total").hidden = true;
        } else {
            document.getElementById("loading_msg").innerHTML = "<p class='text msg'>Loading questions ... </p>";
            index = obj.length - 1;
            displayQuestions(obj);
        }
    }
}

function displayQuestions(obj) {
    let count_c = 0;
    let curr_question = obj[obj.length - 1].question_id;
    let curr_question_size = obj[obj.length - 1].num_choices;
    let curr_choice;
    let content = '<label id="question_label'+count_q+'">Question ' + count_q + ':</label></br>' +
            '<p class="field" id="question'+curr_question+'">' + obj[obj.length - 1].question_detail + '</p></br></br>';
    let question = true;
    for (let i = obj.length-1; i >= 0; i--) {
        console.log(i);
        if (curr_question == obj[i].question_id) {
            //console.log("getting choices " + obj[i].question_id);
            count_c++;
            content +=  '<input type="radio" id="radio'+count_c+'_q' + obj[i].question_id + '" name="q'+obj[i].question_id+'"/><span class="field choices" id="choice'+count_c+'_q' + obj[i].question_id + '">' + obj[i].choice_detail + '</span></br>';
            
        } else {
            curr_choice = obj[i + 1].choice_id;
            // hit different question
            let new_div = document.createElement("div");
            document.body.insertBefore(new_div, document.getElementById("result_div"));
        
            new_div.className = "question_div";
            
            new_div.innerHTML = content;
            
            // reset
            content = "";
            count_c = 0;
            count_q++;
            curr_question = obj[i].question_id;
            curr_question_size = obj[i].num_choices;
            content += '<label id="question_label'+count_q+'">Question ' + count_q + ':</label></br>' +
            '<span class="field choices" id="question'+obj[i].question_id+'">' + obj[i].question_detail + '</span></br></br>';
            count_c++;
            content +=  '<input type="radio" id="radio'+count_c+'_q' + obj[i].question_id + '" name="q'+obj[i].question_id+'"/><span class="field choices" id="choice'+count_c+'_q' + obj[i].question_id + '">' + obj[i].choice_detail + '</span></br>';
        }
    }
    let new_div = document.createElement("div");
    document.body.insertBefore(new_div, document.getElementById("result_div"));

    new_div.className = "question_div";
    new_div.innerHTML = content;
    
    document.getElementById("loading_msg").innerHTML = "";
}


function onClickSubmitAnswers() {
    let chosen = null;
    console.log(index);
    if (!done) {
        for (let a = obj[obj.length - 1].question_id; a <= obj[0].question_id; a++) {
            
            console.log(a);
            for (let i = 1; i <= obj[index].num_choices; i++) {
                if (document.getElementById("radio"+i+"_q"+a).checked) {
                    chosen = document.getElementById("choice"+i+"_q"+a).innerHTML;
                    //console.log("chosen " + chosen);
                    if (obj[index].answer_detail == chosen) {
                    // CORRECT ANSWER
                        //console.log("answer " + obj[index].answer_detail);
                        document.getElementById("choice"+i+"_q"+a).style.color = " #18c95f";
                        total++;
                    } else if (obj[index].answer_detail != chosen) {
                        // WRONG ANSWER
                        document.getElementById("choice"+i+"_q"+a).style.color = " #c91818";
                    }
                }
            }
            if (chosen == null) {
                alert("All question must be answered!");
                done = false;
                index = obj.length - 1;
                break;
            }
            index -= obj[index].num_choices;
               
        }
        if (chosen != null) {
            document.getElementById("total").innerHTML = '<h2 id="mark">Your mark: ' + total + '/' + count_q + '</h2>';
            done = true;
        }  
    } else {
        alert(msg_attempt);
    }
}

