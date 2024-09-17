import React, { useEffect, useState } from "react";
import PT from "prop-types";

const initialFormValues = { title: "", text: "", topic: "" };

export default function ArticleForm({
  currentArticleId,
  postArticle,
  updateArticle,
  currentArticle,
  setCurrentArticle,
}) {
  const [values, setValues] = useState(initialFormValues);
  // ✨ where are my props? Destructure them here

  useEffect(() => {
    if (!currentArticle) {
      console.log("Not truthy");
      setValues(initialFormValues);
    } else {
      console.log("Is truthy");
      setValues({
        title: currentArticle.title,
        text: currentArticle.text,
        topic: currentArticle.topic,
      });
    }
  }, [currentArticle]);

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    if (currentArticle) {
      updateArticle(currentArticleId, values);
      setValues(initialFormValues);
    } else {
      postArticle(values);
      setValues(initialFormValues);
    }
  };

  const isDisabled = () => {
    if (values.title && values.text && values.topic) return false;
    else return true;
  };
  const cancelEdit = (evt) => {
    evt.preventDefault();
    setCurrentArticle(null);
  };

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">
          Submit
        </button>
        {currentArticle && <button onClick={cancelEdit}>Cancel edit</button>}
      </div>
    </form>
  );
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  }),
};
