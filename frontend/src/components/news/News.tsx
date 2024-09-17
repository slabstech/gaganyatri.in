import React from 'react';

// Assuming newsData is imported or defined somewhere in your component
const newsData = [
  { id: 1, title: 'Article 1', content: 'Content of article 1' },
  { id: 2, title: 'Article 2', content: 'Content of article 2' },
  // Add more articles as needed
];
//import * as newsData from './newsData.json'; 

const News: React.FC = () => {
  return (
    <div>
      <div className="container">
        <div className="news-list">
          {newsData.map((article) => (
            <div key={article.id} className="news-item">
              <h2 className="news-title">{article.title}</h2>
              <p className="news-content">{article.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;