import styled from "styled-components";
import Update from "../../components/Update";
import moment from "moment";

import { Flex } from "rebass";

const Body = styled.div``;

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

const H1 = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 40px 0 10px;
`;

const H2 = styled.h2`
  font-size: 18px;
  font-weight: 700;
`;

export default ({ updates }) => {
  let lastMonth;
  return (
    <Body>
      <div className="max-w-screen-md px-4 mx-auto">
        <center>
          <img
            src="https://dao.allforclimate.earth/images/allforclimate-logo-black.png"
            width={128}
          />
          <H1>Latest updates from our collectives</H1>
          <Flex flexWrap="wrap" justifyContent="center">
            {updates.map((update) => {
              const date = new Date(update.createdAt);
              const month = date.getMonth();
              let label = <div />;
              if (month != lastMonth) {
                lastMonth = month;
                label = <H2>{moment(update.createdAt).format("MMMM YYYY")}</H2>;
              }
              return (
                <>
                  {label}
                  <Update data={update} />
                </>
              );
            })}
          </Flex>
        </center>
      </div>
    </Body>
  );
};

async function getData() {
  console.log(
    ">>> fetching updates from OC graphql API",
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
          imageUrl
          updates {
            slug
            createdAt
            summary
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
    const collectives = json.data.Collective.memberOf;
    const updates = [];
    collectives.map((node) => {
      node.collective.updates.map((u) =>
        updates.push({
          ...u,
          collective: {
            slug: node.collective.slug,
            name: node.collective.name,
            imageUrl: node.collective.imageUrl,
          },
          epoch: new Date(u.createdAt).getTime(),
        })
      );
    });
    updates.sort((a, b) => {
      return a.epoch < b.epoch ? 1 : -1;
    });

    return { updates };
  } catch (e) {
    console.log("!!! ERROR collectives/updates.js", e);
    return { updates: [] };
  }
}

export async function getStaticProps() {
  return {
    props: await getData(),
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 10 seconds
    revalidate: 10,
  };
}
