import styled from 'styled-components';
import Update from '../components/Update';
import moment from 'moment';

import { Flex } from 'rebass';

const Body = styled.div`
  max-width: 900px;
  margin: 0 auto;
  font-family: Content-font, Roboto, sans-serif;
  font-weight: 400;
  line-height: 1.625;
  font-size: 16px;
`;

const Links = styled.div`
  padding:0;
  margin:0;
`;

const Link = styled.a`
  text-decoration: none;
  display: block;
  margin: 15px 0;
  border: 1px solid #4A7A84;
  border-radius: 5px;
  min-width: 250px;
  max-width: 300px;
  padding: 10px;
  &:hover {
    background: #eee
  }
`;

const About = styled.div`
  margin: 50px 0;
`;

const Footer = styled.div`

`;

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
      <center>
        <img src="/images/allforclimate-logo.png" height={64} />
        <H1>Latest updates from our collectives</H1>
        <Flex flexWrap="wrap" justifyContent="center">
          {updates.map(update => {
            const date = new Date(update.createdAt);
            const month = date.getMonth();
            let label = <div />;
            if (month != lastMonth) {
              lastMonth = month;
              label = <H2>{moment(update.createdAt).format("MMMM YYYY")}</H2>
            }
            return (
              <>
                {label}
                <Update data={update} />
              </>
            )
          })}
        </Flex>
      </center>
    </Body>
  )
}

async function getData() {
  console.log(">>> fetching data from OC graphql API")
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

  const res = await fetch(process.env.OC_GRAPHQL_API, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug: "allforclimate" } })
  });
  const json = await res.json();
  const collectives = json.data.Collective.memberOf;
  const updates = [];
  collectives.map(node => {
    node.collective.updates.map(u => updates.push(
      {
        ...u,
        collective: {
          slug: node.collective.slug,
          name: node.collective.name,
          imageUrl: node.collective.imageUrl,
        },
        epoch: (new Date(u.createdAt)).getTime()
      }));
  })
  updates.sort((a, b) => {
    return (a.epoch < b.epoch) ? 1 : -1;
  });

  return { updates };
}

export async function getStaticProps() {
  return {
    props: await getData(),
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 10 seconds
    unstable_revalidate: 10
  }
}