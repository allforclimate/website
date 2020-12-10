import Head from "next/head";
import { getHTMLFromGoogleDocId } from "../lib/googledoc";
import Footer from "../components/Footer";
import ErrorNotPublished from "../components/ErrorNotPublished";
import RenderGoogleDoc from "../components/RenderGoogleDoc";

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          docid: "1DcN_fcJcXFz01yUlqHO4TD-U3Q7gg96AKvHPAVISvro",
        },
      },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const html = await getHTMLFromGoogleDocId(params.docid);

  return {
    props: { html, googleDocId: params.docid },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default function Home({ html, googleDocId }) {
  return (
    <div className="w-full">
      <Head>
        <title>All for Climate</title>
        <link rel="icon" href="/images/allforclimate-icon.png" />
        <meta
          name="description"
          content="A shared non profit for your activism"
        />
      </Head>

      <main className="max-w-screen-md px-4 mx-auto">
        {!html && <p>Loading...</p>}
        {html === "not_published" && (
          <ErrorNotPublished googleDocId={googleDocId} />
        )}
        {html && <RenderGoogleDoc html={html} />}
      </main>

      <Footer googleDocId={googleDocId} />
    </div>
  );
}
