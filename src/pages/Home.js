import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

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

function Home() {
  const { data, isLoading, error } = useQuery('foodspots', () => {
    return fetch('https://api.kuehlhaus-food.de/wp/graphql', {
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
  if (error) return error.message;

  return (
    <div>
      <ul role="list" className="divide-y divide-gray-200 lg:w-[50%] mx-auto">
        <h1 className="text-lg font-bold m-5">Foodspots</h1>
        {data.foodspots.edges.map((item) => {
          return (
            <Link
              to={`/foodspot/` + item.node.id}
              state={{ id: item.node.id }}
              key={item.node.id}
            >
              <li className="flex p-5 bg-gray-100 m-5 hover:bg-gray-200">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {item.node.title}
                  </p>
                  <p className="text-sm text-gray-500">{item.node.link}</p>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default Home;
