// REQUIRED PACKAGES ===========================================================
var bodyParser 	= require('body-parser');
var mySQL 		= require('mysql');
var config 		= require('../../../config');

// APIROUTER FUNCTION ==========================================================
module.exports = function(app, express) {
	var answersRouter = express.Router();
    // BASE ROUTE (VERIFICATION) -----------------------------------------------
    answersRouter.get('/', function(req, res) {
        res.json({ message: 'API Connection Successful' });
    });

    // ROUTES FOR /api/answers -----------------------------------------------
    answersRouter.route('/answers')
    //Create an Answer
        .post(function(req, res) { 		//expected request syntax [Question_ID, "Answer_text", Continue_Boolean, Next_ID]
            db_connection.query('INSERT INTO answers (question_id, answer_text, finish, next_id) VALUES (?, ?, ?, ?)', [req.body.q_id, req.body.text, req.body.cont, req.body.next_id], function (error, result, field) {
                if (error) {
                    throw error;
                }
                res.send('Answer added to database with ID: ' + result.insertId);
            });
        })

        //Get all questions
        .get(function(req, res) {
            db_connection.query('SELECT * FROM answers', function(error, result)	{
                if (error) throw error;
                res.send(result);	//all results query results sent to response
            });
        });
	// ROUTES FOR /api/answers/questionid/:id
    answersRouter.route('answer/questionid/:id')
    //Get an Answer by Question_id
        .get(function(req, res) { //expects single integer id
            db_connection.query('SELECT * FROM answers WHERE question_id = ?', req.params.id, function(error, result) {
                if (error) throw error;
                res.send(result[0]); //single answer query sent to response
            });
        })
        //Remove an Answer with question_id
        .delete(function(req, res) {
            //Require (extra) validation??
            //expects Question ID number for query
            db_connection.query('DELETE FROM answers WHERE question_id = ?', req.params.id, function(error, result) {
                if (error) throw error;
                res.send('Answer removed with ID: ' + result.insertId);
            });
        });

    // ROUTES FOR /api/answers/answerid/:id -------------------------------------------
    answersRouter.route('/answerid/:id')
    //Get an Answer by Answer_id
        .get(function(req, res) { //expects single integer id
            db_connection.query('SELECT * FROM answers WHERE answer_id = ?', req.params.id, function(error, result) {
                if (error) throw error;
                res.send(result[0]); //single answer query sent to response
            });
        })
        //Update an Answer
        .put(function(req, res) { //expected syntax [ Question_ID, "Answer Text", Continue_Boolean, Next_ID, Answer_ID]
            db_connection.query('UPDATE answers SET question_id = ?, answer_text = ?, continue = ?, next_id = ? WHERE answer_id = ?', [req.body.q_id, req.body.text, req.body.cont, req.body.next_id, req.params.id], function(error, result) {
                if (error) throw error;
                res.send('Question updated with ID: ' + result.insertId);
            });
        })
        //Remove an Answer with Answer_id
        .delete(function(req, res) {
            //Require (extra) validation??
            //expects Answer ID number for query
            db_connection.query('DELETE FROM answers WHERE answer_id = ?', req.params.id, function(error, result) {
                if (error) throw error;
                res.send('Answer removed with ID: ' + result.insertId);
            });
        });

	//REGISTERING ROUTES -------------------------------------------------------
	return answersRouter;
};
