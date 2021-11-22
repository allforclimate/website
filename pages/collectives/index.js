import styled from "styled-components";
import Link from "next/link";

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

const About = styled.div`
  margin: 50px 0;
`;

const Footer = styled.div``;

const FooterLink = styled.a`
  text-decoration: none;
  margin-right: 20px;
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

export default () => (
  <Body>
    <div className="max-w-screen-md px-4 mx-auto">
      <center>
        <img src="/images/allforclimate-logo-black.png" width={128} />
        <Links>
          <Link href="/collectives/list">
            <StyledLink>List of collectives we are hosting</StyledLink>
          </Link>
          <Link href="/collectives/updates">
            <StyledLink>Latest updates from our collectives</StyledLink>
          </Link>
          <StyledLink href="https://opencollective.com/allforclimate/apply">
            Apply to host your collective
          </StyledLink>
          <StyledLink href="https://docs.allforclimate.earth">
            📕 Documentation
          </StyledLink>
          <StyledLink href="http://opencollective.com/allforclimate-collective/donate">
            💶 Donate
          </StyledLink>
        </Links>

        <About>
          <H2>A fiscal sponsor for your local climate justice group</H2>
          <p>
            As a local group you probably don't have the resources to create
            your own non profit with your own bank account. You also probably
            don't want to use your personal bank account to receive donations
            and manage the expenses for your group. We have created a non profit
            based in Brussels that can act as a fiscal sponsor for you (in the
            eurozone), think of it as your financial back office. <br />
            <a href="https://docs.allforclimate.earth/services/fiscal-hosting">
              More info
            </a>
          </p>

          <H2>
            An easy way for foundations to support local climate justice groups
          </H2>
          <p>
            Local groups don't usually have a bank account where you can wire
            money to, nor do they have the administrative resources to do
            accounting and to write the necessary reports you need. All for
            Climate is set up as a proper non profit entity based in Brussels
            that you can trust. We act as a shared administrative back office so
            that local groups can focus on their actions.
            <br />
            <a href="mailto:info@allforclimate.earth">Contact us</a>
          </p>
        </About>

        <Footer className="text-sm">
          <FooterLink href="https://discord.allforclimate.earth">
            Discord
          </FooterLink>
          <FooterLink href="https://opencollective.com/allforclimate">
            Open Collective
          </FooterLink>
          <FooterLink href="https://github.com/allforclimate">
            GitHub
          </FooterLink>
          <FooterLink href="https://facebook.com/allforclimate">
            Facebook
          </FooterLink>
          <FooterLink href="http://drive.allforclimate.earth">
            Google Drive
          </FooterLink>
          <FooterLink href="mailto:info@allforclimate.earth">Email</FooterLink>
          <br />
          <Label className="text-sm">All for Climate ASBL, Brussels</Label>
        </Footer>
      </center>
    </div>
  </Body>
);
