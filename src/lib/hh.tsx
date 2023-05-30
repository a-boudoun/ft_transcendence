export async function getServerSideProps() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await response.json();
      return {
        props: {
          users,
        },
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        props: {
          users: [],
        },
      };
    }
  }