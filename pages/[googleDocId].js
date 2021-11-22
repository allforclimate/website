import Head from "next/head";
import { getHTMLFromGoogleDocId } from "../lib/googledoc";
import { getPageMetadata } from "../lib/lib";
import Footer from "../components/Footer";
import ErrorNotPublished from "../components/ErrorNotPublished";
import RenderGoogleDoc from "../components/RenderGoogleDoc";
import sitemap from "../sitemap.json";

const defaultValues = sitemap.index;

export async function getStaticPaths() {
  const paths = [];
  Object.keys(sitemap).forEach((key) => {
    paths.push({
      params: {
        googleDocId: sitemap[key].googleDocId,
      },
    });
    paths.push({
      params: {
        googleDocId: key,
      },
    });
  });
  console.log(paths);
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const pageInfo = getPageMetadata(params.googleDocId);
  const googleDocId = pageInfo.googleDocId || params.googleDocId;
  const doc = await getHTMLFromGoogleDocId(googleDocId);

  const page = {
    title: pageInfo.title || doc.title || null,
    description: pageInfo.description || doc.description || null,
    image: pageInfo.image || null,
    body: doc.body,
    googleDocId,
  };

  return {
    props: { page },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default function Home({ page }) {
  if (!page) return <div />;
  const { title, description, body, image, googleDocId } = page;
  return (
    <div className="w-full">
      <Head>
        <title>{title || defaultValues.title}</title>
        <link rel="icon" href="/images/allforclimate-favicon.png" />
        <meta
          name="description"
          content={description || defaultValues.description}
        />
        <meta name="og:image" content={image || defaultValues.image} />
      </Head>

      <main className="max-w-screen-md px-4 mx-auto">
        {!body && <p>Loading...</p>}
        {body === "not_published" && (
          <ErrorNotPublished googleDocId={googleDocId} />
        )}
        {body && <RenderGoogleDoc html={body} />}
      </main>

      <Footer googleDocId={googleDocId} />
    </div>
  );
}
