import styled from "styled-components";
import CollectiveCard from "../../components/CollectiveCard";
import { Flex } from "rebass";

const Body = styled.div`
  max-width: 900px;
  margin: 0 auto;
  font-family: Content-font, Roboto, sans-serif;
  font-weight: 400;
  line-height: 1.625;
  font-size: 16px;
`;

const Links = styled.div`
  padding: 0;
  margin: 0;
`;

const Link = styled.a`
  text-decoration: none;
  display: block;
  margin: 15px 0;
  border: 1px solid #4a7a84;
  border-radius: 5px;
  min-width: 250px;
  max-width: 300px;
  padding: 10px;
  &:hover {
    background: #eee;
  }
`;

const About = styled.div`
  margin: 50px 0;
`;

const Footer = styled.div``;

const FooterLink = styled.a`
  text-decoration: none;
  margin-right: 20px;
  font-size: 11pt;
`;

const Label = styled.span`
  color: #555;
  margin-right: 20px;
`;

const H2 = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 40px 0 10px;
`;

export default ({ collectives }) => {
  return (
    <Body>
      <center>
        <img
          src="https://dao.allforclimate.earth/images/allforclimate-logo-black.png"
          width={128}
        />
        <H2>We are hosting {collectives.length} collectives</H2>
        <Flex flexWrap="wrap" justifyContent="center">
          {collectives.map((node) => (
            <CollectiveCard data={node.collective} />
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
          imageUrl
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
    console.error("!!! ERROR collectives/list.js", e);
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
