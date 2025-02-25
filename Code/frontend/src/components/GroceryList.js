import React from "react";
import { Button, Table, Tbody, Tr, Td, Thead, Th } from "@chakra-ui/react";

const GroceryList = ({ groceryList, fetchGroceryList }) => {
  return (
    <div>
      {/* <Button colorScheme="blue" onClick={fetchGroceryList}>Refresh Grocery List</Button> */}

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Item</Th>
          </Tr>
        </Thead>
        <Tbody>
          {groceryList.length > 0 ? (
            groceryList.map((item, index) => (
              <Tr key={index}>
                <Td>{item}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td textAlign="center">No grocery items found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </div>
  );
};

export default GroceryList;
