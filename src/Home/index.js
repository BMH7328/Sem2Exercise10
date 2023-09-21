import { Container, Space, Group } from "@mantine/core";
import Header from "../Header";
import Products from "../Products"; //only works for index.js

function Home() {
  return (
    <Container>
      <Space h="50px" />
      <Group position="center">
        <Header title="Home" page="home" />
      </Group>
      <Space h="30px" />
      <Space h="30px" />
      {/* list all the movies here */}
      <Products />
      <Space h="30px" />
    </Container>
  );
}

export default Home;
