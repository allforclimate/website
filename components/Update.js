import styled from "styled-components";
import { Flex, Box } from "rebass";
import moment from "moment";

const Update = styled.div`
  width: 100%;
  text-align: left;
  margin: 10px 0;
`;

const FromCollective = styled.div`
  min-width: 84px;
  text-align: center;
  overflow: hidden;
  margin-right: 10px;
  & img {
    max-width: 64px;
    max-height: 64px;
  }
`;

const UpdateContent = styled.div``;

const Metadata = styled.span`
  color: #555;
  font-size: 13px;
  margin-top: -4px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: normal;
  margin: 0 0 -5px 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 20px;
  line-height: 1.3;
  max-width: 80vw;
`;

const Description = styled.p`
  font-size: 14px;
  overflow: hidden;
  color: #222;
  line-height: 1.3;
  margin: 0;
`;

const A = styled.a`
  text-decoration: none;
`;

export default ({ data }) => {
  return (
    <Update>
      <Flex justifyContent="flex-start">
        <FromCollective>
          <A href={`https://opencollective.com/${data.collective.slug}`}>
            <img src={data.collective.imageUrl} />
          </A>
        </FromCollective>
        <UpdateContent>
          <A
            href={`https://opencollective.com/${data.collective.slug}/updates/${data.slug}`}
          >
            <Title>{data.title}</Title>
          </A>
          <Metadata>
            {moment(data.time).format("MMMM Do YYYY")}, {data.collective.name}
          </Metadata>
          <Description>
            <div dangerouslySetInnerHTML={{ __html: data.summary }} />
          </Description>
        </UpdateContent>
      </Flex>
    </Update>
  );
};
