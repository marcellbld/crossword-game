type CreatePuzzle = {
  id?: number;
  tiles: {
    position: number;
    type: "empty" | "question";
    questions?: {
      direction: "right" | "bottom";
      baseQuestion: number
    }[]
  }[];
}

export default CreatePuzzle;