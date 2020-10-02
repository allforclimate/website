import styled from 'styled-components';
import CollectiveCard from '../components/CollectiveCard';
import { Flex, Box } from 'rebass';
import { get } from 'lodash';
import moment from 'moment';

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

const H2 = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 40px 0 10px;
`;

export default ({ collectives }) => {
  let lastActivityString;
  let label;

  return (
    <Body>
      <center>
        <img src="/images/allforclimate-logo.png" height={64} />
        <H2>We are hosting {collectives.length} collectives</H2>
        <Flex flexWrap="wrap" justifyContent="center">
          {collectives.map(node => {
            const newLastActivityString = node.collective.lastActivityAt ? `Last activity: ${moment(node.collective.lastActivityAt).fromNow()}` : 'No activity yet';
            if (newLastActivityString != lastActivityString) {
              lastActivityString = newLastActivityString;
              label = <Box width={1}><H2>{lastActivityString}</H2></Box>
            } else {
              label = <span />
            }
            return (
              <>
                {label}
                <CollectiveCard data={node.collective} />
              </>
            )
          })}
        </Flex>
      </center>
    </Body>
  )
}

async function getData() {
  console.log(">>> fetching inactive collectives data from OC graphql API", process.env.OC_GRAPHQL_API);
  const query = `
  query collective($slug: String) {
    Collective (slug: $slug) {
      name,
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
          updates(limit: 1) {
            createdAt
            title
          }
          expenses(limit: 1) {
            createdAt
            description
          }
          transactions(limit: 1) {
            createdAt
            amount
            description
          }
        }
      }
    }
  }
  `;

  function getTime(datestring) {
    if (!datestring) return 0;
    const d = new Date(datestring);
    return d.getTime();
  }

  function getLastActivityAt(collective) {
    return Math.max(getTime(get(collective, 'updates[0].createdAt')), getTime(get(collective, 'expenses[0].createdAt')), getTime(get(collective, 'transactions[0].createdAt')));
  }

  const res = await fetch(process.env.OC_GRAPHQL_API, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug: "allforclimate" } })
  });
  const json = await res.json();
  let collectives = json.data.Collective.memberOf;
  collectives.sort((a, b) => {
    a.collective.lastActivityAt = getLastActivityAt(a.collective);
    b.collective.lastActivityAt = getLastActivityAt(b.collective);
    return (a.collective.lastActivityAt > b.collective.lastActivityAt) ? 1 : -1;
  });

  return { collectives };
}

export async function getStaticProps() {
  return {
    props: await getData(),
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180
  }
}