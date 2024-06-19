import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';

import type { NextPageWithLayout } from '@/pages/_app';
import type { RouterOutput } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';

type PostByIdOutput = RouterOutput['members']['byId'];

function PostItem(props: { member: PostByIdOutput }) {
  const { member } = props;
  return (
    <div className="flex flex-col justify-center h-full px-8 ">
      <Link className="text-gray-300 underline mb-4" href="/">
        Home
      </Link>
      <h1 className="text-4xl font-bold">{member.id}</h1>
      <em className="text-gray-400">
        Created {member.createdAt.toLocaleDateString('en-us')}
      </em>

      <p className="py-4 break-all">{member.name}</p>

      <h2 className="text-2xl font-semibold py-2">Raw data:</h2>
      <pre className="p-4 rounded-xl overflow-x-scroll">
        {JSON.stringify(member, null, 4)}
      </pre>
    </div>
  );
}

const PostViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.members.byId.useQuery({ id });

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== 'success') {
    return (
      <div className="flex flex-col justify-center h-full px-8 ">
        <div className="w-full bg-zinc-900/70 rounded-md h-10 animate-pulse mb-2"></div>
        <div className="w-2/6 bg-zinc-900/70 rounded-md h-5 animate-pulse mb-8"></div>

        <div className="w-full bg-zinc-900/70 rounded-md h-40 animate-pulse"></div>
      </div>
    );
  }
  const { data } = postQuery;
  return <PostItem member={data} />;
};

export default PostViewPage;
