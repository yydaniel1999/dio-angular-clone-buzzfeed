import { Component, OnInit } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json';

interface Question {
  id: number;
  question: string;
  options: Option[];
}

export interface Option {
  id: number;
  name: string;
  alias: string;
}

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css', './quizz.component.responsive.css'],
})
export class QuizzComponent implements OnInit {
  title: string = '';

  questions: Question[] = [];
  questionSelected: Question = { id: 0, question: '', options: [] };

  answers: string[] = [];
  answerSelected: string = '';

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false;
      this.title = quizz_questions.title;
      this.questions = quizz_questions.questions;
      this.questionIndex = 0;
      this.questionMaxIndex = this.questions.length;
      this.questionSelected = this.questions[this.questionIndex];
    }
  }

  playerChoose(value: string): void {
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep() {
    this.questionIndex++;
    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer = await this.checkResult(this.answers);
      this.finished = true;
      this.answerSelected =
        quizz_questions.results[
          finalAnswer as keyof typeof quizz_questions.results
        ];
    }
  }

  async checkResult(answers: string[]) {
    const result = answers.reduce((prev, cur, i, arr) => {
      if (
        arr.filter((item) => item === prev).length >
        arr.filter((item) => item === cur).length
      ) {
        return prev;
      } else {
        return cur;
      }
    });

    return result;
  }
}
