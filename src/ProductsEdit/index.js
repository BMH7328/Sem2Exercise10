import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  NumberInput,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation } from "@tanstack/react-query";
const getProducts = async (id) => {
  const response = await axios.get("http://localhost:5000/products/" + id);
  return response.data;
};
const updateProducts = async ({ id, data }) => {
  const response = await axios({
    method: "PUT",
    url: "http://localhost:5000/products/" + id,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  });
  return response.data;
};
function ProductsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const { isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProducts(id),
    onSuccess: (data) => {
      setName(data.name);
      setDescription(data.description);
      setPrice(data.price);
      setCategory(data.category);
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateProducts,
    onSuccess: () => {
      notifications.show({
        title: "Product Edited",
        color: "green",
      });
      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });
  const handleUpdateProducts = async (event) => {
    event.preventDefault();
    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        name: name,
        description: description,
        price: price,
        category: category,
      }),
    });
  };
  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Edit Product
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the product title here"
          label="Name"
          description="The title of the product"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={description}
          placeholder="Enter the product description here"
          label="description"
          description="The description of the product"
          withAsterisk
          onChange={(event) => setDescription(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={price}
          placeholder="Enter the price here"
          label="Price"
          precision={2}
          description="The price of the product"
          withAsterisk
          onChange={(event) => setPrice(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={category}
          placeholder="Enter the category here"
          label="Category"
          description="The category of the product"
          withAsterisk
          onChange={setCategory}
        />
        <Space h="20px" />
        <Button fullWidth onClick={handleUpdateProducts}>
          Edit Product
        </Button>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="100px" />
    </Container>
  );
}
export default ProductsEdit;
