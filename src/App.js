import React from 'react';
import './index.css';
import { useQuery } from 'react-query';

const new_query = `
{
  foodspots {
    edges {
      node {
        id
        title
        link
      }
    }
  }
}
`;

function App() {
  const { data, isLoading, error } = useQuery('foodspots', () => {
    return fetch('https://api.kuehlhaus-food.de/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: new_query }),
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('Error fetching data');
        } else {
          return response.json();
        }
      })
      .then((data) => data.data);
  });

  if (isLoading) return 'Loading...';
  if (error) return <pre>{error.message}</pre>;

  return (
    <div>
      {data.foodspots.edges.map((item) => {
        return <li key={item.node.id}>{item.node.title}</li>;
      })}
    </div>
  );
}

export default App;
