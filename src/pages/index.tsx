import Head from 'next/head';
import Navbar from '../common/Navbar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>QuizApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
      </main>
      <footer></footer>
    </div>
  );
}
