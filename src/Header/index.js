import { Link } from "react-router-dom";
import { Group, Space, Divider, Title } from "@mantine/core";
function Header() {
  return (
    <div>
      <Space h="xl" />
      <div className="App">
        <Title align="center" color="dark">
          Welcome to My Store
        </Title>
        <Space h="40px" />
      </div>
      <Space h="md" />
      <Group position="apart">
        <Link
          to="/"
          align="center"
          style={{ textDecoration: "none" }}
          color="blue"
        >
          Home
        </Link>
        <Link
          to="/cart"
          align="center"
          style={{ textDecoration: "none" }}
          color="blue"
        >
          Cart
        </Link>
        <Link
          to="/order"
          align="center"
          style={{ textDecoration: "none" }}
          color="blue"
        >
          My Orders
        </Link>
      </Group>
      <Space h="40px" />
      <Divider />
      <Space h="20px" />
    </div>
  );
}
export default Header;
