import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PT from "prop-types";

export default function Articles({
  getArticles,
  articles,
  setCurrentArticle,
  setCurrentArticleId,
  deleteArticle,
}) {
  // ✨ where are my props? Destructure them here

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      getArticles();
    }
  }, []);

  const editArticle = (evt) => {
    evt.preventDefault();
    const id = parseInt(evt.target.id);
    setCurrentArticleId(id);
    const selectedArticle = articles?.filter((article) => {
      return article.article_id === id;
    });
    setCurrentArticle(selectedArticle[0]);
  };

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles
    <div className="articles">
      <h2>Articles</h2>
      {!articles?.length
        ? "No articles yet"
        : articles?.map((art) => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button id={art.article_id} onClick={editArticle}>
                    Edit
                  </button>
                  <button id={art.article_id} onClick={deleteArticle}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
    </div>
  );
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(
    PT.shape({
      // the array can be empty
      article_id: PT.number.isRequired,
      title: PT.string.isRequired,
      text: PT.string.isRequired,
      topic: PT.string.isRequired,
    })
  ).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
};
