import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/");
  };
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    navigate("/");
  };

  const login = async ({ username, password }) => {
    setMessage("");
    setSpinnerOn(true);
    try {
      const { data } = await axios.post(loginUrl, {
        username,
        password,
      });
      localStorage.setItem("token", data.token);
      setMessage(data.message);
      navigate("/articles");
    } catch (err) {
      console.error(err);
    }
    setSpinnerOn(false);
  };

  const getArticles = async () => {
    const token = localStorage.getItem("token");
    setMessage("");
    setSpinnerOn(true);
    try {
      const response = await axios.get(articlesUrl, {
        headers: { Authorization: token },
      });
      setArticles(response.data.articles);
      setMessage(response.data.message);
    } catch (err) {
      if (err?.response?.status == 401) logout();
    }
    setSpinnerOn(false);
  };

  const postArticle = async (article) => {
    const token = localStorage.getItem("token");
    setMessage("");
    setSpinnerOn(true);
    try {
      const response = await axios.post(articlesUrl, {
        headers: { Authorization: token },
        payload: { title, text, topic },
      });
      setArticles(response.data.articles);
      setMessage(response.data.message);
    } catch (err) {
      console.error(err);
    }
    setSpinnerOn(false);
  };

  const updateArticle = ({ article_id, article }) => {
    const selectedArticle = article.filter((article) => {
      return article.id === article_id;
    });
    setValues({
      title: selectedArticle.title,
      text: selectedArticle.text,
      topic: selectedArticle.topic,
    });
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  currentArticle={currentArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  postArticle={postArticle}
                  articles={articles}
                />
                <Articles
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  updateArticle={updateArticle}
                  setCurrentArticle={setCurrentArticle}
                  getArticles={getArticles}
                  articles={articles}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  );
}
