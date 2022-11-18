import React from "react";
import useState from 'react-usestateref'
import { useQuery } from "@apollo/client";
import { FIND_QUESTIONS } from '../graphql-operations';
import he from 'he';
import {
    app
} from "../index";
import {
    Modal,
    Button,
    Spinner,
    ListGroup
} from "react-bootstrap";

export default function Questions(props) {

    const { play, setPlay, category, setShowLastGame } = props;

    const [questionCounter, setQuestionCounter] = React.useState(-1);
    const [questionArray, setQuestionArray] = React.useState([]);
    const [numberOfQuestions] = React.useState(10); // TODO: De momento es un valor fijo, pero podría ser variable como en iOS
    var [asserts, setAsserts, refAsserts] = useState(0)
    var [fails, setFails, refFails] = useState(0)
    var answerArray = [];
    const [startTime, setStartTime] = React.useState(new Date());
    const [counting, setCounting] = React.useState(false);


    // Get Stock via GraphQL and update 'stock' value
    const { loading, data } = useQuery(FIND_QUESTIONS, {
        variables: { query: { _partition: category.questions_partition } },
    });

    const updateUser = async (time) => {
        try {
            const game = {
                category: category.title,
                asserts: refAsserts.current,
                fails: refFails.current,
                date: new Date(),
                timeElapsed: time
            }
            const user = app.currentUser;
            if (user.id === app.currentUser.id) {
                await app.currentUser.functions.addNewGame(game);
            }
            // await updateUserGame({
            //     variables: {
            //         query: {_id: app.currentUser.id},
            //         set: { games: game }
            //     }
            // });
        } catch (error) {
            console.error("Issue uppdating user game:", error);
        }
    }

    const handleClose = (() => {
        setQuestionArray([])
        setPlay(false)
    });
    const questions = data ? data.questions : null;

    function start() {
        setStartTime(new Date())
    };

    function end() {
        const endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;

        // get seconds 
        var seconds = Math.round(timeDiff);
        return seconds;
    }

    function randomUniqueNum(range, outputCount) {
        let arr = []
        for (let i = 1; i <= range; i++) {
            arr.push(i)
        }

        let result = [];

        for (let i = 1; i <= outputCount; i++) {
            const random = Math.floor(Math.random() * (range - i));
            result.push(arr[random]);
            arr[random] = arr[range - i];
        }

        return result;
    }


    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            // Generate random number 
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function createArrayOfQuestions() {
        let array = []
        array.push(questionArray[questionCounter].correct_answer);
        array = array.concat(questionArray[questionCounter].incorrect_answers);
        shuffleArray(array)
        return array
    }

    function addAnswer(question) {
        answerArray.push(question);
    }

    function drawQuestion(question) {
        return (
            <ListGroup.Item
                as="li"
                key={question}
                eventKey={question}
                action onClick={() => addAnswer(question)}>
                {he.decode(question)}
            </ListGroup.Item>)
    }

    function displayQuestion() {
        const q = createArrayOfQuestions()
        if (!counting) {
            setCounting(true);
            start();
        }
        return (
            <div>
                <span>{he.decode(questionArray[questionCounter].question)}</span>
                <ListGroup variant="flush" as="ul">
                    {q && q.map((question) => {
                        return drawQuestion(question)
                    })}
                </ListGroup>
            </div>
        )
    }

    function setNextButton() {
        const lastAnswer = answerArray.pop()
        if (lastAnswer === questionArray[questionCounter].correct_answer) {
            setAsserts(asserts => asserts + 1)
        } else {
            setFails(fails => fails + 1)
        }
        if (questionCounter < numberOfQuestions - 1) {
            setQuestionCounter(
                questionCounter < numberOfQuestions ? questionCounter + 1 : 0
            )
        } else {
            const time = end();
            updateUser(time).then(() => {
                handleClose();
                setShowLastGame(true);
            }).catch(() => {
                alert("An error occured");
                handleClose();
            });
        }
    }

    function setButton() {
        if (questionCounter === -1) {
            return (
                <Button
                    variant="success"
                    onClick={() => setQuestionCounter(questionCounter + 1)}>
                    START!
                </Button>)
        } else {
            return (
                <Button
                    variant="info"
                    onClick={() => setNextButton()}>
                    Next {numberOfQuestions - questionCounter}
                </Button>)
        }

    }

    function createQuestions() {
        if (!questionArray.length) {
            const indexArray = randomUniqueNum(questions.length - 1, numberOfQuestions);
            for (var index in indexArray) {
                questionArray.push(questions[indexArray[index]])
            }
        } else {
            return displayQuestion()
        }
    }

    return (
        <Modal show={play} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{category.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ?
                    (<Spinner className="loader" animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>) :
                    (createQuestions())}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
              </Button>
                {setButton()}
            </Modal.Footer>
        </Modal>
    );
}