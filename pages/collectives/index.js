import styled from "styled-components";
import Link from "next/link";
import sitemap from "../../sitemap.json";
import { getHTMLFromGoogleDocId } from "../../lib/googledoc";
import RenderGoogleDoc from "../../components/RenderGoogleDoc";
import Footer from "../../components/Footer";

const Body = styled.div``;

const Links = styled.div`
  padding: 0;
  margin: 0;
`;

const StyledLink = styled.a`
  text-decoration: none;
  display: block;
  margin: 15px 0;
  border: 1px solid #4a7a84;
  border-radius: 5px;
  min-width: 250px;
  max-width: 300px;
  cursor: pointer;
  padding: 10px;
  &:hover {
    background: #eee;
  }
`;

export async function getStaticProps(context, params) {
  const googleDocId = sitemap.collectives.googleDocId;
  const page = await getHTMLFromGoogleDocId(googleDocId);

  return {
    props: { page, googleDocId },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default function CollectivesPage({ page, googleDocId }) {
  return (
    <Body>
      <div className="max-w-screen-md px-4 mx-auto">
        <center>
          <img src="/images/allforclimate-logo-black.png" width={128} />
          <Links>
            <Link href="/collectives/list">
              <StyledLink>🔅 List of collectives we are hosting</StyledLink>
            </Link>
            <Link href="/collectives/updates">
              <StyledLink>📰 Latest updates from our collectives</StyledLink>
            </Link>
            <StyledLink href="https://join.allforclimate.earth">
              🙋‍♀️ Apply to host your collective
            </StyledLink>
            <StyledLink href="https://docs.allforclimate.earth">
              📕 Documentation
            </StyledLink>
            <StyledLink href="https://allforclimate.earth/donate">
              💶 Donate
            </StyledLink>
          </Links>

          {page.body && <RenderGoogleDoc html={page.body} />}

          <Footer googleDocId={googleDocId} />
        </center>
      </div>
    </Body>
  );
}
