import styled from "styled-components";
import { Flex, Box } from "rebass";
import numeral from "../lib/numeral";

const Collective = styled.div`
  width: 150px;
  height: 230px;
  float: left;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  margin: 5px;
`;

const H1 = styled.h1`
  font-size: 14px;
  height: 40px;
  vertical-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

const Description = styled.p`
  font-size: 11.5px;
  overflow: hidden;
  color: #222;
  height: 45px;
  font-weight: 500;
  line-height: 1.3;
`;

const A = styled.a`
  text-decoration: none;
  &:hover {
    > div {
      border: 1px solid red;
    }
  }
`;

const Stats = styled.div`
  color: #555;
`;

const Number = styled.div`
  font-size: 13px;
  font-weight: bold;
  margin-bottom: -5px;
`;

const Label = styled.label`
  font-size: 10px;
`;

export default ({ data }) => {
  return (
    <A href={`https://opencollective.com/${data.slug}`}>
      <Collective>
        <img src={data.imageUrl} height={64} />
        <H1>{data.name}</H1>
        <Description>{data.description}</Description>
        <Stats>
          <Flex justifyContent="space-around">
            <Box>
              <Number>{data.stats.backers.all}</Number>
              <Label>backers</Label>
            </Box>
            <Box>
              <Number>
                {numeral(data.stats.balance / 100).format("$0,0")}
              </Number>
              <Label>balance</Label>
            </Box>
            <Box>
              <Number>
                {numeral(data.stats.monthlySpending / 100).format("$0,0")}
              </Number>
              <Label>burn</Label>
            </Box>
          </Flex>
        </Stats>
      </Collective>
    </A>
  );
};
