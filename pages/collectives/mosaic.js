import styled from "styled-components";
import { Flex } from "rebass";

const Body = styled.div`
  max-width: 900px;
  margin: 0 auto;
  font-family: Content-font, Roboto, sans-serif;
  font-weight: 400;
  line-height: 1.625;
  font-size: 16px;
`;

const CollectiveLogo = styled.img`
  height: 64px;
  margin: 0 0 0 0;
  flex: 0 0 auto;
`;

const H2 = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 40px 0 10px;
`;

export default ({ collectives }) => {
  const images = {};
  collectives.map((node) => {
    images[node.collective.image] = true;
  });
  const imagesArray = Object.keys(images);
  return (
    <Body>
      <center>
        <img
          src="https://dao.allforclimate.earth/images/allforclimate-logo-black.png"
          width={128}
        />
        <Flex flexWrap="wrap" justifyContent="center">
          {imagesArray.map((image) => (
            <CollectiveLogo src={image} />
          ))}
        </Flex>
      </center>
    </Body>
  );
};

async function getData() {
  console.log(
    ">>> fetching collectives data from OC graphql API",
    process.env.OC_GRAPHQL_API
  );
  const query = `
  query collective($slug: String) {
    Collective (slug: $slug) {
      name,
      description
      memberOf(role: "HOST") {
        collective {
          slug
          name
          description
          image
          stats {
            balance
            monthlySpending
            backers {
              all
            }
          }
          updates {
            createdAt
            title
          }
        }
      }
    }
  }
  `;

  let res, json;
  try {
    res = await fetch(process.env.OC_GRAPHQL_API, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { slug: "allforclimate" } }),
    });
    if (res.status !== 200) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    json = await res.json();
    let collectives = json.data.Collective.memberOf;
    collectives.sort((a, b) => {
      if (a.collective.stats.backers.all > b.collective.stats.backers.all)
        return -1;
      if (a.collective.stats.backers.all < b.collective.stats.backers.all)
        return 1;
      return a.collective.stats.balance > b.collective.stats.balance ? -1 : 1;
    });

    return { collectives };
  } catch (e) {
    console.error("!!! ERROR collectives/mosaic.js", e);
    return { collectives: [] };
  }
}

export async function getStaticProps() {
  return {
    props: await getData(),
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}
