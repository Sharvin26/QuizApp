import firebase from '../lib/firebase';

export const addUser = async (authUser: any) => {
  const resp = await firebase
    .firestore()
    .collection('users')
    .doc(authUser.uid as string)
    .set({ ...authUser }, { merge: true });
  return resp;
};

export const addQuiz = async (quizData) => {
  let response = await firebase.firestore().collection('quiz').add(quizData);
  return response;
};

export const getAllQuiz = async () => {
  const snapshot = await firebase.firestore().collection('quiz').get();
  const quiz = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return quiz;
};

export const getAllUsers = async () => {
  const snapshot = await firebase.firestore().collection('users').get();
  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return users;
}