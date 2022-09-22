import * as React from "react";
import { useQuery } from "@apollo/client";
import { FIND_CATEGORIES } from "../graphql-operations";
import {
  Card,
  Container,
  Spinner,
  Button
} from 'react-bootstrap';

export default function Category(props) {

  const { play, setPlay } = props;
  const { category, setCategory } = props;

  // Get Categories via GraphQL
  const { loading, data } = useQuery(FIND_CATEGORIES);
  const categories = data ? data.categories : null;

  function playGame(e) {
    setCategory(
      e
    )
    setPlay(
      true
    )
  }

  function renderCategories(category) {
    return (
      <Card key={category.title} className="category" style={{ marginTop: '1rem' }}>
        <div className="card-horizontal">
          <Card.Body>
            <Card.Title >{category.title}</Card.Title>
          </Card.Body>
        </div>
        <Card.Footer>
          <Button
            onClick={() => playGame(category)}
            style={{ float: 'right' }}
            variant="info">Play
          </Button>
        </Card.Footer>
      </Card>
    )
  }

  return (
    <Container>
      {loading ? (<Spinner className="loader" animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>) : (
        <Container variant="flush">
          {categories && categories.map((category) => {
            return renderCategories(category);
          })}
        </Container>
      )}
    </Container>
  )

}