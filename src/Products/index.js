import { Title, Grid, Card, Badge, Group, Space, Button } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const fetchProducts = async (category = "") => {
  const response = await axios.get(
    "http://localhost:5000/products" +
      (category !== "" ? "?category=" + category : "")
  );
  return response.data; //movie data from express
};

const deleteProducts = async (product_id = "") => {
  const response = await axios({
    method: "DELETE",
    url: "http://localhost:5000/products/" + product_id,
  });
  return response.data;
};

function Products() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");

  const {
    isLoading,
    isError,
    data: products,
    error,
  } = useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProducts(category),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", category],
      });
      notifications.show({
        title: "Product Deleted",
        color: "green",
      });
    },
  });

  //extract genre from movie using useMemo
  const memoryProducts = queryClient.getQueryData(["products", ""]);
  const categoryOptions = useMemo(() => {
    let options = [];
    //loop through all the movies to get the genre from each movie
    if (memoryProducts && memoryProducts.length > 0) {
      memoryProducts.forEach((product) => {
        //to make sure genre wasnt already in the options
        if (!options.includes(product.category)) {
          options.push(product.category);
        }
      });
    }
    return options;
  }, [memoryProducts]);
  return (
    <>
      <Space h="20px" />{" "}
      <Group position="apart">
        <Title order={3} align="center">
          Products
        </Title>
        <Button
          component={Link}
          to="/products_add"
          variant="gradient"
          gradient={{ from: "yellow", to: "purple", deg: 105 }}
        >
          Add New
        </Button>
      </Group>
      <Space h="20px" />
      <Group>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
          }}
        >
          <option value="">All categories</option>
          {categoryOptions.map((category) => {
            return (
              <option key={category} value={category}>
                {category}
              </option>
            );
          })}
        </select>
      </Group>
      <Space h="30px" />
      <Grid>
        {products
          ? products.map((product) => {
              return (
                <Grid.Col key={product._id} span={4}>
                  <Card withBorder shadow="sm" p="20px">
                    <Title order={5}>{product.name}</Title>
                    <Space h="20px" />
                    <Group position="apart" spacing="5px">
                      <Badge color="green">{product.price}</Badge>
                      <Badge color="yellow">{product.category}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Group position="center" spacing="5px">
                      <Button fullWidth radius="7px" component={Link}>
                        Add to Cart
                      </Button>
                    </Group>
                    <Space h="20px" />
                    <Group position="apart">
                      <Button
                        component={Link}
                        to={"/products/" + product._id}
                        color="blue"
                        size="xs"
                        radius="50px"
                      >
                        Edit
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        radius="50px"
                        onClick={() => {
                          deleteMutation.mutate(product._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
    </>
  );
}

export default Products;
