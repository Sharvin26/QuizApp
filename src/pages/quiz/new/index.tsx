import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Field, FieldArray, Form, Formik, getIn } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import Navbar from '../../../common/Navbar';
import { useAuth } from '../../../lib/auth';
import { addQuizApi } from '../../../utils/service';

const optionData = [
  {
    label: 'Option A:',
  },
  {
    label: 'Option B:',
  },
  {
    label: 'Option C:',
  },
  {
    label: 'Option D:',
  },
];

const answerOption = [
  {
    label: 'A',
    answer: 0,
  },
  {
    label: 'B',
    answer: 1,
  },
  {
    label: 'C',
    answer: 2,
  },
  {
    label: 'D',
    answer: 3,
  },
];

const Index = () => {
  const { auth, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!auth && !loading) {
      router.push('/signin?next=/quiz/new');
    }
  }, [auth, loading]);

  const questionsData = {
    title: '',
    options: [{ title: '' }, { title: '' }, { title: '' }, { title: '' }],
    answer: '0',
  };

  const initialValues = {
    title: '',
    description: '',
    questions: [questionsData],
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required('Required'),
    description: yup.string().required('Required'),
    questions: yup
      .array()
      .of(
        yup.object().shape({
          title: yup.string().required('Required!'),
          options: yup.array().of(
            yup.object().shape({
              title: yup.string().required('Required!'),
            })
          ),
        })
      )
      .required('Must add a question'),
  });

  const submitHandler = async (values, actions) => {
    try {
      values = {
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: values.questions.map((question) => {
          return {
            ...question,
            options: question.options.map((option) => {
              return { ...option, optionId: uuidv4() };
            }),
            questionId: uuidv4(),
          };
        }),
      };
      await addQuizApi(auth, values);
      router.push('/');
    } catch (error) {
      console.log('error', error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container
        maxW="3xl"
        mt={5}
        mb={5}
        borderWidth="1px"
        borderRadius="lg"
        p={6}
        boxShadow="xl"
      >
        <Formik
          initialValues={initialValues}
          onSubmit={submitHandler}
          validationSchema={validationSchema}
        >
          {(props) => (
            <Form>
              <Field name="title">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.title && form.touched.title}
                  >
                    <FormLabel htmlFor="title" fontSize="xl">
                      Quiz Title
                    </FormLabel>
                    <Input {...field} id="title" />
                    <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="description">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.description && form.touched.description
                    }
                  >
                    <FormLabel htmlFor="description" fontSize="xl" mt={4}>
                      Quiz description
                    </FormLabel>
                    <Textarea {...field} id="description" />
                    <FormErrorMessage>
                      {form.errors.description}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="questions">
                {({ field }) => (
                  <FormControl>
                    <FormLabel htmlFor="questions" fontSize="xl" mt={4}>
                      Enter your question data:
                    </FormLabel>
                    <Box ml={4}>
                      <FieldArray {...field} name="questions" id="questions">
                        {(fieldArrayProps) => {
                          const { push, remove, form } = fieldArrayProps;
                          const { values, errors, touched } = form;
                          const { questions } = values;
                          const errorHandler = (name) => {
                            const error = getIn(errors, name);
                            const touch = getIn(touched, name);
                            return touch && error ? error : null;
                          };
                          return (
                            <div>
                              {questions.map((_question, index) => {
                                return (
                                  <Flex key={index} direction="column">
                                    <FormControl
                                      isInvalid={errorHandler(
                                        `questions[${index}][title]`
                                      )}
                                    >
                                      <FormLabel
                                        htmlFor={`questions[${index}][title]`}
                                      >
                                        Question Title:
                                      </FormLabel>
                                      <Input
                                        name={`questions[${index}][title]`}
                                        as={Field}
                                        mb={
                                          !errorHandler(
                                            `questions[${index}][title]`
                                          ) && 3
                                        }
                                      />
                                      <FormErrorMessage>
                                        {errorHandler(
                                          `questions[${index}][title]`
                                        )}
                                      </FormErrorMessage>
                                    </FormControl>
                                    <SimpleGrid
                                      minChildWidth="300px"
                                      spacing="10px"
                                      mb={{ base: 4 }}
                                    >
                                      {optionData.map((option, subIndex) => (
                                        <FormControl
                                          mb={2}
                                          key={subIndex}
                                          isInvalid={errorHandler(
                                            `questions[${index}][options][${subIndex}].title`
                                          )}
                                        >
                                          <FormLabel
                                            htmlFor={`questions[${index}][options][${subIndex}].title`}
                                          >
                                            {option.label}
                                          </FormLabel>
                                          <Input
                                            name={`questions[${index}][options][${subIndex}].title`}
                                            as={Field}
                                          />
                                          <FormErrorMessage>
                                            {errorHandler(
                                              `questions[${index}][options][${subIndex}].title`
                                            )}
                                          </FormErrorMessage>
                                        </FormControl>
                                      ))}
                                    </SimpleGrid>
                                    <Box>
                                      <Text mb="8px">Correct Answer:</Text>
                                      <Field
                                        component="select"
                                        name={`questions[${index}][answer]`}
                                        style={{
                                          width: '100%',
                                          padding: '10px',
                                        }}
                                      >
                                        {answerOption.map((value, key) => (
                                          <option
                                            value={value.answer}
                                            key={key}
                                          >
                                            {value.label}
                                          </option>
                                        ))}
                                      </Field>
                                    </Box>
                                    <Flex
                                      direction="row"
                                      justify="flex-end"
                                      mt={4}
                                    >
                                      {index > 0 && (
                                        <IconButton
                                          onClick={() => remove(index)}
                                          aria-label="Remove Question"
                                          icon={<MinusIcon />}
                                          variant="ghost"
                                        >
                                          -
                                        </IconButton>
                                      )}
                                      {index === questions.length - 1 && (
                                        <IconButton
                                          onClick={() => push(questionsData)}
                                          aria-label="Add Question"
                                          icon={<AddIcon />}
                                          variant="ghost"
                                        >
                                          +
                                        </IconButton>
                                      )}
                                    </Flex>
                                    {index !== questions.length - 1 && (
                                      <Divider
                                        mt={2}
                                        mb={4}
                                        css={{
                                          boxShadow: '1px 1px #888888',
                                        }}
                                      />
                                    )}
                                  </Flex>
                                );
                              })}
                            </div>
                          );
                        }}
                      </FieldArray>
                    </Box>
                  </FormControl>
                )}
              </Field>
              <Center>
                <Button
                  colorScheme="green"
                  isLoading={props.isSubmitting}
                  type="submit"
                  disabled={!(props.isValid && props.dirty)}
                >
                  Submit Quiz
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default Index;
