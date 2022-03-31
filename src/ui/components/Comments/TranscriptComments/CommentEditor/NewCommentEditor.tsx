import React from "react";
import CommentEditor from "./CommentEditor";
import { CommentData } from "../types";

interface NewCommentEditorProps {
  data: CommentData;
  onSubmit: (data: CommentData, inputValue: string) => void;
}

function NewCommentEditor({ onSubmit, data }: NewCommentEditorProps) {
  return (
    <CommentEditor
      editable={true}
      comment={data.comment}
      handleSubmit={inputValue => {
        onSubmit(data, inputValue);
      }}
    />
  );
}

export default NewCommentEditor;
