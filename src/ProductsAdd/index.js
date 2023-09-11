import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  NumberInput,
  Button,
  Group,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState, useMemo } from "react";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const addProducts = async (data) => {
  const response = await axios({
    method: "POST",
    url: "http://localhost:5000/products",
    headers: { "Content-Type": "application/json" },
    data: data,
  });
  return response.data;
};

function ProductsAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const createMutation = useMutation({
    mutationFn: addProducts,
    onSuccess: () => {
      notifications.show({
        title: "Product Added",
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

  const handleAddNewProducts = async (event) => {
    event.preventDefault();
    createMutation.mutate(
      JSON.stringify({
        name: name,
        description: description,
        price: price,
        category: category,
      })
    );
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Add New Product
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the product name here"
          label="Title"
          description="The name of the product"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={description}
          placeholder="Enter the product description here"
          label="Description"
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
          onChange={setPrice}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={category}
          placeholder="Enter the product category here"
          label="Category"
          description="The category of the product"
          withAsterisk
          onChange={(event) => setCategory(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Button fullWidth onClick={handleAddNewProducts}>
          Add New Products
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

export default ProductsAdd;
