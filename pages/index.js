import styled from 'styled-components';

const Links = styled.ul`
  list-style: none;
`;

const Link = styled.li`
  margin: 15px 0;
  border: 1px solid #4A7A84;
  border-radius: 5px;
  max-width: 300px;
  padding: 5px;
  font-family: Helvetica, Arial;
`;

const A = styled.a`
  text-decoration: none;
`;


export default () => (
  <div>
    <center>
      <img src="/images/allforclimate-logo.png" />
      <Links>
        <Link><A href="https://docs.allforclimate.earth">📕 Documentation</A></Link>
        <Link><A href="https://drive.allforclimate.earth">💻 Drive</A></Link>
        <Link><A href="https://opencollective.com/allforclimate">🧾 Open Collective</A></Link>
        <Link><A href="https://github.com/allforclimate">👩🏻‍💻 GitHub</A></Link>
        <Link><A href="https://facebook.com/allforclimate">👨‍👩‍👧‍👦 Facebook</A></Link>
      </Links>
    </center>
  </div>
)