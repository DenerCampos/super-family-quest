import { Button, Heading } from '@chakra-ui/react';

const Home = () => (
  <div>
    <Heading as="h1" size="2xl">
      Super Family Quest
    </Heading>
    <Button colorScheme="purple" variant="outline">
      Start Game
    </Button>
  </div>
);

export default Home;