import { Container, Title, Space, Divider } from "@mantine/core";
import Products from "../Products"; //only works for index.js

function Home() {
  return (
    <Container>
      <Space h="50px" />
      <Title align="center" color="dark">
        Welcome To My Store
      </Title>
      <Space h="30px" />
      <Divider />
      <Space h="30px" />
      {/* list all the movies here */}
      <Products />
      <Space h="30px" />
    </Container>
  );
}

export default Home;
