"server-only"

import { BaseQuestion, Prisma } from "@prisma/client";
import prisma from "../db";

function firstOccurenceOfLetter(str: string, startPosition: number): number {
  for (let i = startPosition + 1; i < str.length; i++) {

    if (str[i] !== '_' && str[i] !== "%") {
      return i;
    }
  }

  return startPosition;
}

export async function findAll(maxLength: number, characters: string[], ignoreQuestions: number[]): Promise<BaseQuestion[]> {
  let startsWithFull = "";
  for (let i = 0; i < characters.length; i++) {
    if (characters[i]) {
      startsWithFull += characters[i];
    } else {
      startsWithFull += "_";
    }
  }
  startsWithFull += "%";

  let startsWith = "";
  let startsWithMaxLength = 0;
  const indexOfFirstUnderscore = startsWithFull.indexOf("_");

  if (indexOfFirstUnderscore >= 1) {
    const firstLetter = firstOccurenceOfLetter(startsWithFull, indexOfFirstUnderscore);

    const diff = firstLetter - indexOfFirstUnderscore;

    if (diff > 1 || (diff === 1 && indexOfFirstUnderscore > 0)) {
      startsWith = startsWithFull.substring(0, indexOfFirstUnderscore) + "%";
      startsWithMaxLength = firstLetter - 1;

    }
  } else {
    const firstLetter = firstOccurenceOfLetter(startsWithFull, indexOfFirstUnderscore);
    const diff = firstLetter - indexOfFirstUnderscore;

    if (diff > 0) {

      const secondLetter = firstOccurenceOfLetter(startsWithFull, firstLetter);

      if (secondLetter > -1 && secondLetter > firstLetter) {

        startsWith = startsWithFull.substring(0, firstLetter + 1) + "%";
        startsWithMaxLength = secondLetter - 1;
      } else {
        startsWith = "%";
        startsWithMaxLength = firstLetter - 1;
      }
    }
  }
  const baseQuestions = [];

  if (startsWith !== "" && startsWith !== startsWithFull && ignoreQuestions.length > 0) {
    baseQuestions.push(...await findAllByMaxLengthAndStartLettersWithIgnoredQuestions(startsWithMaxLength, startsWith, ignoreQuestions));
  } else if (startsWith !== "" && startsWith !== startsWithFull) {
    baseQuestions.push(...await findAllByMaxLengthAndStartLetters(startsWithMaxLength, startsWith));
  }

  if (ignoreQuestions.length > 0) {
    baseQuestions.push(...await findAllByMaxLengthAndStartLettersWithIgnoredQuestions(maxLength, startsWithFull, ignoreQuestions));
  } else {
    baseQuestions.push(... await findAllByMaxLengthAndStartLetters(maxLength, startsWithFull));
  }

  return baseQuestions;
}

async function findAllByMaxLengthAndStartLetters(maxLength: number, startLetters: string): Promise<BaseQuestion[]> {
  return prisma.$queryRaw<BaseQuestion[]>`
    SELECT * FROM "BaseQuestion" 
      WHERE LENGTH("answer") <= ${maxLength}
        AND "answer" ILIKE ${startLetters}
  `;
}

async function findAllByMaxLengthAndStartLettersWithIgnoredQuestions(maxLength: number, startLetters: string, ignoreQuestionIds: number[]): Promise<BaseQuestion[]> {
  return prisma.$queryRaw<BaseQuestion[]>`
    SELECT * FROM "BaseQuestion" 
      WHERE LENGTH("answer") <= ${maxLength}
        AND "id" NOT IN (${Prisma.join(ignoreQuestionIds)})
        AND "answer" ILIKE ${startLetters}`;
}
