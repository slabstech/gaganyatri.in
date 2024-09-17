import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SpaceWalks {
  id: number;
  column1: string;
  column2: number;
  column3: string;
  // add other properties if they exist
}

const News: React.FC = () => {  
  const [newsData, setNewsData] = useState<SpaceWalks[]>([]);
  useEffect(() => {
    const fetchNewsData = async () => {
      const result = await axios.get<SpaceWalks[]>('http://gaganyatri-django-spaces.hf.space/space_walks/api/space_walks/');
      setNewsData(result.data);
    };

    fetchNewsData();
  }, []);

   return (
    <div>
      {newsData.map((spaceWalk) => (
        <div key={spaceWalk.id} className="news-item">
          <h2 className="news-title">{spaceWalk.column1}</h2>
          <p className="news-content">{spaceWalk.column2}</p>
          <p className="news-date">{spaceWalk.column3}</p>
        </div>
      ))}
    </div>
  );
};

export default News;