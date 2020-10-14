import styled from 'styled-components';
import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import {useState} from "react";
import TransparencyPage from "@co-labs/oc-transparency-page";

const client = new ApolloClient({
  uri: process.env.OC_GRAPHQL_API_V2 + (process.env.NEXT_PUBLIC_OC_API_KEY || '') ,
  cache: new InMemoryCache()
});

const Body = styled.div`
  max-width: 900px;
  margin: 0 auto;
  font-family: Content-font, Roboto, sans-serif;
  font-weight: 400;
  line-height: 1.625;
  font-size: 16px;
`;


const H2 = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 40px 0 10px;
`;

const Page = ({collectives}) => {

  const [slug, setSlug] = useState(collectives[0].collective.slug)

  return (
    <Body>
      <center>
        <img src="/images/allforclimate-logo.png" height={64}/>
        <H2>We are hosting {collectives.length} collectives</H2>
        <select value={slug} onChange={ e => setSlug(e.target.value) }>
          {collectives.map(node => (
            <option value={node.collective.slug} key={node.collective.slug}>{node.collective.name}</option>
          ))}
        </select>
        <ApolloProvider client={client}>
          <TransparencyPage client={client} slug={slug}/>
        </ApolloProvider>
      </center>
    </Body>
  )
}

async function getData() {
  console.log(">>> fetching collectives data from OC graphql API", process.env.OC_GRAPHQL_API);
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

  const res = await fetch(process.env.OC_GRAPHQL_API, {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables: {slug: "allforclimate"}})
  });
  const json = await res.json();
  let collectives = json.data.Collective.memberOf;
  collectives.sort((a, b) => {
    if (a.collective.stats.backers.all > b.collective.stats.backers.all) return -1;
    if (a.collective.stats.backers.all < b.collective.stats.backers.all) return 1;
    return (a.collective.stats.balance > b.collective.stats.balance) ? -1 : 1;
  });

  return {collectives};
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

export default Page;