import { Box, Container, Divider, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Navbar from '../common/Navbar';
import { getAllQuiz, getAllUsers } from '../utils/db';

const Home = (props) => {
  const quiz = JSON.parse(props.quiz);
  const router = useRouter();

  const generateQuizCard = (singleQuiz) => {
    return (
      <Box m={3} borderWidth="1px" borderRadius="lg" p={6} boxShadow="xl">
        <Heading as="h3" size="lg">
          {singleQuiz.title}
        </Heading>
      
          <Text color="gray.500" mt={2}>
            Posted By: {singleQuiz.user.name}
          </Text>
          <Text color="gray.500" mt={2}>
            No of Questions: {singleQuiz.questions.length}
          </Text>
   
        <Divider mt={3} mb={3} />
        <Text noOfLines={[1, 2, 3]}>{singleQuiz.description}</Text>
      </Box>
    );
  };

  return (
    <Box>
      <Head>
        <title>QuizApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <header>
          <Navbar />
          <Container maxW="6xl">
            {quiz.length > 0 && (
              <SimpleGrid minChildWidth="400px">
                {quiz.map((singleQuiz) => (
                  <Box
                    key={singleQuiz.id}
                    onClick={() => router.push(`/quiz/${singleQuiz.id}`)}
                    as="button"
                    textAlign="start"
                    m={2}
                  >
                    {generateQuizCard(singleQuiz)}
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Container>
        </header>
      </main>
      <footer></footer>
    </Box>
  );
};

export async function getServerSideProps(_context) {
  const quiz = await getAllQuiz();
  const users = await getAllUsers();
  const data = quiz.map((singleQuiz: any) => {
    return { ...singleQuiz, user: users.find((user) => user.id === singleQuiz.userId)};
  });
  return { props: { quiz: JSON.stringify(data) } };
}

export default Home;
