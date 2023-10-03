import { Container, Space, Group } from "@mantine/core";
import Header from "../Header";
import Products from "../Products"; //only works for index.js

function Home() {
  return (
    <Container>
      <Space h="50px" />
      <Header title="Home" page="home" />
      <Space h="30px" />
      <Products />
      <Space h="30px" />
    </Container>
  );
}

export default Home;
