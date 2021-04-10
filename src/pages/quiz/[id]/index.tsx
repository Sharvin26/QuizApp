import {
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  RadioGroup,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Navbar from '../../../common/Navbar';
import { useAuth } from '../../../lib/auth';
import { getSingleQuiz } from '../../../utils/db';
import { addAnswerApi } from '../../../utils/service';

const ShowQuiz = (quiz, onSubmit) => {
  return (
    <Container
      maxW="7xl"
      mt={5}
      mb={5}
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      boxShadow="xl"
    >
      <Center flexDirection="column">
        <Heading>{quiz.title}</Heading>
      </Center>
      <Text mt={4}>{quiz.description}</Text>
      <Heading mt={4} size="lg">
        Questions:
      </Heading>
      <Divider
        mt={4}
        mb={4}
        css={{
          boxShadow: '1px 1px #888888',
        }}
      />
      <Formik initialValues={{}} onSubmit={onSubmit}>
        {(props) => (
          <Form>
            {quiz.questions.map((singleQuiz, key) => (
              <Field name={singleQuiz.questionId} key={key}>
                {({ field, _form }) => (
                  <FormControl
                    as="fieldset"
                    isRequired={true}
                    mb={{ base: 4, md: 0 }}
                  >
                    <FormLabel as="legend">{singleQuiz.title}</FormLabel>
                    <RadioGroup>
                      <SimpleGrid minChildWidth="120px" mb={2}>
                        {singleQuiz.options.map((option, subkey) => (
                          <HStack key={subkey}>
                            <Field
                              {...field}
                              type="radio"
                              name={singleQuiz.questionId}
                              value={option.optionId}
                            />
                            <Text>{option.title}</Text>
                          </HStack>
                        ))}
                      </SimpleGrid>
                    </RadioGroup>
                  </FormControl>
                )}
              </Field>
            ))}
            <Center mt={10}>
              <Button
                type="submit"
                isLoading={props.isSubmitting}
                colorScheme="green"
              >
                Submit
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

const SingleQuiz = (props) => {
  const { auth, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!auth && !loading) {
      router.push(`/signin?next=/quiz/${props.quizId}`);
    }
  }, [auth, loading]);

  const quiz = JSON.parse(props.quiz);

  const onSubmit = async (values, actions) => {
    try {
      const resp = await addAnswerApi(auth, props.quizId, values);
      const answerId = resp.data.data.answerId;
      router.push(`/quiz/${props.quizId}/answer/${answerId}`);
    } catch (error) {
      console.log('error', error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      {quiz && ShowQuiz(quiz, onSubmit)}
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const quizId = context.query.id;
  const quizData = await getSingleQuiz(quizId);
  return { props: { quiz: quizData, quizId } };
}

export default SingleQuiz;