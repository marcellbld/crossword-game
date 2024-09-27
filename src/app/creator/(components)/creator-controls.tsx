import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, PlusIcon, Trash2 } from "lucide-react";
import React from "react";

type ControlState = {
  show: boolean;
  disabled: boolean;
  onClick: () => void;
};
type CreatorControlsProps = {
  rightQuestionButton: ControlState;
  bottomQuestionButton: ControlState;
  deleteQuestionButton: ControlState;
  addSecondQuestionButton: ControlState;
};

export default function CreatorControls({
  rightQuestionButton,
  bottomQuestionButton,
  deleteQuestionButton,
  addSecondQuestionButton,
}: CreatorControlsProps) {
  return (
    <div className="flex gap-1">
      {rightQuestionButton.show &&
        createRightQuestionButton(rightQuestionButton)}
      {bottomQuestionButton.show &&
        createBottomQuestionButton(bottomQuestionButton)}
      {addSecondQuestionButton.show &&
        createAddSecondQuestionButton(addSecondQuestionButton)}
      {deleteQuestionButton.show &&
        createDeleteQuestionButton(deleteQuestionButton)}
    </div>
  );
}

function createRightQuestionButton({ disabled, onClick }: ControlState) {
  return (
    <Button
      disabled={disabled}
      className="rounded-full"
      size="smIcon"
      onClick={() => onClick()}
    >
      <ChevronRight />
    </Button>
  );
}

function createBottomQuestionButton({ disabled, onClick }: ControlState) {
  return (
    <Button
      disabled={disabled}
      className="rounded-full"
      size="smIcon"
      onClick={() => onClick()}
    >
      <ChevronDown />
    </Button>
  );
}

function createDeleteQuestionButton({ disabled, onClick }: ControlState) {
  return (
    <Button
      disabled={disabled}
      className="rounded-full"
      size="smIcon"
      variant="destructive"
      onClick={() => onClick()}
    >
      <Trash2 />
    </Button>
  );
}

function createAddSecondQuestionButton({ disabled, onClick }: ControlState) {
  return (
    <Button
      disabled={disabled}
      className="rounded-full"
      size="smIcon"
      onClick={() => onClick()}
    >
      <PlusIcon />
    </Button>
  );
}
